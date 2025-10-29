// @ts-nocheck
const CACHE_NAME = 'finance-app-v8'; // Incremented version to apply the fix

// All assets needed for the app shell to function offline.
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.css',
    '/icon.svg',
    '/index.tsx' 
];

// 1. Install Service Worker & Pre-cache all critical assets
self.addEventListener('install', evt => {
    console.log('[Service Worker] Install event');
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Pre-caching all critical assets.');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] All critical assets cached successfully.');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Failed to cache critical assets:', error);
            })
    );
});

// 2. Activate Service Worker & Clean up old caches
self.addEventListener('activate', evt => {
    console.log('[Service Worker] Activate event');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                .filter(key => key !== CACHE_NAME)
                .map(key => {
                    console.log(`[Service Worker] Deleting old cache: ${key}`);
                    return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim()) // Ensure the new SW takes control immediately
    );
});

// 3. Fetch Event: Cache-first, with network fallback and offline shell for navigation
self.addEventListener('fetch', evt => {
    // We only handle GET requests
    if (evt.request.method !== 'GET') {
        return;
    }

    evt.respondWith(
        caches.match(evt.request).then(cachedResponse => {
            // If we have a cached response, return it.
            if (cachedResponse) {
                return cachedResponse;
            }

            // If not, fetch from the network.
            return fetch(evt.request).then(networkResponse => {
                    // If the fetch is successful, cache the response and return it.
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(evt.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(error => {
                    console.log('[Service Worker] Network request failed. Serving fallback.', error);
                    // For navigation requests (i.e., loading a page), if the network fails,
                    // serve the main index.html from the cache. This prevents 404 errors when offline.
                    if (evt.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});


// 4. Sync Event: This remains for future backend integration.
self.addEventListener('sync', evt => {
    if (evt.tag === 'sync-data') {
        console.log('[Service Worker] Background sync event triggered for sync-data.');
        // The logic to sync with a real backend would go here.
        // For example: syncDataWithServer();
    }
});