const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// cache names defined with versioning
const CACHE_NAMES = {
  assetCache: 'asset-cache-v1', 
  pageCache: 'page-cache-v1', 
};

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: CACHE_NAMES.pageCache,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});


warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// asset caching
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.assetCache,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// activate event for cleaning old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});