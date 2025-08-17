/**
 * Maijd AI Software Hub - Modular JavaScript Components
 * Provides enhanced functionality, better organization, and reusable components
 */

// ============================================================================
// UTILITY MODULE
// ============================================================================
class AIHubUtils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy', 'error');
        });
    }

    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'warning' ? 'bg-yellow-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('translate-y-0'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// ============================================================================
// DATA MANAGEMENT MODULE
// ============================================================================
class AIHubDataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async fetchWithCache(url, options = {}) {
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await this.fetchWithRetry(url, options);
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    async fetchWithRetry(url, options = {}, attempt = 1) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response;
        } catch (error) {
            if (attempt < this.retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                return this.fetchWithRetry(url, options, attempt + 1);
            }
            throw error;
        }
    }

    clearCache() {
        this.cache.clear();
    }

    clearExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }
}

// ============================================================================
// UI COMPONENTS MODULE
// ============================================================================
class AIHubUIComponents {
    static createModal(id, title, content, options = {}) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        
        const modalContent = `
            <div class="modal-content bg-white rounded-lg shadow-xl max-w-2xl mx-auto mt-20 relative">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-800">${title}</h2>
                    <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div class="p-6">
                    ${content}
                </div>
                ${options.footer ? `<div class="p-6 border-t border-gray-200">${options.footer}</div>` : ''}
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(id));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(id);
        });
        
        return modal;
    }

    static closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    static createNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'warning' ? 'bg-yellow-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('translate-y-0'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    static createLoadingSpinner(container, size = 'medium') {
        const sizes = {
            small: 'w-4 h-4',
            medium: 'w-8 h-8',
            large: 'w-12 h-12'
        };
        
        const spinner = document.createElement('div');
        spinner.className = `loading-spinner ${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`;
        
        if (container) {
            container.appendChild(spinner);
        }
        
        return spinner;
    }

    static removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.remove();
        }
    }

    static createTooltip(element, text, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded opacity-0 pointer-events-none transition-opacity duration-200';
        tooltip.textContent = text;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', () => {
            tooltip.classList.remove('opacity-0');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.add('opacity-0');
        });
        
        return tooltip;
    }
}

// ============================================================================
// CHART ENHANCEMENT MODULE
// ============================================================================
class AIHubChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultColors = [
            '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ];
    }

    createProgressChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'Progress',
                    data: data.values,
                    borderColor: options.borderColor || this.defaultColors[0],
                    backgroundColor: options.backgroundColor || this.defaultColors[0] + '20',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: options.borderColor || this.defaultColors[0],
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    createDoughnutChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: options.colors || this.defaultColors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: options.legendPosition || 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update('active');
        }
    }

    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    destroyAllCharts() {
        for (const [id, chart] of this.charts) {
            chart.destroy();
        }
        this.charts.clear();
    }
}

// ============================================================================
// AI ASSISTANT MODULE
// ============================================================================
class AIHubAssistant {
    constructor() {
        this.conversationHistory = [];
        this.maxHistoryLength = 50;
        this.isTyping = false;
    }

    async processMessage(message, context = {}) {
        // Add to conversation history
        this.addToHistory('user', message);
        
        // Show typing indicator
        this.setTypingState(true);
        
        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            
            // Generate response based on message content and context
            const response = this.generateResponse(message, context);
            
            // Add AI response to history
            this.addToHistory('assistant', response);
            
            this.setTypingState(false);
            return response;
        } catch (error) {
            this.setTypingState(false);
            const errorResponse = 'I apologize, but I encountered an error processing your request. Please try again.';
            this.addToHistory('assistant', errorResponse);
            return errorResponse;
        }
    }

    generateResponse(message, context) {
        const lowerMessage = message.toLowerCase();
        
        // Project-related queries
        if (lowerMessage.includes('project') || lowerMessage.includes('create') || lowerMessage.includes('new')) {
            return this.getProjectResponse(message, context);
        }
        
        // Technical queries
        if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
            return this.getTechResponse(message, context);
        }
        
        // Development queries
        if (lowerMessage.includes('develop') || lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            return this.getDevelopmentResponse(message, context);
        }
        
        // General queries
        return this.getGeneralResponse(message, context);
    }

    getProjectResponse(message, context) {
        const responses = [
            "I can help you create a new project! What type of software are you looking to build?",
            "Great! Let's start your project. What's your main goal or objective?",
            "I'd be happy to assist with project creation. What's your budget and timeline?",
            "Let me help you set up your project. What industry or domain is this for?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getTechResponse(message, context) {
        const responses = [
            "For modern web applications, I recommend React/Vue.js for frontend and Node.js/Python for backend.",
            "The best tech stack depends on your requirements. Let me know what you're building!",
            "I can suggest optimal technology combinations based on your project needs and team expertise.",
            "Consider factors like scalability, performance, and team familiarity when choosing technologies."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDevelopmentResponse(message, context) {
        const responses = [
            "I can guide you through the development process step by step.",
            "Let me help you with best practices and implementation strategies.",
            "I can provide code examples and architectural guidance for your project.",
            "Development is a journey! I'm here to help you navigate the challenges."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getGeneralResponse(message, context) {
        const responses = [
            "I'm here to help with your software development needs. What would you like to know?",
            "That's an interesting question! Let me provide some insights and guidance.",
            "I can assist you with various aspects of software development and project management.",
            "Great question! Let me break this down and provide you with helpful information."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addToHistory(role, content) {
        this.conversationHistory.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        
        // Maintain history length
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }

    setTypingState(isTyping) {
        this.isTyping = isTyping;
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('aiTypingStateChanged', { detail: { isTyping } }));
    }

    getConversationHistory() {
        return [...this.conversationHistory];
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// ============================================================================
// PROJECT MANAGEMENT MODULE
// ============================================================================
class AIHubProjectManager {
    constructor() {
        this.projects = [];
        this.categories = [
            'Web Application', 'Mobile App', 'Desktop Software', 'API Service',
            'Database System', 'AI/ML Project', 'IoT Application', 'Game Development'
        ];
        this.statuses = [
            'planning', 'design', 'development', 'testing', 'deployment', 'completed'
        ];
    }

    async createProject(projectData) {
        try {
            const project = {
                id: AIHubUtils.generateId(),
                ...projectData,
                status: 'planning',
                progress_percentage: 0,
                created_date: new Date().toISOString(),
                updated_date: new Date().toISOString(),
                team_members: [],
                ai_assistants: [],
                tech_stack: projectData.tech_stack || [],
                requirements: projectData.requirements || []
            };
            
            // Validate project data
            if (!this.validateProject(project)) {
                throw new Error('Invalid project data');
            }
            
            // Add to local array
            this.projects.push(project);
            
            // Emit event for real-time updates
            window.dispatchEvent(new CustomEvent('projectCreated', { detail: project }));
            
            return project;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    validateProject(project) {
        return project.name && 
               project.description && 
               project.category && 
               project.timeline_days > 0 && 
               project.budget > 0;
    }

    updateProject(projectId, updates) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index === -1) return null;
        
        this.projects[index] = {
            ...this.projects[index],
            ...updates,
            updated_date: new Date().toISOString()
        };
        
        // Emit event for real-time updates
        window.dispatchEvent(new CustomEvent('projectUpdated', { detail: this.projects[index] }));
        
        return this.projects[index];
    }

    deleteProject(projectId) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index === -1) return false;
        
        const deletedProject = this.projects.splice(index, 1)[0];
        
        // Emit event for real-time updates
        window.dispatchEvent(new CustomEvent('projectDeleted', { detail: deletedProject }));
        
        return true;
    }

    getProjectById(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    getProjectsByStatus(status) {
        return this.projects.filter(p => p.status === status);
    }

    getProjectsByCategory(category) {
        return this.projects.filter(p => p.category === category);
    }

    updateProjectProgress(projectId, progress) {
        return this.updateProject(projectId, { progress_percentage: Math.min(100, Math.max(0, progress)) });
    }

    getProjectStatistics() {
        const total = this.projects.length;
        const byStatus = {};
        const byCategory = {};
        
        this.statuses.forEach(status => byStatus[status] = 0);
        this.categories.forEach(category => byCategory[category] = 0);
        
        this.projects.forEach(project => {
            byStatus[project.status]++;
            byCategory[project.category]++;
        });
        
        return {
            total,
            byStatus,
            byCategory,
            averageProgress: total > 0 ? 
                this.projects.reduce((sum, p) => sum + p.progress_percentage, 0) / total : 0
        };
    }
}

// ============================================================================
// EXPORT MODULES
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIHubUtils,
        AIHubDataManager,
        AIHubUIComponents,
        AIHubChartManager,
        AIHubAssistant,
        AIHubProjectManager
    };
} else {
    // Browser environment - attach to window
    window.AIHubModules = {
        AIHubUtils,
        AIHubDataManager,
        AIHubUIComponents,
        AIHubChartManager,
        AIHubAssistant,
        AIHubProjectManager
    };
}
