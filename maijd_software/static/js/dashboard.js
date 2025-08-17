/**
 * Maijd Software Suite - Premium Dashboard JavaScript
 * Handles interactive features, real-time updates, and payment processing
 */

class MaijdDashboard {
    constructor() {
        this.currentUser = null;
        this.usageStats = {};
        this.subscriptionInfo = {};
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.startAutoRefresh();
        this.initializeCharts();
    }

    bindEvents() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                this.handleAction(e.target.dataset.action, e.target.dataset);
            }
        });

        // Form submissions
        const forms = document.querySelectorAll('form[data-ajax]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Real-time search
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Theme toggle
        const themeToggle = document.querySelector('#themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    async loadUserData() {
        try {
            const response = await fetch('/api/usage');
            if (response.ok) {
                const data = await response.json();
                this.usageStats = data.usage_stats || {};
                this.subscriptionInfo = data.subscription_info || {};
                this.updateDashboard();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading user data', 'error');
        }
    }

    updateDashboard() {
        // Update usage meters
        this.updateUsageMeters();
        
        // Update subscription status
        this.updateSubscriptionStatus();
        
        // Update recent activity
        this.updateRecentActivity();
        
        // Update notifications
        this.updateNotifications();
    }

    updateUsageMeters() {
        const wordMeter = document.querySelector('#wordUsageMeter');
        const apiMeter = document.querySelector('#apiUsageMeter');
        
        if (wordMeter && this.usageStats.words_used !== undefined) {
            const percentage = Math.min((this.usageStats.words_used / this.usageStats.words_limit) * 100, 100);
            wordMeter.style.width = `${percentage}%`;
            wordMeter.className = `progress-bar ${this.getUsageBarClass(percentage)}`;
        }
        
        if (apiMeter && this.usageStats.api_used_today !== undefined) {
            const percentage = Math.min((this.usageStats.api_used_today / this.usageStats.api_daily_limit) * 100, 100);
            apiMeter.style.width = `${percentage}%`;
            apiMeter.className = `progress-bar ${this.getUsageBarClass(percentage)}`;
        }
    }

    getUsageBarClass(percentage) {
        if (percentage >= 90) return 'progress-bar-danger';
        if (percentage >= 75) return 'progress-bar-warning';
        return 'progress-bar-success';
    }

    updateSubscriptionStatus() {
        const statusElement = document.querySelector('#subscriptionStatus');
        const tierElement = document.querySelector('#subscriptionTier');
        
        if (statusElement) {
            statusElement.textContent = this.subscriptionInfo.status || 'Free';
            statusElement.className = `badge badge-${this.getStatusBadgeClass(this.subscriptionInfo.status)}`;
        }
        
        if (tierElement) {
            tierElement.textContent = this.subscriptionInfo.tier_name || 'Free';
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'active': return 'success';
            case 'trial': return 'warning';
            case 'cancelled': return 'secondary';
            case 'expired': return 'danger';
            default: return 'secondary';
        }
    }

    updateRecentActivity() {
        const activityContainer = document.querySelector('#recentActivity');
        if (!activityContainer) return;

        // Simulate recent activity updates
        const activities = [
            { type: 'words', text: 'Processed 1,250 words', time: '2 hours ago', icon: 'fa-file-alt', color: 'text-blue-500' },
            { type: 'api', text: 'API request to text processor', time: '5 hours ago', icon: 'fa-code', color: 'text-green-500' },
            { type: 'payment', text: 'Subscription renewed', time: '1 day ago', icon: 'fa-credit-card', color: 'text-purple-500' }
        ];

        const activityHTML = activities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in">
                <div class="flex items-center">
                    <i class="fas ${activity.icon} ${activity.color} mr-3"></i>
                    <span class="text-sm text-gray-700">${activity.text}</span>
                </div>
                <span class="text-xs text-gray-500">${activity.time}</span>
            </div>
        `).join('');

        activityContainer.innerHTML = activityHTML;
    }

    updateNotifications() {
        const notificationContainer = document.querySelector('#notifications');
        if (!notificationContainer) return;

        const notifications = [];
        
        // Check usage limits
        if (this.usageStats.words_used && this.usageStats.words_limit) {
            const wordPercentage = (this.usageStats.words_used / this.usageStats.words_limit) * 100;
            if (wordPercentage >= 90) {
                notifications.push({
                    type: 'warning',
                    message: 'You\'re approaching your word limit for this month',
                    icon: 'fa-exclamation-triangle'
                });
            }
        }

        if (this.usageStats.api_used_today && this.usageStats.api_daily_limit) {
            const apiPercentage = (this.usageStats.api_used_today / this.usageStats.api_daily_limit) * 100;
            if (apiPercentage >= 90) {
                notifications.push({
                    type: 'warning',
                    message: 'You\'re approaching your daily API limit',
                    icon: 'fa-exclamation-triangle'
                });
            }
        }

        // Check subscription status
        if (this.subscriptionInfo.status === 'trial') {
            const trialDays = this.getTrialDaysRemaining();
            if (trialDays <= 3) {
                notifications.push({
                    type: 'info',
                    message: `Your trial expires in ${trialDays} days`,
                    icon: 'fa-info-circle'
                });
            }
        }

        if (notifications.length === 0) {
            notificationContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                    <p>All good! No notifications at this time.</p>
                </div>
            `;
        } else {
            const notificationHTML = notifications.map(notification => `
                <div class="alert alert-${notification.type} animate-fade-in">
                    <i class="fas ${notification.icon} mr-2"></i>
                    ${notification.message}
                </div>
            `).join('');
            notificationContainer.innerHTML = notificationHTML;
        }
    }

    getTrialDaysRemaining() {
        if (!this.subscriptionInfo.start_date) return 0;
        const startDate = new Date(this.subscriptionInfo.start_date);
        const trialEnd = new Date(startDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
        const now = new Date();
        const diffTime = trialEnd - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        this.updateInterval = setInterval(() => {
            this.loadUserData();
        }, 30000);

        // Refresh usage meters every 5 seconds for real-time feel
        setInterval(() => {
            this.updateUsageMeters();
        }, 5000);
    }

    async handleAction(action, data) {
        switch (action) {
            case 'cancel-subscription':
                this.showCancelModal();
                break;
            case 'upgrade-plan':
                window.location.href = '/subscribe/upgrade';
                break;
            case 'view-invoice':
                this.viewInvoice(data.invoiceId);
                break;
            case 'download-report':
                this.downloadReport(data.reportType);
                break;
            case 'refresh-data':
                await this.loadUserData();
                this.showNotification('Data refreshed successfully', 'success');
                break;
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(result.message || 'Action completed successfully', 'success');
                if (result.redirect) {
                    window.location.href = result.redirect;
                }
            } else {
                this.showNotification(result.error || 'An error occurred', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('An unexpected error occurred', 'error');
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    showCancelModal() {
        const modal = document.querySelector('#cancelModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideCancelModal() {
        const modal = document.querySelector('#cancelModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async confirmCancel() {
        try {
            const response = await fetch('/cancel_subscription');
            if (response.ok) {
                this.showNotification('Subscription cancelled successfully', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showNotification('Error cancelling subscription', 'error');
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            this.showNotification('Error cancelling subscription', 'error');
        }
        this.hideCancelModal();
    }

    async viewInvoice(invoiceId) {
        try {
            const response = await fetch(`/api/invoice/${invoiceId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${invoiceId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error viewing invoice:', error);
            this.showNotification('Error viewing invoice', 'error');
        }
    }

    async downloadReport(reportType) {
        try {
            const response = await fetch(`/api/report/${reportType}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.showNotification('Report downloaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error downloading report:', error);
            this.showNotification('Error downloading report', 'error');
        }
    }

    handleSearch(query) {
        const searchableElements = document.querySelectorAll('[data-searchable]');
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const isVisible = text.includes(query.toLowerCase());
            element.style.display = isVisible ? 'block' : 'none';
        });
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark');
        
        if (isDark) {
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    initializeCharts() {
        // Initialize usage charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.createUsageChart();
            this.createActivityChart();
        }
    }

    createUsageChart() {
        const ctx = document.getElementById('usageChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Words Processed',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }, {
                    label: 'API Requests',
                    data: [45, 59, 80, 81, 56, 55, 40],
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Weekly Usage Overview'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Text Processing', 'API Calls', 'File Uploads', 'Downloads'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        '#2563eb',
                        '#059669',
                        '#d97706',
                        '#7c3aed'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Feature Usage Distribution'
                    }
                }
            }
        });
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 alert alert-${type} animate-fade-in`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)} mr-2"></i>
            ${message}
            <button onclick="this.parentElement.remove()" class="ml-3 text-sm font-medium hover:opacity-75">
                ×
            </button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.maijdDashboard = new MaijdDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaijdDashboard;
}
