/**
 * FloodGuard AI — Service Worker (Phase 1 stub)
 *
 * Phase 1: Caches the app shell for offline fallback.
 * Phase 3: Extend to cache the last-known risk map tile set and
 *           queue outgoing field reports for sync on reconnect.
 */

const CACHE_NAME = 'floodguard-v1';
const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for API calls; cache-first for static assets
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(
          JSON.stringify({ error: 'OFFLINE', message: 'Network unavailable. Showing last cached data.' }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});

// Phase 3: Background sync for queued field reports
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'field-reports-sync') {
//     event.waitUntil(syncQueuedFieldReports());
//   }
// });
