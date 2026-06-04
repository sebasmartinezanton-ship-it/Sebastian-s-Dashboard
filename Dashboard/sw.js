// Bump this string whenever you redeploy to bust the old cache.
const CACHE = 'dashboard-v2';

const PRECACHE = [
  '/',
  '/index.html',
  '/finance.html',
  '/gym.html',
  '/health.html',
  '/water.html',
  '/fitbit.html',
  '/topbar.js',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
];

// ── Install: cache all shell assets ──────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for same-origin GET, network-only for everything else ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip: non-GET, cross-origin, or Netlify function calls (always need live data).
  if (
    e.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/.netlify/')
  ) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Kick off a network fetch to refresh the cache in the background.
      const networkFetch = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);   // offline: fall back to whatever we have cached

      // Serve from cache immediately if available; otherwise wait for network.
      return cached || networkFetch;
    })
  );
});
