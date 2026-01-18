const CACHE_NAME = 'fasil-web-app-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './eagle_image.jpg',
    './lion_image.jpg',
    './dove_image.jpg',
    './image_fasil_1.jpg',
    './image_flag_1.jpg',
    './image_fwa_arma.png',
    './image_vpn_1.jpg',
    './proton_icon.png'
];

// Install Event: Caches resources
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Service Worker: Caching Files');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event: Cleans up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 Service Worker: Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event: Network First strategy (Load from internet, fallback to cache if offline)
self.addEventListener('fetch', (event) => {
    // Only handle http/https requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Return response and update cache
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // If offline, return from cache
                return caches.match(event.request);
            })
    );
});
