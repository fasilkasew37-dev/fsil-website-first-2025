const CACHE_NAME = 'fasil-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/eagle_image.jpg',
  '/lion_image.jpg',
  '/dove_image.jpg',
  '/image_flag_1.jpg',
  '/image_fwa_arma.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
