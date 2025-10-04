// sw.js

const CACHE_NAME = 'expense-tracker-cache-v1';

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const CDN_URLS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react@^19.1.1/jsx-runtime',
  'https://aistudiocdn.com/recharts@^3.2.1'
];

// Install event: cache the application shell and CDN assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Service Worker: Caching App Shell and CDN assets');
      
      // Cache local app shell files. This is atomic.
      await cache.addAll(APP_SHELL_URLS).catch(err => console.error("App Shell caching failed:", err));
      
      // Cache CDN files individually to be more fault-tolerant
      for (const url of CDN_URLS) {
          try {
              // Using fetch and put to handle cross-origin requests gracefully
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              } else {
                console.warn(`Failed to cache CDN asset: ${url}, status: ${response.status}`);
              }
          } catch (err) {
              console.warn(`Could not cache CDN asset: ${url}`, err);
          }
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Use a stale-while-revalidate strategy.
self.addEventListener('fetch', event => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Try to get the resource from the cache.
      const cachedResponse = await cache.match(event.request);

      // 2. Fetch the resource from the network in the background.
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // If the fetch is successful, update the cache.
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        // The network failed, which is fine if we have a cached response.
        if (!cachedResponse) {
            console.error("Fetch failed and no cache available:", err);
        }
      });

      // 3. Return the cached response if available; otherwise, wait for the network response.
      // This ensures the app works offline by serving the cached content.
      return cachedResponse || fetchPromise;
    })
  );
});
