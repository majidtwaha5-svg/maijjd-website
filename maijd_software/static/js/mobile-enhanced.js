/**
 * Maijd Software Suite - Mobile Enhanced JavaScript Module
 * Advanced mobile functionality with offline support and real-time updates
 */

class MaijdMobileEnhanced {
    constructor() {
        this.config = {
            apiBaseUrl: '/api/v1',
            realTimeEnabled: true,
            offlineSupport: true,
            syncInterval: 30000, // 30 seconds
            maxRetryAttempts: 3,
            cacheDuration: 300000, // 5 minutes
            pushNotifications: true
        };
        
        this.state = {
            isOnline: navigator.onLine,
            isOffline: !navigator.onLine,
            lastSync: null,
            syncStatus: 'idle',
            retryCount: 0,
            activeSession: null,
            cachedData: new Map(),
            pendingActions: []
        };
        
        this.eventListeners = new Map();
        this.realTimeConnection = null;
        this.syncTimer = null;
        this.offlineQueue = [];
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🚀 Initializing Maijd Mobile Enhanced...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize offline support
        if (this.config.offlineSupport) {
            this.initializeOfflineSupport();
        }
        
        // Initialize real-time updates
        if (this.config.realTimeEnabled) {
            this.initializeRealTimeUpdates();
        }
        
        // Initialize push notifications
        if (this.config.pushNotifications) {
            this.initializePushNotifications();
        }
        
        // Start background sync
        this.startBackgroundSync();
        
        // Initialize service worker
        this.initializeServiceWorker();
        
        console.log('✅ Maijd Mobile Enhanced initialized successfully');
    }
    
