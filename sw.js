// Kmassada Hub Service Worker - v02/03 11:54 - NETWORK FIRST
const CACHE_NAME = 'kmassada-hub-v202603021154';

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// NETWORK FIRST - always try network, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the fresh response
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed - try cache
        return caches.match(event.request);
      })
  );
});
