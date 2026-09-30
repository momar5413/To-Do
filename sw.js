// Offline support: serve the app shell from cache when the network is unavailable.
const CACHE = 'todo-v5';
const SHELL = ['./', 'index.html', 'style.css', 'script.js', 'icon.svg', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first so updates show up immediately; fall back to cache when offline.
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok && (new URL(request.url).origin === location.origin || request.url.includes('fonts.g'))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then(r => r || (request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
