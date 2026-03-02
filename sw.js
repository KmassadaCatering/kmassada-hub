// Kmassada Hub Service Worker - v02/03 12:10 - NETWORK FIRST + AUTO UPDATE
const CACHE_NAME = 'kmassada-hub-v202603021210';

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately, replacing old SW
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim()) // Take control of all open pages
  );
});

// NETWORK FIRST - always try network, fallback to cache
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
