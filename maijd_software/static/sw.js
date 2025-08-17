// Maijd Software Suite Service Worker
// Version: 2.0.0
// Handles PWA functionality, offline support, and background sync

const CACHE_NAME = 'maijd-software-suite-v2.0.0';
const STATIC_CACHE = 'maijd-static-v2.0.0';
const DYNAMIC_CACHE = 'maijd-dynamic-v2.0.0';
const API_CACHE = 'maijd-api-v2.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/mobile-dashboard.html',
  '/static/css/style.css',
  '/static/css/enhanced-features.css',
  '/static/js/mobile-enhanced.js',
  '/static/js/dashboard.js',
  '/static/js/enhanced-features.js',
  '/static/js/ai-hub.js',
  '/static/js/app.js',
  '/static/manifest.json',
  '/static/icons/icon-192x192.png',
  '/static/icons/icon-512x512.png',
  '/static/logo.svg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/v1/health',
  '/api/v1/software',
  '/api/v1/dashboard',
  '/api/v1/notifications',
  '/api/v1/activities',
  '/api/v1/system',
  '/api/v1/mobile/status'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticFile(request)) {
      event.respondWith(handleStaticFile(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    } else {
      event.respondWith(handleDynamicRequest(request));
    }
  } else if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    event.respondWith(handleMutationRequest(request));
  }
});

// Check if request is for a static file
function isStaticFile(request) {
  const url = new URL(request.url);
  return STATIC_FILES.some(file => url.pathname === file) ||
         url.pathname.startsWith('/static/') ||
         url.pathname === '/manifest.json';
}

// Check if request is for an API endpoint
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         API_ENDPOINTS.some(endpoint => url.pathname === endpoint);
}

// Handle static file requests
async function handleStaticFile(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling static file:', error);
    // Return offline fallback if available
    return getOfflineFallback(request);
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for API:', request.url);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline API response
    return getOfflineAPIResponse(request);
  }
}

// Handle dynamic requests (HTML pages)
async function handleDynamicRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for dynamic request:', request.url);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return getOfflineFallback(request);
  }
}

// Handle mutation requests (POST, PUT, DELETE)
async function handleMutationRequest(request) {
  try {
    // Always try network for mutations
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Invalidate related caches
      await invalidateRelatedCaches(request);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling mutation request:', error);
    
    // Queue for later if offline
    await queueOfflineAction(request);
    
    // Return offline response
    return new Response(JSON.stringify({
      success: false,
      message: 'Action queued for when online',
      queued: true,
      timestamp: new Date().toISOString()
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Get offline fallback for static files
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/mobile-dashboard.html') {
    // Return cached dashboard
    const cachedResponse = await caches.match('/mobile-dashboard.html');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Return offline page
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Maijd Software Suite - Offline</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .offline-icon { font-size: 64px; margin: 20px; }
        .retry-btn { padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="offline-icon">📱</div>
      <h1>You're Offline</h1>
      <p>The Maijd Software Suite is currently unavailable.</p>
      <p>Please check your internet connection and try again.</p>
      <button class="retry-btn" onclick="window.location.reload()">Retry</button>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Get offline API response
function getOfflineAPIResponse(request) {
  const url = new URL(request.url);
  
  // Return appropriate offline data based on endpoint
  if (url.pathname === '/api/v1/software') {
    return new Response(JSON.stringify({
      software: [],
      message: 'Offline mode - no software data available',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname === '/api/v1/dashboard') {
    return new Response(JSON.stringify({
      message: 'Offline mode - dashboard data unavailable',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default offline response
  return new Response(JSON.stringify({
    message: 'Service unavailable offline',
    offline: true,
    timestamp: new Date().toISOString()
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Queue offline action for later processing
async function queueOfflineAction(request) {
  try {
    const action = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString(),
      id: generateId()
    };
    
    // Try to get request body if it exists
    if (request.body) {
      const clone = request.clone();
      action.body = await clone.text();
    }
    
    // Store in IndexedDB or localStorage
    const queue = JSON.parse(localStorage.getItem('maijd_offline_queue') || '[]');
    queue.push(action);
    localStorage.setItem('maijd_offline_queue', JSON.stringify(queue));
    
    console.log('[SW] Action queued for offline processing:', action);
  } catch (error) {
    console.error('[SW] Error queuing offline action:', error);
  }
}

// Invalidate related caches when data changes
async function invalidateRelatedCaches(request) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/v1/software')) {
    // Clear software-related caches
    const cache = await caches.open(API_CACHE);
    const keys = await cache.keys();
    
    for (const key of keys) {
      if (key.url.includes('/api/v1/software') || 
          key.url.includes('/api/v1/dashboard') ||
          key.url.includes('/api/v1/notifications')) {
        await cache.delete(key);
      }
    }
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineQueue());
  }
});

// Process offline queue when back online
async function processOfflineQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('maijd_offline_queue') || '[]');
    
    if (queue.length === 0) {
      console.log('[SW] No offline actions to process');
      return;
    }
    
    console.log('[SW] Processing offline queue:', queue.length, 'actions');
    
    for (const action of queue) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body || undefined
        });
        
        if (response.ok) {
          console.log('[SW] Successfully processed offline action:', action.id);
          // Remove from queue
          const updatedQueue = queue.filter(a => a.id !== action.id);
          localStorage.setItem('maijd_offline_queue', JSON.stringify(updatedQueue));
        } else {
          console.warn('[SW] Failed to process offline action:', action.id, response.status);
        }
      } catch (error) {
        console.error('[SW] Error processing offline action:', action.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Error processing offline queue:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'New notification from Maijd Software Suite',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/icon-72x72.png',
        tag: 'maijd-notification',
        data: data,
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/static/icons/icon-72x72.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Maijd Software Suite', options)
      );
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      
      // Show default notification
      event.waitUntil(
        self.registration.showNotification('Maijd Software Suite', {
          body: 'You have a new notification',
          icon: '/static/icons/icon-192x192.png'
        })
      );
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/mobile-dashboard.html')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/mobile-dashboard.html')
    );
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0.0' });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[SW] All caches cleared');
    
    // Clear offline queue
    localStorage.removeItem('maijd_offline_queue');
    
    return true;
  } catch (error) {
    console.error('[SW] Error clearing caches:', error);
    return false;
  }
}

// Generate unique ID for offline actions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    // Remove old dynamic cache entries (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (responseDate < oneHourAgo) {
            await cache.delete(key);
            console.log('[SW] Cleaned up old cache entry:', key.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Error during cache cleanup:', error);
  }
}, 30 * 60 * 1000); // Run every 30 minutes

console.log('[SW] Maijd Software Suite Service Worker loaded successfully');
