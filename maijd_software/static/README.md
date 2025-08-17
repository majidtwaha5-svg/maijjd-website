# Maijd Software Suite - Module Examples & Demo

This directory contains comprehensive examples and demonstrations of how to use all the available modules in the Maijd Software Suite.

## Files Overview

### 1. `module-usage-examples.js`
A comprehensive JavaScript file containing practical examples of how to use all modules:

- **AIHubUtils**: Utility functions (debounce, throttle, formatting, validation)
- **AIHubDataManager**: Data management with caching and retry logic
- **AIHubUIComponents**: UI components (modals, notifications, loading spinners)
- **AIHubChartManager**: Chart creation and management
- **AIHubAssistant**: AI-powered assistance and conversation
- **AIHubProjectManager**: Project management operations
- **MaijdEnhancedFeatures**: Advanced features suite
- **AIAssistant**: Enhanced AI interface
- **PerformanceMonitor**: Performance tracking
- **RealTimeUpdates**: Real-time data updates
- **AdvancedCharts**: Advanced charting capabilities
- **NotificationCenter**: Notification system
- **ThemeManager**: Theme management
- **ShortcutManager**: Keyboard shortcuts
- **AutoSave**: Automatic saving functionality

### 2. `module-demo.html`
An interactive HTML demo page that demonstrates all modules with clickable examples and real-time output.

## How to Use

### Option 1: Interactive Demo
1. Open `module-demo.html` in your web browser
2. Click through the various demo buttons to see each module in action
3. Watch the real-time output and console logs
4. Interact with the AI Assistant chat interface

### Option 2: Code Examples
1. Open `module-usage-examples.js` in your code editor
2. Copy specific examples for the modules you need
3. Integrate them into your own projects
4. Check the browser console for detailed logging

### Option 3: Direct Module Usage
1. Include the required module files in your HTML:
   ```html
   <script src="js/ai-hub-modules.js"></script>
   <script src="js/enhanced-features.js"></script>
   ```

2. Use the modules directly in your JavaScript:
   ```javascript
   // Utility functions
   const formattedAmount = AIHubUtils.formatCurrency(1250.75);
   
   // Data management
   const dataManager = new AIHubDataManager();
   const projects = await dataManager.fetchWithCache('/api/projects');
   
   // AI Assistant
   const aiAssistant = new AIHubAssistant();
   const response = await aiAssistant.processMessage('How do I start a project?');
   ```

## Module Examples by Category

### Basic Utilities
```javascript
// Format currency and dates
const amount = AIHubUtils.formatCurrency(1250.75);
const date = AIHubUtils.formatDate('2024-01-15');

// Generate unique IDs
const id = AIHubUtils.generateId();

// Validate input
const isValidEmail = AIHubUtils.validateEmail('user@example.com');

// Debounce and throttle
const debouncedSearch = AIHubUtils.debounce(searchFunction, 500);
const throttledScroll = AIHubUtils.throttle(scrollFunction, 100);
```

### Data Management
```javascript
const dataManager = new AIHubDataManager();

// Fetch with caching
const data = await dataManager.fetchWithCache('/api/data', {
    cacheTime: 5 * 60 * 1000 // 5 minutes
});

// Fetch with retry logic
const response = await dataManager.fetchWithRetry('/api/data', options, 3);
```

### UI Components
```javascript
// Create modals
AIHubUIComponents.createModal('my-modal', 'Title', content, options);

// Show notifications
AIHubUIComponents.createNotification('Success!', 'success', 5000);

// Create loading spinners
const spinner = AIHubUIComponents.createLoadingSpinner(container, 'large');
```

### Charts
```javascript
const chartManager = new AIHubChartManager();

// Progress charts
chartManager.createProgressChart('chart-id', data, options);

// Doughnut charts
chartManager.createDoughnutChart('chart-id', data, options);

// Update existing charts
chartManager.updateChart('chart-id', newData);
```

### AI Assistant
```javascript
const aiAssistant = new AIHubAssistant();

// Process messages
const response = await aiAssistant.processMessage(message, context);

// Get specific advice
const projectAdvice = aiAssistant.getProjectResponse(question, context);
const techAdvice = aiAssistant.getTechResponse(question, context);

// Manage conversation history
aiAssistant.addToHistory('user', message);
const history = aiAssistant.getConversationHistory();
```

### Project Management
```javascript
const projectManager = new AIHubProjectManager();

// Create projects
const project = await projectManager.createProject(projectData);

// Update progress
await projectManager.updateProjectProgress(projectId, 75);

// Get statistics
const stats = projectManager.getProjectStatistics();
```

### Enhanced Features
```javascript
const enhancedFeatures = new MaijdEnhancedFeatures();

// Access individual components
enhancedFeatures.aiAssistant.toggle();
enhancedFeatures.themeManager.toggle();
enhancedFeatures.performanceMonitor.start();
enhancedFeatures.autoSave.start();
```

## Browser Console

Open your browser's developer tools (F12) to see detailed console output for all module operations. The examples include comprehensive logging to help you understand what's happening behind the scenes.

## Dependencies

The modules require the following files to be loaded:
- `js/ai-hub-modules.js` - Core modules
- `js/enhanced-features.js` - Enhanced features
- `js/module-usage-examples.js` - Examples (optional)

## Browser Compatibility

These modules work in modern browsers that support:
- ES6+ features
- Async/await
- Fetch API
- Canvas API (for charts)

## Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Ensure all required files are loaded
3. Verify browser compatibility
4. Check the individual module files for specific requirements

## Contributing

Feel free to extend these examples or add new ones. The modular structure makes it easy to add new functionality while maintaining compatibility with existing code.
