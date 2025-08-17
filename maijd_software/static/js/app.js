/**
 * Maijd Software Suite - Main Application JavaScript
 * Core functionality and initialization for the web application
 */

class MaijdApp {
    constructor() {
        this.initialized = false;
        this.config = {
            apiBase: '/api',
            socketUrl: window.location.origin,
            debug: false,
            autoRefresh: true,
            refreshInterval: 30000
        };
        
        this.init();
    }
    
    init() {
        try {
            this.loadConfig();
            this.bindEvents();
            this.initializeComponents();
            this.initialized = true;
            console.log('Maijd App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Maijd App:', error);
        }
    }
    
    loadConfig() {
        // Load configuration from environment or defaults
        if (window.maijdConfig) {
            this.config = { ...this.config, ...window.maijdConfig };
        }
        
        // Load from meta tags if available
        const apiBase = document.querySelector('meta[name="api-base"]');
        if (apiBase) {
            this.config.apiBase = apiBase.getAttribute('content');
        }
    }
    
    bindEvents() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.onPageLoad();
        });
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
        
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]')) {
                this.handleNavigation(e);
            }
        });
    }
    
    initializeComponents() {
        // Initialize theme
        this.initializeTheme();
        
        // Initialize notifications
        this.initializeNotifications();
        
        // Initialize auto-save for forms
        this.initializeAutoSave();
        
        // Initialize performance monitoring
        this.initializePerformanceMonitoring();
    }
    
    onPageLoad() {
        // Page-specific initialization
        const page = this.getCurrentPage();
        
        switch (page) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'login':
                this.initializeLogin();
                break;
            case 'register':
                this.initializeRegister();
                break;
            case 'subscribe':
                this.initializeSubscribe();
                break;
            default:
                this.initializeHome();
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('login')) return 'login';
        if (path.includes('register')) return 'register';
        if (path.includes('subscribe')) return 'subscribe';
        return 'home';
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('maijd-theme') || 'auto';
        this.setTheme(savedTheme);
        
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }
    
    setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        
        root.setAttribute('data-theme', theme);
        localStorage.setItem('maijd-theme', theme);
        
        // Update theme toggle button if exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
    
    initializeNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center p-4 rounded-lg shadow-lg max-w-sm w-full bg-white border-l-4 border-${this.getNotificationColor(type)}-500">
                <div class="flex-shrink-0">
                    <i class="fas fa-${this.getNotificationIcon(type)} text-${this.getNotificationColor(type)}-500"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }
    
    getNotificationColor(type) {
        const colors = {
            success: 'green',
            error: 'red',
            warning: 'yellow',
            info: 'blue'
        };
        return colors[type] || 'blue';
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    initializeAutoSave() {
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            this.setupAutoSave(form);
        });
    }
    
    setupAutoSave(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let timeout;
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.saveFormData(form);
                }, 1000);
            });
        });
    }
    
    async saveFormData(form) {
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const response = await fetch('/api/autosave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId: form.id || 'unknown',
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                this.showSaveIndicator(form, true);
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
            this.showSaveIndicator(form, false);
        }
    }
    
    showSaveIndicator(form, success) {
        let indicator = form.querySelector('.save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'save-indicator text-xs mt-2';
            form.appendChild(indicator);
        }
        
        indicator.textContent = success ? '✓ Saved' : '✗ Save failed';
        indicator.className = `save-indicator text-xs mt-2 ${success ? 'text-green-600' : 'text-red-600'}`;
        
        setTimeout(() => {
            indicator.remove();
        }, 3000);
    }
    
    initializePerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.logPerformanceMetric(entry);
                    }
                });
                
                observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
            } catch (error) {
                console.warn('Performance monitoring not available:', error);
            }
        }
    }
    
    logPerformanceMetric(entry) {
        if (this.config.debug) {
            console.log('Performance Metric:', entry.name, entry.startTime);
        }
        
        // Send to analytics if configured
        if (this.config.analyticsEndpoint) {
            this.sendAnalytics('performance', {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration
            });
        }
    }
    
    async sendAnalytics(event, data) {
        try {
            await fetch(this.config.analyticsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: event,
                    data: data,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                })
            });
        } catch (error) {
            console.warn('Analytics failed:', error);
        }
    }
    
    handleFormSubmit(e) {
        const form = e.target;
        const submitButton = form.querySelector('[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Re-enable after a delay (in case of errors)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'Submit';
            }, 10000);
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('data-nav');
        
        if (target) {
            window.location.href = target;
        }
    }
    
    // Page-specific initializations
    initializeDashboard() {
        console.log('Initializing dashboard...');
        // Dashboard-specific code will be handled by dashboard.js
    }
    
    initializeLogin() {
        console.log('Initializing login page...');
        // Login-specific code
    }
    
    initializeRegister() {
        console.log('Initializing register page...');
        // Register-specific code
    }
    
    initializeSubscribe() {
        console.log('Initializing subscribe page...');
        // Subscribe-specific code
    }
    
    initializeHome() {
        console.log('Initializing home page...');
        // Home page-specific code
    }
    
    // Utility methods
    async apiCall(endpoint, options = {}) {
        const url = `${this.config.apiBase}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        };
        
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
        }
    }
    
    // Public methods for external use
    getConfig() {
        return { ...this.config };
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showWarning(message) {
        this.showNotification(message, 'warning');
    }
    
    showInfo(message) {
        this.showNotification(message, 'info');
    }
}

// Initialize the app when DOM is ready
let maijdApp;

document.addEventListener('DOMContentLoaded', () => {
    maijdApp = new MaijdApp();
});

// Make app globally accessible
window.maijdApp = maijdApp;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaijdApp;
}
