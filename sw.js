// sw.js

const CACHE_NAME = 'expense-tracker-cache-v3';

// A comprehensive list of all assets needed for the app to run offline.
const URLS_TO_CACHE = [
  // App Shell
  '/',
  '/index.html',
  '/manifest.json',

  // Icons
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  // Scripts - All TS/TSX files that are part of the module graph
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/hooks/useLocalStorage.ts',
  '/hooks/useTheme.tsx',
  '/services/pdfGenerator.ts',
  '/services/rippleEffect.ts',
  '/components/NeumorphicCard.tsx',
  '/components/Header.tsx',
  '/components/Summary.tsx',
  '/components/Charts.tsx',
  '/components/Filters.tsx',
  '/components/TransactionList.tsx',
  '/components/TransactionItem.tsx',
  '/components/TransactionForm.tsx',
  '/components/BudgetProgress.tsx',
  '/components/BudgetGoals.tsx',
  '/components/ConfirmationDialog.tsx',
  '/components/Alerts.tsx',
  '/components/UpcomingSubscriptions.tsx',
  '/components/SubscriptionManager.tsx',
  '/components/Balances.tsx',
  '/components/PeopleManager.tsx',
  '/components/CategoryTagManager.tsx',
  '/components/AnimatedModal.tsx',
  '/components/Loader.tsx',

  // CDN URLs
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react@^19.1.1/jsx-runtime',
  'https://aistudiocdn.com/recharts@^3.2.1',

  // Google Fonts (ensure these match index.html)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2'
];

// Install event: cache all application assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching all assets for offline use.');
        // Use addAll with a catch block for individual failures
        const cachePromises = URLS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => {
                console.warn(`Service Worker: Failed to cache ${url}`, err);
            });
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error('Service Worker: Caching failed during install:', err);
      })
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
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);

  // Use cache-first for versioned CDN assets and fonts for stability
  if (url.hostname === 'aistudiocdn.com' || url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Use stale-while-revalidate for everything else (app shell, local assets)
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Try to get the resource from the cache.
      const cachedResponse = await cache.match(event.request);

      // 2. Fetch the resource from the network in the background.
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        if (!cachedResponse) {
            console.error("Fetch failed, and no response was found in cache.", err);
        }
      });

      // 3. Return the cached response if available, otherwise, wait for the network response.
      return cachedResponse || fetchPromise;
    })
  );
});