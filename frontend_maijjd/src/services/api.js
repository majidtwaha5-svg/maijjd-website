// Prefer configured API; otherwise use same-origin "/api" to avoid hardcoded localhost in tunnels and prod
const API_BASE_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? `${window.location.origin.replace(/\/$/, '')}/api` : 'http://localhost:5001/api');

// Decide whether to include credentials (cookies) in cross-origin requests
// - Include for same-origin by default
// - Allow overriding via REACT_APP_CREDENTIALS_INCLUDE=true
const ENV_INCLUDE_CREDENTIALS = String(process.env.REACT_APP_CREDENTIALS_INCLUDE || '').toLowerCase() === 'true';
const IS_SAME_ORIGIN = typeof window !== 'undefined' && API_BASE_URL.startsWith(window.location.origin);
// Default to omit credentials for cross-origin Railway backend to avoid blocked cookies
const SHOULD_INCLUDE_CREDENTIALS = ENV_INCLUDE_CREDENTIALS || IS_SAME_ORIGIN;

// Unified token read helper: prefers localStorage, falls back to sessionStorage
function getStored(key) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.requestTimeoutMs = parseInt(process.env.REACT_APP_API_TIMEOUT_MS || '15000', 10);
  }

  // Generic request method with retry logic
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    // Merge headers safely so defaults are not lost when options.headers is undefined
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    // Inject Authorization header automatically when a token exists
    const token = getStored('authToken');
    const mergedHeaders = {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const { headers: _ignored, ...restOptions } = options || {};
    const config = {
      mode: 'cors',
      credentials: SHOULD_INCLUDE_CREDENTIALS ? 'include' : 'omit',
      ...restOptions,
      headers: mergedHeaders,
    };

    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      headers: config.headers,
      mode: config.mode,
      credentials: config.credentials
    });

    let lastError;
    let refreshedOnce = false;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);
        const response = await fetch(url, { ...config, signal: controller.signal });
        clearTimeout(timeoutId);
        
        console.log('📡 API Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          // If unauthorized, try a one-time refresh and retry immediately
          if ((response.status === 401 || response.status === 403) && !refreshedOnce) {
            try {
              await this.tryRefreshTokens();
              // Update Authorization header with the new token and retry
              const newToken = getStored('authToken');
              if (newToken) {
                config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` };
              }
              refreshedOnce = true;
              continue; // retry same attempt index after refresh
            } catch (e) {
              // fall through to normal error handling
            }
          }
          // Try to surface server-provided error details
          let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const text = await response.text();
            if (text) {
              try {
                const body = JSON.parse(text);
                const serverMsg = body.message || body.error || body.code;
                if (serverMsg) errorDetail = `${errorDetail} - ${serverMsg}`;
              } catch (_) {
                // non-JSON body, include as tail if short
                if (text.length < 200) errorDetail = `${errorDetail} - ${text}`;
              }
            }
          } catch (_) {}
          console.error('❌ API Response error:', errorDetail);
          const error = new Error(errorDetail);
          // Do not retry for most client errors
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            error.noRetry = true;
          }
          throw error;
        }
        
        // Try to parse JSON if present; gracefully handle empty or non-JSON bodies
        const contentType = response.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          if (!text) {
            data = {};
          } else {
            try {
              data = JSON.parse(text);
            } catch (_) {
              data = { raw: text };
            }
          }
        }
        console.log('📊 API Response data:', data);
        return data;
      } catch (error) {
        lastError = error;
        console.error(`💥 API Request failed (attempt ${attempt}/${this.maxRetries}):`, {
          url,
          error: error.message,
          stack: error.stack
        });
        
        if (error.name === 'AbortError' || error.noRetry) {
          break;
        }
        if (attempt < this.maxRetries) {
          console.log(`🔄 Retrying in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          this.retryDelay *= 2; // Exponential backoff
        }
      }
    }
    
    const errorMessage = lastError?.message || 'Network error occurred';
    throw new Error(`API request failed for ${endpoint} after ${this.maxRetries} attempts: ${errorMessage}`);
  }

  // GET request
  async get(endpoint) {
    // Add cache-busting timestamp to prevent browser caching
    const separator = endpoint.includes('?') ? '&' : '?';
    const cacheBustEndpoint = `${endpoint}${separator}_t=${Date.now()}`;
    return this.request(cacheBustEndpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: options.headers
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth methods
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async requestPasswordReset(email) {
    return this.post('/auth/forgot', { email });
  }

  async resetPassword(token, newPassword) {
    return this.post('/auth/reset', { token, password: newPassword });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  // Verification codes (email or phone)
  async requestVerification(identifier) {
    return this.post('/auth/verify/request', identifier);
  }

  async confirmVerification(code, identifier) {
    return this.post('/auth/verify/confirm', { code, ...(identifier||{}) });
  }

  // Help users recover their account identifier by phone
  async lookupEmailByPhone(phone) {
    return this.post('/auth/lookup-email', { phone });
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Services methods
  async getServices() {
    console.log('🚀 API Service: Calling getServices()');
    console.log('📍 Full URL will be:', `${this.baseURL}/services`);
    try {
      const result = await this.get('/services');
      console.log('✅ API Service: getServices() successful:', result);
      return result;
    } catch (error) {
      console.error('❌ API Service: getServices() failed:', error);
      throw error;
    }
  }

  // Payments
  async getPlans() {
    return this.get('/payments/config');
  }

  async startCheckout(planId, customCents) {
    const body = customCents ? { plan: planId, custom_amount_cents: customCents } : { plan: planId };
    return this.post('/payments/checkout', body);
  }

  async getStripePublicKey() {
    return this.get('/payments/public-key');
  }

  async openBillingPortal(customerId) {
    return this.post('/payments/portal', { customerId });
  }

  // Software methods
  async getSoftware() {
    return this.get('/software');
  }

  // Users methods
  async getUsers() {
    return this.get('/users');
  }

  // (Removed duplicate auth methods below to satisfy linter)

  // Contact methods
  async submitContact(contactData) {
    return this.post('/contact', contactData);
  }

  // AI Chat methods with enhanced error handling
  async aiChat(message, software, context = {}) {
    try {
      // Validate input parameters
      if (!message || typeof message !== 'string') {
        throw new Error('Message is required and must be a string');
      }
      
      if (!software || typeof software !== 'string') {
        software = 'Maijjd MNJD, MJ, and Team Hub'; // Default software
      }

      // Try authenticated chat first
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Add authentication header
          return await this.post('/ai/chat', { message, software, context }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (authError) {
          console.log('🔄 Authenticated chat failed, falling back to demo endpoint...');
          // Fall back to demo endpoint if authenticated chat fails
        }
      }
      
      // Use demo endpoint for unauthenticated users or as fallback
      return await this.post('/ai/demo/chat', { message, software, context });
      
    } catch (error) {
      console.error('AI Chat failed:', error);
      throw error;
    }
  }

  // Attempt to refresh tokens using stored refreshToken
  async tryRefreshTokens() {
    const refreshToken = getStored('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    const res = await this.post('/auth/refresh', { refreshToken });
    const payload = res?.data || res;
    const newAccess = payload?.authentication?.accessToken || payload?.data?.authentication?.accessToken;
    const newRefresh = payload?.authentication?.refreshToken || payload?.data?.authentication?.refreshToken;
    if (newAccess) localStorage.setItem('authToken', newAccess);
    if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
    return true;
  }

  // Demo AI Chat (no authentication required)
  async demoAiChat(message, software, context = {}) {
    // Validate input parameters
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }
    
    if (!software || typeof software !== 'string') {
      software = 'Maijjd MNJD, MJ, and Team Hub'; // Default software
    }
    
    return this.post('/ai/demo/chat', { message, software, context });
  }

  // AI Voice methods
  async aiVoice(audioData, format, software, context = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required for voice features');
    }
    return this.post('/ai/voice', { audioData, format, software, context });
  }

  // Get AI Models
  async getAiModels() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required for model access');
    }
    return this.get('/ai/models');
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;