/**
 * Maijd AI Software Hub - Enhanced Integration
 * Demonstrates how to use the modular components with existing functionality
 */

class EnhancedAIHub extends MaijdAIHub {
    constructor() {
        super();
        
        // Initialize enhanced modules
        this.utils = AIHubModules.AIHubUtils;
        this.dataManager = new AIHubModules.AIHubDataManager();
        this.chartManager = new AIHubModules.AIHubChartManager();
        this.assistant = new AIHubModules.AIHubAssistant();
        this.projectManager = new AIHubModules.AIHubProjectManager();
        
        // Enhanced features
        this.enhancedFeatures = {
            realTimeUpdates: true,
            advancedCharts: true,
            smartNotifications: true,
            performanceOptimization: true
        };
        
        this.initEnhancedFeatures();
    }
    
    async initEnhancedFeatures() {
        try {
            // Setup enhanced event listeners
            this.setupEnhancedEventListeners();
            
            // Initialize enhanced charts
            this.initEnhancedCharts();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Initialize smart notifications
            this.initSmartNotifications();
            
            console.log('Enhanced AI Hub features initialized successfully');
        } catch (error) {
            console.error('Failed to initialize enhanced features:', error);
        }
    }
    
    setupEnhancedEventListeners() {
        // Listen for custom events from modules
        window.addEventListener('projectCreated', (e) => {
            this.handleEnhancedProjectCreated(e.detail);
        });
        
        window.addEventListener('projectUpdated', (e) => {
            this.handleEnhancedProjectUpdated(e.detail);
        });
        
        window.addEventListener('aiTypingStateChanged', (e) => {
            this.handleAITypingStateChanged(e.detail);
        });
        
        // Enhanced form validation
        this.setupEnhancedFormValidation();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupEnhancedFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.utils.showToast('Please fill in all required fields', 'warning');
                }
            });
        });
        
        // Real-time validation
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', this.utils.debounce(() => {
                this.validateInput(input);
            }, 300));
        });
    }
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateInput(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        if (isValid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
        } else {
            input.classList.remove('border-green-500');
            input.classList.add('border-red-500');
        }
        
        return isValid;
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new project
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('new-project-modal')?.classList.add('show');
            }
            
            // Ctrl/Cmd + K for AI chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('ai-chat-modal')?.classList.add('show');
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => modal.classList.remove('show'));
    }
    
    initEnhancedCharts() {
        // Use enhanced chart manager for better performance
        this.charts = this.chartManager;
        
        // Setup chart refresh intervals
        this.setupChartRefresh();
    }
    
    setupChartRefresh() {
        // Refresh charts every 30 seconds for real-time updates
        setInterval(() => {
            if (this.projects.length > 0) {
                this.updateEnhancedCharts();
            }
        }, 30000);
    }
    
    updateEnhancedCharts() {
        try {
            // Progress chart with enhanced data
            const progressData = {
                labels: this.projects.map(p => p.name.substring(0, 15) + '...'),
                values: this.projects.map(p => p.progress_percentage),
                label: 'Project Progress'
            };
            
            this.chartManager.createProgressChart('progress-chart', progressData, {
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f620',
                showLegend: true
            });
            
            // Status distribution chart
            const statusStats = this.projectManager.getProjectStatistics();
            const statusData = {
                labels: Object.keys(statusStats.byStatus),
                values: Object.values(statusStats.byStatus)
            };
            
            this.chartManager.createDoughnutChart('status-chart', statusData, {
                colors: ['#fbbf24', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#059669'],
                legendPosition: 'right'
            });
            
        } catch (error) {
            console.error('Error updating enhanced charts:', error);
        }
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        this.monitorPerformance();
        
        // Setup memory cleanup
        setInterval(() => {
            this.cleanupMemory();
        }, 60000); // Every minute
    }
    
    monitorPerformance() {
        // Monitor page load performance
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }
        
        // Monitor memory usage (if available)
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            console.log('Memory Usage:', {
                used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
    }
    
    cleanupMemory() {
        // Clear expired cache
        this.dataManager.clearExpiredCache();
        
        // Clear old chart instances
        this.chartManager.clearExpiredCache?.();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
    
    initSmartNotifications() {
        // Smart notification system
        this.notificationQueue = [];
        this.isNotificationVisible = false;
        
        // Setup notification queue processing
        setInterval(() => {
            this.processNotificationQueue();
        }, 1000);
    }
    
    showSmartNotification(message, type = 'info', duration = 5000) {
        this.notificationQueue.push({ message, type, duration });
        this.processNotificationQueue();
    }
    
    processNotificationQueue() {
        if (this.isNotificationVisible || this.notificationQueue.length === 0) {
            return;
        }
        
        const notification = this.notificationQueue.shift();
        this.isNotificationVisible = true;
        
        AIHubUIComponents.createNotification(notification.message, notification.type, notification.duration);
        
        setTimeout(() => {
            this.isNotificationVisible = false;
        }, notification.duration);
    }
    
    // Enhanced project handling
    async handleEnhancedProjectCreated(project) {
        // Use enhanced project manager
        try {
            const enhancedProject = await this.projectManager.createProject(project);
            
            // Show smart notification
            this.showSmartNotification(
                `Project "${enhancedProject.name}" created successfully!`,
                'success'
            );
            
            // Update dashboard with enhanced data
            this.updateEnhancedDashboard();
            
        } catch (error) {
            this.showSmartNotification(
                'Failed to create project. Please try again.',
                'error'
            );
        }
    }
    
    handleEnhancedProjectUpdated(project) {
        // Update local data
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            this.projects[index] = project;
        }
        
        // Show smart notification
        this.showSmartNotification(
            `Project "${project.name}" updated successfully!`,
            'success'
        );
        
        // Update dashboard
        this.updateEnhancedDashboard();
    }
    
    handleAITypingStateChanged(detail) {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            if (detail.isTyping) {
                indicator.classList.add('show');
            } else {
                indicator.classList.remove('show');
            }
        }
    }
    
    updateEnhancedDashboard() {
        // Update basic stats
        this.updateStats();
        
        // Update enhanced charts
        this.updateEnhancedCharts();
        
        // Update project grid with enhanced features
        this.updateEnhancedProjectsGrid();
        
        // Update AI assistants and team with enhanced data
        this.updateAIAssistants();
        this.updateTeam();
    }
    
    updateEnhancedProjectsGrid() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectCard = this.createEnhancedProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    createEnhancedProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105';
        card.onclick = () => this.showEnhancedProjectDetails(project);
        
        const statusClass = `status-${project.status}`;
        const progressColor = this.getProgressColor(project.progress_percentage);
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${this.utils.sanitizeHTML(project.name)}</h3>
                <span class="status-badge ${statusClass}">${project.status}</span>
            </div>
            <p class="text-gray-600 mb-4">${this.utils.sanitizeHTML(project.description)}</p>
            <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-500">${project.category}</span>
                <span class="text-sm text-gray-500">${this.utils.formatCurrency(project.budget)}</span>
            </div>
            <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>${project.progress_percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full transition-all duration-500" 
                         style="width: ${project.progress_percentage}%; background-color: ${progressColor}"></div>
                </div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
                <span>${project.timeline_days} days</span>
                <span>${project.team_members.length} members</span>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-xs text-gray-400">Created: ${this.utils.formatDate(project.created_date)}</span>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                        onclick="event.stopPropagation(); window.aiHub.copyProjectDetails('${project.id}')">
                    Copy Details
                </button>
            </div>
        `;
        
        return card;
    }
    
    getProgressColor(progress) {
        if (progress < 25) return '#ef4444';      // Red
        if (progress < 50) return '#f59e0b';     // Yellow
        if (progress < 75) return '#3b82f6';     // Blue
        return '#10b981';                         // Green
    }
    
    showEnhancedProjectDetails(project) {
        const modal = AIHubUIComponents.createModal(
            'enhanced-project-details',
            project.name,
            this.createEnhancedProjectDetailsContent(project),
            {
                footer: this.createEnhancedProjectDetailsFooter(project)
            }
        );
        
        modal.classList.add('show');
    }
    
    createEnhancedProjectDetailsContent(project) {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Project Information</h4>
                    <div class="space-y-2">
                        <p><strong>Description:</strong> ${this.utils.sanitizeHTML(project.description)}</p>
                        <p><strong>Category:</strong> ${project.category}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${project.status}">${project.status}</span></p>
                        <p><strong>Budget:</strong> ${this.utils.formatCurrency(project.budget)}</p>
                        <p><strong>Timeline:</strong> ${project.timeline_days} days</p>
                        <p><strong>Progress:</strong> ${project.progress_percentage}%</p>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Team & AI Assistants</h4>
                    <div class="space-y-2">
                        <p><strong>Team Members:</strong> ${project.team_members.length}</p>
                        <p><strong>AI Assistants:</strong> ${project.ai_assistants.length}</p>
                        <p><strong>Created:</strong> ${this.utils.formatDate(project.created_date)}</p>
                        <p><strong>Updated:</strong> ${this.utils.formatDate(project.updated_date)}</p>
                    </div>
                    
                    <h4 class="text-lg font-semibold text-gray-800 mb-2 mt-4">Tech Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        ${(project.tech_stack || []).map(tech => 
                            `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">${this.utils.sanitizeHTML(tech)}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Requirements</h4>
                <ul class="list-disc list-inside space-y-1 text-gray-600">
                    ${(project.requirements || []).map(req => 
                        `<li>${this.utils.sanitizeHTML(req)}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }
    
    createEnhancedProjectDetailsFooter(project) {
        return `
            <div class="flex justify-between items-center">
                <div class="flex space-x-2">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onclick="window.aiHub.editProject('${project.id}')">
                        Edit Project
                    </button>
                    <button class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            onclick="window.aiHub.duplicateProject('${project.id}')">
                        Duplicate
                    </button>
                </div>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        onclick="window.aiHub.deleteProject('${project.id}')">
                    Delete Project
                </button>
            </div>
        `;
    }
    
    // Enhanced utility methods
    copyProjectDetails(projectId) {
        const project = this.projectManager.getProjectById(projectId);
        if (project) {
            const details = `
Project: ${project.name}
Description: ${project.description}
Category: ${project.category}
Status: ${project.status}
Budget: ${this.utils.formatCurrency(project.budget)}
Timeline: ${project.timeline_days} days
Progress: ${project.progress_percentage}%
            `.trim();
            
            this.utils.copyToClipboard(details);
        }
    }
    
    editProject(projectId) {
        // Implementation for editing project
        this.utils.showToast('Edit functionality coming soon!', 'info');
    }
    
    duplicateProject(projectId) {
        const project = this.projectManager.getProjectById(projectId);
        if (project) {
            const duplicatedProject = {
                ...project,
                name: `${project.name} (Copy)`,
                created_date: new Date().toISOString(),
                updated_date: new Date().toISOString()
            };
            
            delete duplicatedProject.id;
            this.projectManager.createProject(duplicatedProject);
        }
    }
    
    async deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            const success = this.projectManager.deleteProject(projectId);
            if (success) {
                this.utils.showToast('Project deleted successfully', 'success');
                this.updateEnhancedDashboard();
            } else {
                this.utils.showToast('Failed to delete project', 'error');
            }
        }
    }
    
    // Override existing methods with enhanced functionality
    showNotification(message, type = 'info') {
        this.showSmartNotification(message, type);
    }
    
    async handleChatMessage(e) {
        const form = e.target;
        const input = form.querySelector('input[type="text"]');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage('user', message);
        input.value = '';
        
        try {
            // Use enhanced AI assistant
            const response = await this.assistant.processMessage(message, {
                projects: this.projects,
                user: 'developer'
            });
            
            this.addChatMessage('ai', response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addChatMessage('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

// Initialize enhanced AI Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if modules are available
    if (typeof AIHubModules !== 'undefined') {
        window.aiHub = new EnhancedAIHub();
        console.log('Enhanced AI Hub initialized with modular components');
    } else {
        // Fallback to original AI Hub
        window.aiHub = new MaijdAIHub();
        console.log('Original AI Hub initialized (modules not available)');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAIHub;
}
