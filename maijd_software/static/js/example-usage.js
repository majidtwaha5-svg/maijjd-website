/**
 * Maijd AI Hub - Example Usage
 * Demonstrates practical usage of the modular components
 */

// ============================================================================
// EXAMPLE 1: Basic Utility Usage
// ============================================================================

// Debounce search input
const searchInput = document.getElementById('search-input');
if (searchInput) {
    const debouncedSearch = AIHubUtils.debounce(async (query) => {
        try {
            const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await results.json();
            displaySearchResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }, 500);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Format project budget display
function displayProjectBudget(amount) {
    const formattedAmount = AIHubUtils.formatCurrency(amount);
    const budgetElement = document.getElementById('project-budget');
    if (budgetElement) {
        budgetElement.textContent = formattedAmount;
    }
}

// ============================================================================
// EXAMPLE 2: Data Management with Caching
// ============================================================================

const dataManager = new AIHubDataManager();

// Fetch projects with automatic caching
async function loadProjects() {
    try {
        const projects = await dataManager.fetchWithCache('/api/projects');
        renderProjects(projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
        AIHubUtils.showToast('Failed to load projects', 'error');
    }
}

// Fetch with custom options and retry logic
async function createProject(projectData) {
    try {
        const response = await dataManager.fetchWithRetry('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        const newProject = await response.json();
        
        // Clear cache to ensure fresh data
        dataManager.clearCache();
        
        // Reload projects
        await loadProjects();
        
        AIHubUtils.showToast('Project created successfully!', 'success');
        return newProject;
    } catch (error) {
        console.error('Failed to create project:', error);
        AIHubUtils.showToast('Failed to create project', 'error');
        throw error;
    }
}

// ============================================================================
// EXAMPLE 3: Enhanced UI Components
// ============================================================================

// Create a custom project details modal
function showProjectDetailsModal(project) {
    const modalContent = `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-project-diagram text-blue-600 text-xl"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">${AIHubUtils.sanitizeHTML(project.name)}</h3>
                    <p class="text-sm text-gray-500">${project.category}</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700">${AIHubUtils.sanitizeHTML(project.description)}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">${project.progress_percentage}%</p>
                    <p class="text-sm text-gray-500">Progress</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">${AIHubUtils.formatCurrency(project.budget)}</p>
                    <p class="text-sm text-gray-500">Budget</p>
                </div>
            </div>
        </div>
    `;
    
    const modalFooter = `
        <div class="flex justify-between items-center">
            <button class="px-4 py-2 text-gray-600 hover:text-gray-800" onclick="AIHubUIComponents.closeModal('project-details')">
                Close
            </button>
            <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                        onclick="editProject('${project.id}')">
                    Edit
                </button>
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" 
                        onclick="duplicateProject('${project.id}')">
                    Duplicate
                </button>
            </div>
        </div>
    `;
    
    const modal = AIHubUIComponents.createModal(
        'project-details',
        'Project Details',
        modalContent,
        { footer: modalFooter }
    );
    
    modal.classList.add('show');
}

// Create loading spinner for async operations
async function performAsyncOperation() {
    const container = document.getElementById('operation-container');
    const spinner = AIHubUIComponents.createLoadingSpinner(container, 'large');
    
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success notification
        AIHubUIComponents.createNotification('Operation completed successfully!', 'success');
        
    } catch (error) {
        AIHubUIComponents.createNotification('Operation failed!', 'error');
    } finally {
        AIHubUIComponents.removeLoadingSpinner(spinner);
    }
}

// ============================================================================
// EXAMPLE 4: Advanced Chart Management
// ============================================================================

const chartManager = new AIHubChartManager();

// Create comprehensive project dashboard
function createProjectDashboard() {
    // Progress chart
    const progressData = {
        labels: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
        values: [100, 85, 60, 30, 15],
        label: 'Project Progress'
    };
    
    chartManager.createProgressChart('project-progress-chart', progressData, {
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        showLegend: true
    });
    
    // Status distribution
    const statusData = {
        labels: ['Active', 'On Hold', 'Completed', 'Cancelled'],
        values: [8, 3, 12, 1],
        label: 'Project Status'
    };
    
    chartManager.createDoughnutChart('project-status-chart', statusData, {
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
        legendPosition: 'right'
    });
}

// Update charts with real-time data
function updateProjectCharts(newData) {
    // Update progress chart
    const progressData = {
        labels: newData.map(p => p.name.substring(0, 15) + '...'),
        values: newData.map(p => p.progress_percentage),
        label: 'Project Progress'
    };
    
    chartManager.updateChart('project-progress-chart', progressData);
    
    // Update status chart
    const statusCounts = {};
    newData.forEach(project => {
        statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    });
    
    const statusData = {
        labels: Object.keys(statusCounts),
        values: Object.values(statusCounts)
    };
    
    chartManager.updateChart('project-status-chart', statusData);
}

// ============================================================================
// EXAMPLE 5: AI Assistant Integration
// ============================================================================

const aiAssistant = new AIHubAssistant();

// Enhanced chat interface
class EnhancedChatInterface {
    constructor() {
        this.chatContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('chat-send');
        
        this.setupEventListeners();
        this.loadChatHistory();
    }
    
    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        this.inputField.value = '';
        
        try {
            // Get AI response with context
            const response = await aiAssistant.processMessage(message, {
                projects: window.aiHub?.projects || [],
                user: 'developer',
                timestamp: new Date().toISOString()
            });
            
            // Add AI response to chat
            this.addMessage('assistant', response);
            
        } catch (error) {
            console.error('AI response error:', error);
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        }
    }
    
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `inline-block p-3 rounded-lg max-w-xs ${
            sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
        }`;
        messageBubble.textContent = content;
        
        messageDiv.appendChild(messageBubble);
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    loadChatHistory() {
        const history = aiAssistant.getConversationHistory();
        history.forEach(msg => {
            this.addMessage(msg.role, msg.content);
        });
    }
    
    clearChat() {
        aiAssistant.clearHistory();
        this.chatContainer.innerHTML = '';
    }
}

// ============================================================================
// EXAMPLE 6: Project Management Workflow
// ============================================================================

const projectManager = new AIHubProjectManager();

// Complete project workflow
class ProjectWorkflow {
    constructor() {
        this.currentStep = 0;
        this.workflowSteps = [
            'Requirements Gathering',
            'Design & Planning',
            'Development',
            'Testing & QA',
            'Deployment',
            'Maintenance'
        ];
    }
    
    async createNewProject(projectData) {
        try {
            // Validate project data
            if (!this.validateProjectData(projectData)) {
                throw new Error('Invalid project data');
            }
            
            // Create project
            const project = await projectManager.createProject(projectData);
            
            // Show success notification
            AIHubUtils.showToast(`Project "${project.name}" created successfully!`, 'success');
            
            // Update dashboard
            this.updateProjectDashboard();
            
            return project;
        } catch (error) {
            console.error('Project creation failed:', error);
            AIHubUtils.showToast('Failed to create project: ' + error.message, 'error');
            throw error;
        }
    }
    
    validateProjectData(data) {
        const required = ['name', 'description', 'category', 'timeline_days', 'budget'];
        return required.every(field => data[field] && data[field].toString().trim().length > 0);
    }
    
    async updateProjectProgress(projectId, progress, status) {
        try {
            const updatedProject = projectManager.updateProject(projectId, {
                progress_percentage: progress,
                status: status
            });
            
            if (updatedProject) {
                AIHubUtils.showToast(`Project progress updated to ${progress}%`, 'success');
                this.updateProjectDashboard();
            }
            
            return updatedProject;
        } catch (error) {
            console.error('Progress update failed:', error);
            AIHubUtils.showToast('Failed to update progress', 'error');
            throw error;
        }
    }
    
    getProjectAnalytics() {
        const stats = projectManager.getProjectStatistics();
        
        return {
            totalProjects: stats.total,
            averageProgress: Math.round(stats.averageProgress),
            statusDistribution: stats.byStatus,
            categoryDistribution: stats.byCategory,
            completionRate: stats.total > 0 ? 
                Math.round((stats.byStatus.completed / stats.total) * 100) : 0
        };
    }
    
    updateProjectDashboard() {
        // Update charts
        const projects = projectManager.projects;
        if (projects.length > 0) {
            updateProjectCharts(projects);
        }
        
        // Update statistics
        const analytics = this.getProjectAnalytics();
        this.displayAnalytics(analytics);
    }
    
    displayAnalytics(analytics) {
        // Update dashboard elements
        const elements = {
            'total-projects': analytics.totalProjects,
            'average-progress': analytics.averageProgress + '%',
            'completion-rate': analytics.completionRate + '%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
}

// ============================================================================
// EXAMPLE 7: Performance Monitoring and Optimization
// ============================================================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            memoryUsage: {},
            chartRenderTime: 0,
            apiResponseTime: 0
        };
        
        this.setupMonitoring();
    }
    
    setupMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                this.measurePageLoadTime();
            });
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.measureMemoryUsage();
            }, 30000); // Every 30 seconds
        }
        
        // Monitor chart performance
        this.monitorChartPerformance();
    }
    
    measurePageLoadTime() {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log('Page Load Time:', this.metrics.pageLoadTime, 'ms');
            
            // Show warning if load time is too high
            if (this.metrics.pageLoadTime > 3000) {
                AIHubUtils.showToast('Page load time is slow. Consider optimizing assets.', 'warning');
            }
        }
    }
    
    measureMemoryUsage() {
        const memoryInfo = performance.memory;
        this.metrics.memoryUsage = {
            used: Math.round(memoryInfo.usedJSHeapSize / 1048576),
            total: Math.round(memoryInfo.totalJSHeapSize / 1048576),
            limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576)
        };
        
        console.log('Memory Usage:', this.metrics.memoryUsage);
        
        // Show warning if memory usage is high
        const usagePercentage = (this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit) * 100;
        if (usagePercentage > 80) {
            AIHubUtils.showToast('High memory usage detected. Consider clearing cache.', 'warning');
        }
    }
    
    monitorChartPerformance() {
        const originalCreateChart = chartManager.createProgressChart;
        chartManager.createProgressChart = function(...args) {
            const startTime = performance.now();
            const result = originalCreateChart.apply(this, args);
            const endTime = performance.now();
            
            console.log('Chart render time:', endTime - startTime, 'ms');
            return result;
        };
    }
    
    getPerformanceReport() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.pageLoadTime > 3000) {
            recommendations.push('Optimize page assets and reduce bundle size');
        }
        
        if (this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit > 0.8) {
            recommendations.push('Implement memory cleanup and optimize data structures');
        }
        
        if (this.metrics.chartRenderTime > 100) {
            recommendations.push('Optimize chart rendering and reduce data complexity');
        }
        
        return recommendations;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize all examples when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if modules are available
    if (typeof AIHubModules === 'undefined') {
        console.warn('AI Hub modules not available. Examples will not work.');
        return;
    }
    
    try {
        // Initialize examples
        const chatInterface = new EnhancedChatInterface();
        const projectWorkflow = new ProjectWorkflow();
        const performanceMonitor = new PerformanceMonitor();
        
        // Create project dashboard
        createProjectDashboard();
        
        // Load initial data
        loadProjects();
        
        console.log('All examples initialized successfully');
        
        // Make examples available globally for debugging
        window.examples = {
            chatInterface,
            projectWorkflow,
            performanceMonitor,
            dataManager,
            chartManager,
            aiAssistant,
            projectManager
        };
        
    } catch (error) {
        console.error('Failed to initialize examples:', error);
    }
});

// Export examples for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedChatInterface,
        ProjectWorkflow,
        PerformanceMonitor
    };
}
