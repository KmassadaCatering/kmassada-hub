// v202603021140 - Force refresh
const CACHE = 'kmassada-v202603021140';
const APP_SHELL = ['/kmassada-hub/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL))
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control of all pages
});

self.addEventListener('fetch', e => {
  // Always try network first, fallback to cache
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).catch(() => caches.match(e.request))
  );
});
