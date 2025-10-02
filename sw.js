// This is a basic service worker that enables PWA installation.

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // The service worker is installed.
  // You could pre-cache assets here for offline functionality.
  // For now, we'll keep it simple to just enable installation.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  // The service worker is activated.
  // You can clean up old caches here.
});

self.addEventListener('fetch', (event) => {
  // This simple fetch handler is enough to make the app installable.
  // It follows a network-first approach.
  event.respondWith(fetch(event.request));
});
