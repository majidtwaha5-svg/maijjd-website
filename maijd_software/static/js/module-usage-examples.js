/**
 * Maijd Software Suite - Module Usage Examples
 * Comprehensive examples demonstrating how to use all available modules
 * 
 * This file shows practical usage of:
 * - AIHubUtils (Utility functions)
 * - AIHubDataManager (Data management with caching)
 * - AIHubUIComponents (UI components and modals)
 * - AIHubChartManager (Chart creation and management)
 * - AIHubAssistant (AI-powered assistance)
 * - AIHubProjectManager (Project management)
 * - MaijdEnhancedFeatures (Advanced features suite)
 * - AIAssistant (Enhanced AI interface)
 * - PerformanceMonitor (Performance tracking)
 * - RealTimeUpdates (Real-time data updates)
 * - AdvancedCharts (Advanced charting)
 * - NotificationCenter (Notification system)
 * - ThemeManager (Theme management)
 * - ShortcutManager (Keyboard shortcuts)
 * - AutoSave (Automatic saving)
 */

// ============================================================================
// 1. BASIC UTILITY MODULE USAGE
// ============================================================================

console.log('=== AIHubUtils Examples ===');

// Debounce search functionality
function setupSearchWithDebounce() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debouncedSearch = AIHubUtils.debounce(async (query) => {
            try {
                const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await results.json();
                displaySearchResults(data);
            } catch (error) {
                console.error('Search failed:', error);
                AIHubUtils.showToast('Search failed', 'error');
            }
        }, 500);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
}

// Throttle scroll events
function setupScrollThrottling() {
    const throttledScroll = AIHubUtils.throttle(() => {
        // Update scroll position indicator
        updateScrollIndicator();
    }, 100);
    
    window.addEventListener('scroll', throttledScroll);
}

// Format and display data
function displayFormattedData() {
    const amount = 1250.75;
    const date = '2024-01-15';
    
    const formattedAmount = AIHubUtils.formatCurrency(amount);
    const formattedDate = AIHubUtils.formatDate(date);
    
    console.log(`Amount: ${formattedAmount}`);
    console.log(`Date: ${formattedDate}`);
    
    // Generate unique ID
    const uniqueId = AIHubUtils.generateId();
    console.log(`Generated ID: ${uniqueId}`);
}

// Validate user input
function validateUserInput() {
    const email = 'user@example.com';
    const isValidEmail = AIHubUtils.validateEmail(email);
    
    if (isValidEmail) {
        AIHubUtils.showToast('Valid email address', 'success');
    } else {
        AIHubUtils.showToast('Invalid email address', 'error');
    }
}

// ============================================================================
// 2. DATA MANAGEMENT MODULE USAGE
// ============================================================================

console.log('=== AIHubDataManager Examples ===');

const dataManager = new AIHubDataManager();

// Fetch data with caching
async function loadProjectsWithCache() {
    try {
        const projects = await dataManager.fetchWithCache('/api/projects', {
            cacheTime: 5 * 60 * 1000 // 5 minutes
        });
        
        renderProjects(projects);
        AIHubUtils.showToast(`Loaded ${projects.length} projects`, 'success');
    } catch (error) {
        console.error('Failed to load projects:', error);
        AIHubUtils.showToast('Failed to load projects', 'error');
    }
}

