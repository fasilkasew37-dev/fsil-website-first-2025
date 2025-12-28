const CACHE_NAME = 'fasil-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './lion_image.jpg',
  './eagle_image.jpg'
];

// መጫን (Install)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// መጠቀም (Fetch)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
