// Maijjd Service Worker
// Enables offline functionality and PWA features

const CACHE_NAME = 'maijjd-v1.0.2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
  API: 'api'
};

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for development files and API calls
  if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  } else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
  }
});

// Handle GET requests with cache-first strategy
async function handleGetRequest(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Return cached response and update in background
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    return caches.match('/offline.html');
  }
}

// Handle POST requests (for forms, API calls)
async function handlePostRequest(request) {
  try {
    // For POST requests, always try network first
    const response = await fetch(request);
    
    // If successful, cache the response if it's a GET request
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // If offline, queue the request for later sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
    }
    
    // Return offline response
    return new Response(JSON.stringify({ 
      error: 'Offline mode. Your request will be synced when you\'re back online.' 
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Update cache in background for better performance
async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response);
    }
  } catch (error) {
    // Silently fail background updates
    console.log('Background cache update failed:', error);
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force all clients to reload to get fresh content
      return clients.claim();
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Maijjd', options)
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data when back online
    console.log('Performing background sync...');
    
    // You can add specific sync logic here
    // For example, sync form submissions, API calls, etc.
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
