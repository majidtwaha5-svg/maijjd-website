// Maijjd Analytics Service
// Tracks user behavior and sends data to admin dashboard

class MaijjdAnalytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.adminDashboardUrl = process.env.REACT_APP_ADMIN_DASHBOARD_URL || 'http://localhost:5002';
    this.isTrackingEnabled = process.env.REACT_APP_TRACKING_ENABLED !== 'false';
    
    // Initialize tracking
    if (this.isTrackingEnabled) {
      this.initializeTracking();
    }
  }

  // Get or create session ID
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('maijjd_session_id');
    if (!sessionId) {
      // Create a more unique session ID with timestamp and random string
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const userId = Math.random().toString(36).substring(2, 10);
      sessionId = `session_${timestamp}_${randomStr}_${userId}`;
      localStorage.setItem('maijjd_session_id', sessionId);
    }
    return sessionId;
  }

  // Initialize tracking
  initializeTracking() {
    // Track initial page view
    this.trackPageView();

    // Track navigation
    window.addEventListener('popstate', () => this.trackPageView());

    // Track form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        this.trackEvent('form_submit', 'form_submission', {
          formId: e.target.id || e.target.className,
          formAction: e.target.action
        });
      }
    });

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.trackEvent('click', 'button_click', {
          element: target.tagName,
          text: target.textContent,
          href: target.href || null
        });
      }
    });

    console.log('🎯 Maijjd Analytics initialized');
  }

  // Track page view
  async trackPageView() {
    if (!this.isTrackingEnabled) return;

    try {
      const response = await fetch(`${this.adminDashboardUrl}/api/tracking/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          url: window.location.href,
          title: document.title
        })
      });

      if (!response.ok) {
        console.warn('Failed to track page view');
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  // Track custom event
  async trackEvent(eventType, eventName, data = {}) {
    if (!this.isTrackingEnabled) return;

    try {
      const response = await fetch(`${this.adminDashboardUrl}/api/tracking/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          event: eventType,
          name: eventName,
          data: data
        })
      });

      if (!response.ok) {
        console.warn('Failed to track event');
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  // Track conversion
  async trackConversion(type, value = 0, currency = 'USD') {
    if (!this.isTrackingEnabled) return;

    try {
      const response = await fetch(`${this.adminDashboardUrl}/api/tracking/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          type: type,
          value: value,
          currency: currency
        })
      });

      if (!response.ok) {
        console.warn('Failed to track conversion');
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  // Track specific user actions
  trackContactForm() {
    this.trackEvent('form_submit', 'contact_form');
  }

  trackServiceView(serviceName) {
    this.trackEvent('page_view', 'service_view', { service: serviceName });
  }

  trackAboutPage() {
    this.trackEvent('page_view', 'about_page');
  }

  trackHomePage() {
    this.trackEvent('page_view', 'home_page');
  }

  trackAIChat() {
    this.trackEvent('click', 'ai_chat_opened');
  }

  trackNavigation(route) {
    this.trackEvent('navigation', 'route_change', { route: route });
  }

  // Get session ID
  getSessionId() {
    return this.sessionId;
  }

  // Enable/disable tracking
  setTrackingEnabled(enabled) {
    this.isTrackingEnabled = enabled;
    localStorage.setItem('maijjd_tracking_enabled', enabled.toString());
  }

  // Check if tracking is enabled
  isTrackingEnabled() {
    return this.isTrackingEnabled;
  }
}

// Create global instance
const analytics = new MaijjdAnalytics();

// Make it available globally
window.MaijjdAnalytics = analytics;

export default analytics;