    setupEventListeners() {
        // Online/offline status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Visibility change (app in background)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Before unload (save state)
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        
        // Touch gestures
        this.setupTouchGestures();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const duration = endTime - startTime;
            
            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipe('left');
                } else {
                    this.handleSwipe('right');
                }
            }
            
            // Long press detection
            if (duration > 500 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                this.handleLongPress(startX, startY);
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S for save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.quickSave();
            }
            
            // Ctrl/Cmd + R for refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
            
            // Escape for close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    handleSwipe(direction) {
        console.log(`📱 Swipe detected: ${direction}`);
        
        switch (direction) {
            case 'left':
                this.navigateNext();
                break;
            case 'right':
                this.navigatePrevious();
                break;
        }
    }
    
    handleLongPress(x, y) {
        console.log(`📱 Long press detected at (${x}, ${y})`);
        this.showContextMenu(x, y);
    }
    
    handleOnline() {
        this.state.isOnline = true;
        this.state.isOffline = false;
        
        console.log('🌐 Back online - syncing data...');
        
        // Process offline queue
        this.processOfflineQueue();
        
        // Sync cached data
        this.syncCachedData();
        
        // Update UI
        this.updateOnlineStatus(true);
        
        // Emit event
        this.emit('online');
    }
    
    handleOffline() {
        this.state.isOnline = false;
        this.state.isOffline = true;
        
        console.log('📴 Going offline - enabling offline mode...');
        
        // Enable offline mode
        this.enableOfflineMode();
        
        // Update UI
        this.updateOnlineStatus(false);
        
        // Emit event
        this.emit('offline');
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('📱 App going to background...');
            this.pauseRealTimeUpdates();
            this.saveAppState();
        } else {
            console.log('📱 App coming to foreground...');
            this.resumeRealTimeUpdates();
            this.refreshData();
        }
    }
    
    handleBeforeUnload() {
        console.log('📱 App closing - saving state...');
        this.saveAppState();
        this.cleanup();
    }
    
    async initializeOfflineSupport() {
        try {
            // Check if IndexedDB is available
            if ('indexedDB' in window) {
                await this.initializeIndexedDB();
                console.log('✅ IndexedDB initialized for offline support');
            } else {
                console.warn('⚠️ IndexedDB not available, using localStorage fallback');
                this.useLocalStorageFallback();
            }
            
            // Set up offline detection
            this.setupOfflineDetection();
            
        } catch (error) {
            console.error('❌ Error initializing offline support:', error);
        }
    }
    
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MaijdMobileDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
                
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
                }
                
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'key' });
                }
            };
        });
    }
    
    useLocalStorageFallback() {
        this.storage = {
            get: (key) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                } catch (error) {
                    console.error('Error reading from localStorage:', error);
                    return null;
                }
            },
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('Error writing to localStorage:', error);
                    return false;
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('Error removing from localStorage:', error);
                    return false;
                }
            }
        };
    }
    
    setupOfflineDetection() {
        // Check online status periodically
        setInterval(() => {
            const wasOnline = this.state.isOnline;
            this.state.isOnline = navigator.onLine;
            
            if (wasOnline !== this.state.isOnline) {
                if (this.state.isOnline) {
                    this.handleOnline();
                } else {
                    this.handleOffline();
                }
            }
        }, 5000);
    }
    
    async initializeRealTimeUpdates() {
        try {
            if ('EventSource' in window) {
                this.setupServerSentEvents();
            } else {
                console.warn('⚠️ EventSource not available, using polling fallback');
                this.setupPollingFallback();
            }
        } catch (error) {
            console.error('❌ Error initializing real-time updates:', error);
        }
    }
    
    setupServerSentEvents() {
        try {
            this.realTimeConnection = new EventSource(`${this.config.apiBaseUrl}/stream`);
            
            this.realTimeConnection.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealTimeUpdate(data);
            };
            
            this.realTimeConnection.onerror = (error) => {
                console.error('❌ Real-time connection error:', error);
                this.realTimeConnection.close();
                this.setupPollingFallback();
            };
            
            console.log('✅ Server-sent events initialized');
            
        } catch (error) {
            console.error('❌ Error setting up server-sent events:', error);
            this.setupPollingFallback();
        }
    }
    
    setupPollingFallback() {
        console.log('🔄 Setting up polling fallback...');
        
        this.pollingInterval = setInterval(async () => {
            try {
                const response = await this.apiCall('GET', '/dashboard');
                if (response.status === 'success') {
                    this.handleRealTimeUpdate(response.data);
                }
            } catch (error) {
                console.error('❌ Polling error:', error);
            }
        }, this.config.syncInterval);
    }
    
    handleRealTimeUpdate(data) {
        console.log('🔄 Real-time update received:', data);
        
        // Update cached data
        this.updateCachedData(data);
        
        // Emit update event
        this.emit('realTimeUpdate', data);
        
        // Update UI if needed
        this.updateUIFromRealTimeData(data);
    }
    
    async initializePushNotifications() {
        try {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                    });
                    
                    console.log('✅ Push notifications initialized');
                    this.pushSubscription = subscription;
                }
            }
        } catch (error) {
            console.error('❌ Error initializing push notifications:', error);
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    startBackgroundSync() {
        this.syncTimer = setInterval(async () => {
            if (this.state.isOnline && this.state.syncStatus === 'idle') {
                await this.performBackgroundSync();
            }
        }, this.config.syncInterval);
    }
    
    async performBackgroundSync() {
        try {
            this.state.syncStatus = 'syncing';
            
            console.log('🔄 Performing background sync...');
            
            // Sync user data
            await this.syncUserData();
            
            // Sync offline queue
            await this.processOfflineQueue();
            
            // Update sync status
            this.state.lastSync = new Date();
            this.state.syncStatus = 'idle';
            
            console.log('✅ Background sync completed');
            
        } catch (error) {
            console.error('❌ Background sync error:', error);
            this.state.syncStatus = 'error';
        }
    }
    
    async initializeServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service worker registered:', registration);
                
                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            }
        } catch (error) {
            console.error('❌ Error registering service worker:', error);
        }
    }
    
    async apiCall(method, endpoint, data = null, options = {}) {
        const url = `${this.config.apiBaseUrl}${endpoint}`;
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Mobile-App': 'true',
                'X-Session-ID': this.state.activeSession?.id || 'anonymous'
            },
            ...options
        };
        
        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Cache successful responses
            if (method === 'GET' && this.config.cacheDuration > 0) {
                this.cacheData(endpoint, result);
            }
            
            return result;
            
        } catch (error) {
            console.error(`❌ API call error (${method} ${endpoint}):`, error);
            
            // If offline, queue the action
            if (this.state.isOffline && method !== 'GET') {
                this.queueOfflineAction(method, endpoint, data);
            }
            
            throw error;
        }
    }
    
    cacheData(key, data) {
        const cacheEntry = {
            key,
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.config.cacheDuration
        };
        
        this.state.cachedData.set(key, cacheEntry);
        
        // Also save to persistent storage
        if (this.db) {
            this.saveToIndexedDB('cache', cacheEntry);
        } else if (this.storage) {
            this.storage.set(`cache_${key}`, cacheEntry);
        }
    }
    
    getCachedData(key) {
        const cached = this.state.cachedData.get(key);
        
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data;
        }
        
        // Check persistent storage
        if (this.db) {
            return this.getFromIndexedDB('cache', key);
        } else if (this.storage) {
            const stored = this.storage.get(`cache_${key}`);
            if (stored && stored.expiresAt > Date.now()) {
                return stored.data;
            }
        }
        
        return null;
    }
    
    async saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    async getFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result?.data || null);
            request.onerror = () => reject(request.error);
        });
    }
    
    queueOfflineAction(method, endpoint, data) {
        const action = {
            id: Date.now().toString(),
            method,
            endpoint,
            data,
            timestamp: new Date().toISOString(),
            retryCount: 0
        };
        
        this.offlineQueue.push(action);
        
        // Save to persistent storage
        if (this.db) {
            this.saveToIndexedDB('offlineQueue', action);
        } else if (this.storage) {
            const queue = this.storage.get('offlineQueue') || [];
            queue.push(action);
            this.storage.set('offlineQueue', queue);
        }
        
        console.log(`📴 Action queued for offline processing: ${method} ${endpoint}`);
    }
    
    async processOfflineQueue() {
        if (this.offlineQueue.length === 0) return;
        
        console.log(`🔄 Processing ${this.offlineQueue.length} offline actions...`);
        
        const actions = [...this.offlineQueue];
        this.offlineQueue = [];
        
        for (const action of actions) {
            try {
                await this.apiCall(action.method, action.endpoint, action.data);
                console.log(`✅ Offline action processed: ${action.method} ${action.endpoint}`);
                
                // Remove from persistent storage
                if (this.db) {
                    this.removeFromIndexedDB('offlineQueue', action.id);
                } else if (this.storage) {
                    const queue = this.storage.get('offlineQueue') || [];
                    const filtered = queue.filter(a => a.id !== action.id);
                    this.storage.set('offlineQueue', filtered);
                }
                
            } catch (error) {
                console.error(`❌ Failed to process offline action:`, error);
                
                // Re-queue if retry limit not reached
                if (action.retryCount < this.config.maxRetryAttempts) {
                    action.retryCount++;
                    this.offlineQueue.push(action);
                }
            }
        }
    }
    
    async removeFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    enableOfflineMode() {
        console.log('📴 Enabling offline mode...');
        
        // Show offline indicator
        this.showOfflineIndicator();
        
        // Use cached data
        this.useCachedData();
        
        // Enable offline features
        this.enableOfflineFeatures();
    }
    
    showOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'block';
            indicator.innerHTML = `
                <i class="fas fa-wifi-slash mr-2"></i>
                You're offline. Some features may be limited.
                <button onclick="mobileEnhanced.refreshData()" class="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Retry
                </button>
            `;
        }
    }
    
    updateOnlineStatus(isOnline) {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = isOnline ? 'none' : 'block';
        }
        
        // Update UI elements
        document.body.classList.toggle('offline-mode', !isOnline);
        
        // Emit status change event
        this.emit('statusChange', { isOnline });
    }
    
    useCachedData() {
        console.log('📱 Using cached data for offline mode...');
        
        // Load cached dashboard data
        const dashboardData = this.getCachedData('/dashboard');
        if (dashboardData) {
            this.updateUIFromCachedData(dashboardData);
        }
        
        // Load cached software list
        const softwareList = this.getCachedData('/software');
        if (softwareList) {
            this.updateUIFromCachedData(softwareList);
        }
    }
    
    enableOfflineFeatures() {
        // Enable offline-capable features
        const offlineFeatures = document.querySelectorAll('[data-offline-capable="true"]');
        offlineFeatures.forEach(feature => {
            feature.classList.remove('disabled');
            feature.removeAttribute('disabled');
        });
        
        // Disable online-only features
        const onlineFeatures = document.querySelectorAll('[data-online-only="true"]');
        onlineFeatures.forEach(feature => {
            feature.classList.add('disabled');
            feature.setAttribute('disabled', 'true');
        });
    }
    
    updateUIFromCachedData(data) {
        // Update dashboard elements
        if (data.overview) {
            this.updateDashboardOverview(data.overview);
        }
        
        if (data.quick_stats) {
            this.updateQuickStats(data.quick_stats);
        }
        
        if (data.recent_activities) {
            this.updateRecentActivities(data.recent_activities);
        }
        
        if (data.notifications) {
            this.updateNotifications(data.notifications);
        }
    }
    
    updateUIFromRealTimeData(data) {
        // Update specific UI elements based on real-time data
        if (data.type === 'dashboard_update') {
            this.updateDashboardOverview(data.data);
        } else if (data.type === 'notification') {
            this.showNotification(data.data);
        } else if (data.type === 'activity') {
            this.addRecentActivity(data.data);
        }
    }
    
    updateDashboardOverview(overview) {
        // Update dashboard overview elements
        const elements = {
            'total-software': overview.total_software,
            'active-software': overview.active_software,
            'system-health': overview.system_health
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    updateQuickStats(stats) {
        // Update quick stats elements
        const elements = {
            'cpu-usage': stats.cpu_usage,
            'memory-usage': stats.memory_usage,
            'network-status': stats.network_status,
            'battery-level': stats.battery_level
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    updateRecentActivities(activities) {
        const container = document.querySelector('.recent-activities');
        if (!container) return;
        
        container.innerHTML = activities.map(activity => `
            <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-${this.getPriorityColor(activity.priority)}-500 rounded-full"></div>
                <span class="text-sm text-gray-600">${activity.title}</span>
                <span class="text-xs text-gray-400 ml-auto">${this.formatTimestamp(activity.timestamp)}</span>
            </div>
        `).join('');
    }
    
    updateNotifications(notifications) {
        const container = document.querySelector('.notifications-container');
        if (!container) return;
        
        container.innerHTML = notifications.map(notification => `
            <div class="notification-item p-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-sm">${notification.title}</h4>
                        <p class="text-xs text-gray-600">${notification.message}</p>
                    </div>
                    <button onclick="mobileEnhanced.handleNotificationAction('${notification.id}', '${notification.action}')" 
                            class="text-blue-500 text-xs">
                        ${notification.action.replace('_', ' ')}
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    getPriorityColor(priority) {
        const colors = {
            'high': 'red',
            'medium': 'yellow',
            'low': 'green'
        };
        return colors[priority] || 'gray';
    }
    
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }
    
    showNotification(data) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50';
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <i class="fas fa-${this.getNotificationIcon(data.type)} text-${this.getPriorityColor(data.priority)}-500"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-sm text-gray-900">${data.title}</h4>
                    <p class="text-sm text-gray-600">${data.message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'update': 'download',
            'sync': 'sync',
            'performance': 'tachometer-alt',
            'error': 'exclamation-triangle',
            'success': 'check-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    addRecentActivity(activity) {
        const container = document.querySelector('.recent-activities');
        if (!container) return;
        
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-center space-x-3';
        activityElement.innerHTML = `
            <div class="w-2 h-2 bg-${this.getPriorityColor(activity.priority)}-500 rounded-full"></div>
            <span class="text-sm text-gray-600">${activity.title}</span>
            <span class="text-xs text-gray-400 ml-auto">Just now</span>
        `;
        
        container.insertBefore(activityElement, container.firstChild);
        
        // Remove old activities if too many
        const activities = container.querySelectorAll('.flex');
        if (activities.length > 10) {
            activities[activities.length - 1].remove();
        }
    }
    
    async handleNotificationAction(notificationId, action) {
        try {
            console.log(`📱 Handling notification action: ${action} for ${notificationId}`);
            
            // Perform the action
            switch (action) {
                case 'install_now':
                    await this.installSoftware(notificationId);
                    break;
                case 'view_details':
                    this.showNotificationDetails(notificationId);
                    break;
                case 'optimize_now':
                    await this.optimizeSystem();
                    break;
                default:
                    console.log(`Unknown action: ${action}`);
            }
            
        } catch (error) {
            console.error('❌ Error handling notification action:', error);
        }
    }
    
    async installSoftware(softwareId) {
        try {
            const response = await this.apiCall('POST', '/install', {
                software_id: softwareId,
                user_id: this.state.activeSession?.user_id
            });
            
            if (response.status === 'success') {
                this.showToast('Software installation started!', 'success');
            }
            
        } catch (error) {
            console.error('❌ Error installing software:', error);
            this.showToast('Installation failed. Please try again.', 'error');
        }
    }
    
    showNotificationDetails(notificationId) {
        // Show detailed notification view
        this.showToast('Opening notification details...', 'info');
    }
    
    async optimizeSystem() {
        try {
            this.showToast('Optimizing system...', 'info');
            
            // Simulate optimization
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('System optimization complete!', 'success');
            
        } catch (error) {
            console.error('❌ Error optimizing system:', error);
            this.showToast('Optimization failed. Please try again.', 'error');
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 left-4 right-4 bg-${this.getToastColor(type)}-500 text-white p-3 rounded-lg text-center z-50`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
    
    getToastColor(type) {
        const colors = {
            'success': 'green',
            'error': 'red',
            'warning': 'yellow',
            'info': 'blue'
        };
        return colors[type] || 'blue';
    }
    
    async refreshData() {
        try {
            console.log('🔄 Refreshing data...');
            
            // Clear cache
            this.state.cachedData.clear();
            
            // Fetch fresh data
            const [dashboard, software, notifications] = await Promise.all([
                this.apiCall('GET', '/dashboard'),
                this.apiCall('GET', '/software'),
                this.apiCall('GET', '/notifications')
            ]);
            
            // Update UI
            this.updateUIFromCachedData(dashboard.data);
            this.updateUIFromCachedData(software.data);
            this.updateUIFromCachedData({ notifications: notifications.data });
            
            this.showToast('Data refreshed successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Error refreshing data:', error);
            this.showToast('Failed to refresh data. Using cached version.', 'warning');
        }
    }
    
    quickSave() {
        console.log('💾 Quick save triggered...');
        
        // Save current state
        this.saveAppState();
        
        // Show save indicator
        this.showToast('Changes saved!', 'success');
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal, [id*="modal"], [id*="Modal"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        });
    }
    
    navigateNext() {
        // Navigate to next tab/section
        const tabs = ['dashboard', 'features', 'ai', 'profile'];
        const currentTab = this.getCurrentTab();
        const currentIndex = tabs.indexOf(currentTab);
        const nextTab = tabs[(currentIndex + 1) % tabs.length];
        
        this.switchTab(nextTab);
    }
    
    navigatePrevious() {
        // Navigate to previous tab/section
        const tabs = ['dashboard', 'features', 'ai', 'profile'];
        const currentTab = this.getCurrentTab();
        const currentIndex = tabs.indexOf(currentTab);
        const prevTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        
        this.switchTab(prevTab);
    }
    
    getCurrentTab() {
        const activeTab = document.querySelector('.nav-item.active');
        if (activeTab) {
            const text = activeTab.querySelector('span');
            return text ? text.textContent.toLowerCase() : 'dashboard';
        }
        return 'dashboard';
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to target tab
        const targetTab = Array.from(document.querySelectorAll('.nav-item')).find(item => {
            const text = item.querySelector('span');
            return text && text.textContent.toLowerCase() === tabName;
        });
        
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        console.log(`📱 Switched to tab: ${tabName}`);
    }
    
    showContextMenu(x, y) {
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        menu.innerHTML = `
            <div class="context-menu-item" onclick="mobileEnhanced.quickSave()">
                <i class="fas fa-save mr-2"></i> Quick Save
            </div>
            <div class="context-menu-item" onclick="mobileEnhanced.refreshData()">
                <i class="fas fa-sync mr-2"></i> Refresh
            </div>
            <div class="context-menu-item" onclick="mobileEnhanced.showSettings()">
                <i class="fas fa-cog mr-2"></i> Settings
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Auto-remove on click outside
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }
    
    showSettings() {
        this.showToast('Opening settings...', 'info');
    }
    
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg text-center z-50';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>New version available!</span>
                <button onclick="location.reload()" class="bg-white text-blue-500 px-3 py-1 rounded text-sm">
                    Update
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
    
    saveAppState() {
        const state = {
            currentTab: this.getCurrentTab(),
            scrollPosition: window.scrollY,
            timestamp: new Date().toISOString()
        };
        
        if (this.db) {
            this.saveToIndexedDB('userData', { key: 'appState', data: state });
        } else if (this.storage) {
            this.storage.set('appState', state);
        }
    }
    
    async loadAppState() {
        try {
            let state = null;
            
            if (this.db) {
                state = await this.getFromIndexedDB('userData', 'appState');
            } else if (this.storage) {
                state = this.storage.get('appState');
            }
            
            if (state) {
                // Restore scroll position
                if (state.scrollPosition) {
                    window.scrollTo(0, state.scrollPosition);
                }
                
                // Restore tab
                if (state.currentTab) {
                    this.switchTab(state.currentTab);
                }
            }
            
        } catch (error) {
            console.error('❌ Error loading app state:', error);
        }
    }
    
    pauseRealTimeUpdates() {
        if (this.realTimeConnection) {
            this.realTimeConnection.close();
        }
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
    
    resumeRealTimeUpdates() {
        if (this.config.realTimeEnabled) {
            this.initializeRealTimeUpdates();
        }
    }
    
    emit(event, data = null) {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(listener => listener(data));
    }
    
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(listener);
    }
    
    off(event, listener) {
        const listeners = this.eventListeners.get(event) || [];
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }
    
    cleanup() {
        // Clear timers
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        // Close real-time connection
        if (this.realTimeConnection) {
            this.realTimeConnection.close();
        }
        
        // Save final state
        this.saveAppState();
        
        console.log('🧹 Mobile Enhanced cleanup completed');
    }
    
    // Public API methods
    async getSoftwareList(category = null) {
        try {
            const response = await this.apiCall('GET', `/software${category ? `?category=${category}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error getting software list:', error);
            return this.getCachedData('/software') || [];
        }
    }
    
    async getSoftwareDetails(softwareId) {
        try {
            const response = await this.apiCall('GET', `/software/${softwareId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error getting software details:', error);
            return this.getCachedData(`/software/${softwareId}`) || null;
        }
    }
    
    async getDashboardData() {
        try {
            const response = await this.apiCall('GET', '/dashboard');
            return response.data;
        } catch (error) {
            console.error('❌ Error getting dashboard data:', error);
            return this.getCachedData('/dashboard') || {};
        }
    }
    
    async performSoftwareAction(softwareId, action) {
        try {
            const response = await this.apiCall('POST', `/software/${softwareId}/action`, {
                action,
                user_id: this.state.activeSession?.user_id
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error performing software action:', error);
            throw error;
        }
    }
}

// Initialize mobile enhanced features
const mobileEnhanced = new MaijdMobileEnhanced();

// Export for global access
window.mobileEnhanced = mobileEnhanced;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM ready - Mobile Enhanced features available');
});

console.log('📱 Maijd Mobile Enhanced JavaScript loaded');
