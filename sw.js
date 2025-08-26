// Service Worker for TickerChart AI - Performance Optimization
// Service Worker لـ TickerChart AI - تحسين الأداء

const CACHE_NAME = 'tickerchart-ai-v4.0';
const STATIC_CACHE = 'tickerchart-static-v4.0';
const DYNAMIC_CACHE = 'tickerchart-dynamic-v4.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.php',
    '/assets/css/style-optimized.css',
    '/assets/js/main-optimized.js',
    '/assets/js/charts.js',
    '/assets/js/utils.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('🔄 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip extension URLs and external API calls
    if (url.protocol === 'chrome-extension:' || 
        url.protocol === 'moz-extension:' || 
        url.protocol === 'safari-extension:' ||
        url.pathname.includes('/api/') || 
        url.pathname.includes('/ai/')) {
        return;
    }
    
    // Handle different types of requests
    if (request.destination === 'style' || request.destination === 'script') {
        // CSS and JS files - cache first strategy
        event.respondWith(cacheFirst(request));
    } else if (request.destination === 'image') {
        // Images - cache first strategy
        event.respondWith(cacheFirst(request));
    } else {
        // Other resources - network first strategy
        event.respondWith(networkFirst(request));
    }
});

// Cache first strategy
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Serving from cache:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Don't cache chrome-extension URLs or other unsupported schemes
            if (!request.url.startsWith('chrome-extension://') && 
                !request.url.startsWith('moz-extension://') &&
                !request.url.startsWith('safari-extension://')) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
                console.log('💾 Cached new resource:', request.url);
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Cache first strategy failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Don't cache chrome-extension URLs or other unsupported schemes
            if (!request.url.startsWith('chrome-extension://') && 
                !request.url.startsWith('moz-extension://') &&
                !request.url.startsWith('safari-extension://')) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
                console.log('💾 Cached network response:', request.url);
            }
        }
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }
        
        return new Response('Network error', { status: 503 });
    }
}

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// Background sync function
async function doBackgroundSync() {
    try {
        // Sync any pending data when connection is restored
        console.log('🔄 Performing background sync...');
        
        // You can add specific sync logic here
        // For example, sync market data, user preferences, etc.
        
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Push notification handler
self.addEventListener('push', event => {
    console.log('📱 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'تحديث جديد في سوق الأسهم السعودي',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'استكشف السوق',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('TickerChart AI', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('👆 Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#market')
        );
    }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
    console.log('💬 Message received in SW:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handler
self.addEventListener('error', event => {
    console.error('❌ Service Worker error:', event.error);
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
});

// Performance monitoring
self.addEventListener('fetch', event => {
    const startTime = performance.now();
    
    event.waitUntil(
        (async () => {
            try {
                await event.respondWith(fetch(event.request));
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                // Log slow requests
                if (duration > 1000) {
                    console.warn(`🐌 Slow request: ${event.request.url} took ${duration.toFixed(2)}ms`);
                }
            } catch (error) {
                console.error('❌ Fetch error:', error);
            }
        })()
    );
});

console.log('🔧 Service Worker loaded successfully'); 