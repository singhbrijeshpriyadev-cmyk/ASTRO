// Kaalika Lightweight Service Worker for PWA
const CACHE_NAME = 'kaalika-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never intercept API routes or non-GET requests - ensure dynamic cloud calculations always pass through
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Network first with cache fallback for static assets
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