// Fetch with retry logic
async function createProjectWithRetry(projectData) {
    try {
        const response = await dataManager.fetchWithRetry('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        }, 3); // 3 retry attempts
        
        const newProject = await response.json();
        
        // Clear cache to ensure fresh data
        dataManager.clearCache();
        
        // Reload projects
        await loadProjectsWithCache();
        
        AIHubUtils.showToast('Project created successfully!', 'success');
        return newProject;
    } catch (error) {
        console.error('Failed to create project:', error);
        AIHubUtils.showToast('Failed to create project', 'error');
        throw error;
    }
}

// ============================================================================
// 3. UI COMPONENTS MODULE USAGE
// ============================================================================

console.log('=== AIHubUIComponents Examples ===');

// Create and show modal
function showProjectModal(project) {
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
            
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Budget: ${AIHubUtils.formatCurrency(project.budget)}</span>
                <span class="text-sm text-gray-500">Status: ${project.status}</span>
            </div>
        </div>
    `;
    
    AIHubUIComponents.createModal('project-modal', 'Project Details', modalContent, {
        size: 'medium',
        showCloseButton: true,
        onClose: () => console.log('Project modal closed')
    });
}

// Show notifications
function showSystemNotifications() {
    AIHubUIComponents.createNotification('System update available', 'info', 5000);
    AIHubUIComponents.createNotification('Project saved successfully', 'success', 3000);
    AIHubUIComponents.createNotification('Warning: Low disk space', 'warning', 8000);
}

// Create loading spinner
function showLoadingState(container) {
    const spinner = AIHubUIComponents.createLoadingSpinner(container, 'large');
    
    // Simulate async operation
    setTimeout(() => {
        AIHubUIComponents.removeLoadingSpinner(spinner);
        AIHubUtils.showToast('Operation completed!', 'success');
    }, 3000);
}

// ============================================================================
// 4. CHART MANAGER MODULE USAGE
// ============================================================================

console.log('=== AIHubChartManager Examples ===');

const chartManager = new AIHubChartManager();

// Create progress chart
function createProjectProgressChart() {
    const progressData = {
        labels: ['Planning', 'Development', 'Testing', 'Deployment'],
        datasets: [{
            data: [25, 45, 20, 10],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };
    
    chartManager.createProgressChart('project-progress', progressData, {
        title: 'Project Progress',
        showPercentage: true,
        animation: true
    });
}

// Create doughnut chart
function createBudgetChart() {
    const budgetData = {
        labels: ['Development', 'Design', 'Testing', 'Marketing'],
        datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'],
            borderWidth: 3,
            borderColor: '#ffffff'
        }]
    };
    
    chartManager.createDoughnutChart('budget-distribution', budgetData, {
        title: 'Budget Distribution',
        showLegend: true,
        responsive: true
    });
}

// Update chart data
function updateChartData() {
    const newProgressData = {
        labels: ['Planning', 'Development', 'Testing', 'Deployment'],
        datasets: [{
            data: [30, 50, 15, 5],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };
    
    chartManager.updateChart('project-progress', newProgressData);
}

// ============================================================================
// 5. AI ASSISTANT MODULE USAGE
// ============================================================================

console.log('=== AIHubAssistant Examples ===');

const aiAssistant = new AIHubAssistant();

// Process user message
async function askAIAssistant(message) {
    try {
        const response = await aiAssistant.processMessage(message, {
            context: 'project_management',
            userId: 'user123',
            projectId: 'proj456'
        });
        
        console.log('AI Response:', response);
        displayAIResponse(response);
        
    } catch (error) {
        console.error('AI Assistant error:', error);
        AIHubUtils.showToast('AI Assistant unavailable', 'error');
    }
}

// Get specific type of response
function getAIProjectAdvice(projectType) {
    const response = aiAssistant.getProjectResponse(`How should I approach a ${projectType} project?`, {
        complexity: 'medium',
        timeline: '3 months',
        teamSize: 5
    });
    
    console.log('Project Advice:', response);
    return response;
}

// Add conversation to history
function addToConversation(role, content) {
    aiAssistant.addToHistory(role, content);
    
    // Get conversation history
    const history = aiAssistant.getConversationHistory();
    console.log('Conversation History:', history);
}

// ============================================================================
// 6. PROJECT MANAGER MODULE USAGE
// ============================================================================

console.log('=== AIHubProjectManager Examples ===');

const projectManager = new AIHubProjectManager();

// Create new project
async function createNewProject() {
    const projectData = {
        name: 'E-commerce Platform',
        description: 'Modern e-commerce solution with AI recommendations',
        category: 'Web Development',
        budget: 50000,
        timeline: '6 months',
        team: ['developer1', 'designer1', 'tester1'],
        status: 'planning'
    };
    
    try {
        // Validate project data
        const isValid = projectManager.validateProject(projectData);
        if (!isValid) {
            throw new Error('Invalid project data');
        }
        
        const newProject = await projectManager.createProject(projectData);
        AIHubUtils.showToast('Project created successfully!', 'success');
        
        return newProject;
    } catch (error) {
        console.error('Failed to create project:', error);
        AIHubUtils.showToast('Failed to create project', 'error');
        throw error;
    }
}

// Update project progress
async function updateProjectProgress(projectId, progress) {
    try {
        await projectManager.updateProjectProgress(projectId, progress);
        AIHubUtils.showToast('Progress updated successfully!', 'success');
        
        // Get updated project
        const project = projectManager.getProjectById(projectId);
        console.log('Updated project:', project);
        
    } catch (error) {
        console.error('Failed to update progress:', error);
        AIHubUtils.showToast('Failed to update progress', 'error');
    }
}

// Get project statistics
function getProjectStats() {
    const stats = projectManager.getProjectStatistics();
    console.log('Project Statistics:', stats);
    
    // Display stats in UI
    displayProjectStats(stats);
}

// ============================================================================
// 7. ENHANCED FEATURES SUITE USAGE
// ============================================================================

console.log('=== MaijdEnhancedFeatures Examples ===');

const enhancedFeatures = new MaijdEnhancedFeatures();

// Access individual enhanced components
function useEnhancedFeatures() {
    // AI Assistant
    const aiAssistant = enhancedFeatures.aiAssistant;
    aiAssistant.toggle(); // Show/hide AI interface
    
    // Performance Monitor
    const performanceMonitor = enhancedFeatures.performanceMonitor;
    const metrics = performanceMonitor.getPerformanceMetrics();
    console.log('Performance Metrics:', metrics);
    
    // Real-time Updates
    const realTimeUpdates = enhancedFeatures.realTimeUpdates;
    realTimeUpdates.start(); // Start real-time updates
    
    // Advanced Charts
    const advancedCharts = enhancedFeatures.advancedCharts;
    advancedCharts.show(); // Show advanced chart dashboard
    
    // Notification Center
    const notificationCenter = enhancedFeatures.notificationCenter;
    notificationCenter.show('Enhanced features activated!', 'success');
    
    // Theme Manager
    const themeManager = enhancedFeatures.themeManager;
    themeManager.toggle(); // Toggle between light/dark themes
    
    // Shortcut Manager
    const shortcutManager = enhancedFeatures.shortcutManager;
    shortcutManager.showShortcuts(); // Display available shortcuts
    
    // Auto Save
    const autoSave = enhancedFeatures.autoSave;
    autoSave.start(); // Start automatic saving
}

// ============================================================================
// 8. STANDALONE ENHANCED COMPONENTS
// ============================================================================

console.log('=== Standalone Enhanced Components Examples ===');

// AI Assistant
const aiAssistant = new AIAssistant();
aiAssistant.initialize();

// Performance Monitor
const performanceMonitor = new PerformanceMonitor();
performanceMonitor.start();

// Real-time Updates
const realTimeUpdates = new RealTimeUpdates();
realTimeUpdates.start();

// Advanced Charts
const advancedCharts = new AdvancedCharts();
advancedCharts.initializeCharts();

// Notification Center
const notificationCenter = new NotificationCenter();
notificationCenter.init();

// Theme Manager
const themeManager = new ThemeManager();
themeManager.init();

// Shortcut Manager
const shortcutManager = new ShortcutManager();
shortcutManager.init();

// Auto Save
const autoSave = new AutoSave();
autoSave.init();

// ============================================================================
// 9. INTEGRATED WORKFLOW EXAMPLE
// ============================================================================

console.log('=== Integrated Workflow Example ===');

class IntegratedWorkflow {
    constructor() {
        this.dataManager = new AIHubDataManager();
        this.aiAssistant = new AIHubAssistant();
        this.projectManager = new AIHubProjectManager();
        this.chartManager = new AIHubChartManager();
        this.enhancedFeatures = new MaijdEnhancedFeatures();
    }
    
    async initializeWorkflow() {
        try {
            // Start all services
            this.enhancedFeatures.performanceMonitor.start();
            this.enhancedFeatures.realTimeUpdates.start();
            this.enhancedFeatures.autoSave.start();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup AI assistant
            this.aiAssistant.initialize();
            
            // Create initial charts
            this.createInitialCharts();
            
            // Show success notification
            this.enhancedFeatures.notificationCenter.show('Workflow initialized successfully!', 'success');
            
        } catch (error) {
            console.error('Workflow initialization failed:', error);
            this.enhancedFeatures.notificationCenter.show('Workflow initialization failed', 'error');
        }
    }
    
    async loadInitialData() {
        const projects = await this.dataManager.fetchWithCache('/api/projects');
        this.renderProjects(projects);
        
        const stats = this.projectManager.getProjectStatistics();
        this.displayProjectStats(stats);
    }
    
    createInitialCharts() {
        // Create project progress chart
        const progressData = {
            labels: ['Planning', 'Development', 'Testing', 'Deployment'],
            datasets: [{
                data: [20, 40, 25, 15],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
            }]
        };
        
        this.chartManager.createProgressChart('workflow-progress', progressData, {
            title: 'Workflow Progress',
            showPercentage: true
        });
    }
    
    renderProjects(projects) {
        console.log('Rendering projects:', projects);
        // Implementation for rendering projects in UI
    }
    
    displayProjectStats(stats) {
        console.log('Displaying project stats:', stats);
        // Implementation for displaying stats in UI
    }
}

// ============================================================================
// 10. EVENT HANDLERS AND INITIALIZATION
// ============================================================================

console.log('=== Event Handlers and Initialization ===');

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Maijd Software Suite modules...');
    
    // Setup basic utilities
    setupSearchWithDebounce();
    setupScrollThrottling();
    displayFormattedData();
    validateUserInput();
    
    // Setup data management
    loadProjectsWithCache();
    
    // Setup UI components
    showSystemNotifications();
    
    // Setup charts
    createProjectProgressChart();
    createBudgetChart();
    
    // Setup AI assistant
    askAIAssistant('How can I improve my project management workflow?');
    
    // Setup project management
    getProjectStats();
    
    // Setup enhanced features
    useEnhancedFeatures();
    
    // Initialize integrated workflow
    const workflow = new IntegratedWorkflow();
    workflow.initializeWorkflow();
    
    console.log('All modules initialized successfully!');
});

// Example of using AI assistant with user interaction
document.addEventListener('click', function(e) {
    if (e.target.matches('.ai-help-button')) {
        const context = e.target.dataset.context || 'general';
        askAIAssistant(`I need help with ${context}. Can you provide guidance?`);
    }
    
    if (e.target.matches('.create-project-button')) {
        createNewProject();
    }
    
    if (e.target.matches('.update-progress-button')) {
        const projectId = e.target.dataset.projectId;
        const progress = parseInt(e.target.dataset.progress) || 0;
        updateProjectProgress(projectId, progress);
    }
});

// Example of real-time updates
function handleRealTimeUpdate(update) {
    console.log('Real-time update received:', update);
    
    switch (update.type) {
        case 'project_update':
            // Refresh project data
            loadProjectsWithCache();
            break;
        case 'performance_alert':
            // Show performance warning
            AIHubUtils.showToast(update.message, 'warning');
            break;
        case 'ai_insight':
            // Display AI insight
            displayAIInsight(update.data);
            break;
        default:
            console.log('Unknown update type:', update.type);
    }
}

// Example of displaying AI insights
function displayAIInsight(insight) {
    const insightElement = document.createElement('div');
    insightElement.className = 'ai-insight bg-blue-50 border-l-4 border-blue-400 p-4 mb-4';
    insightElement.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-lightbulb text-blue-400"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-blue-700">${AIHubUtils.sanitizeHTML(insight.message)}</p>
            </div>
        </div>
    `;
    
    const container = document.getElementById('insights-container');
    if (container) {
        container.appendChild(insightElement);
    }
}

// Export modules for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIHubUtils,
        AIHubDataManager,
        AIHubUIComponents,
        AIHubChartManager,
        AIHubAssistant,
        AIHubProjectManager,
        MaijdEnhancedFeatures,
        AIAssistant,
        PerformanceMonitor,
        RealTimeUpdates,
        AdvancedCharts,
        NotificationCenter,
        ThemeManager,
        ShortcutManager,
        AutoSave,
        IntegratedWorkflow
    };
}

console.log('Module usage examples loaded successfully!');
console.log('Check the console for detailed examples and usage patterns.');
