// Offline support and notification actions for the web version of the app.
const CACHE = 'todo-v6';
const SHELL = [
  './', 'index.html', 'style.css', 'script.js', 'icon.svg', 'manifest.webmanifest',
  'fonts/fonts.css', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/badge-96.png',
];

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
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  if (request.url.endsWith('.apk')) return;
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then(r => r || (request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});

// Tap / "Done" / "Snooze" on a reminder: hand it to an open tab, or open the app.
self.addEventListener('notificationclick', e => {
  const action = e.action || 'tap';
  const { taskId = '', view = '' } = e.notification.data || {};
  e.notification.close();
  e.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const tab = tabs.find(c => new URL(c.url).origin === location.origin);
    if (tab) {
      tab.postMessage({ type: 'notification-action', action, taskId, view });
      if (action === 'tap' && 'focus' in tab) await tab.focus();
      return;
    }
    const params = new URLSearchParams({ action, task: taskId, view });
    await self.clients.openWindow(`./?${params}`);
  })());
});
