self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('look-do-dia-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/camera.js',
        '/db.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
