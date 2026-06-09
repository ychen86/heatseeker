// ── HeatSeeker Matrix — Service Worker ──
// Cache version: bump this string to force ALL old caches to be deleted
// on activation. This is what clears the stale prior-version page.
const CACHE = 'heatseeker-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: pre-cache the app shell and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

// Activate: delete old caches, take control of all open pages
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: NETWORK-FIRST for GET requests so a freshly-deployed version always wins,
// falling back to cache when offline. Prevents the "stuck on old version" trap.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Skip UW API requests — never cache live data
  if (event.request.url.includes('unusualwhales.com')) return;
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('./index.html')))
  );
});
