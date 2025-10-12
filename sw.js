// A minimal service worker to enable PWA installability.
// It does not cache any assets, making the app online-only.

self.addEventListener('install', (event) => {
  // The install event is fired when the service worker is first installed.
  // We don't need to do anything here for an online-only app.
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  // The activate event is fired when the service worker becomes active.
  // We don't need to do anything here for an online-only app.
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // The fetch event is fired for every network request.
  // We don't intercept the request and just let it fall through to the network.
  // This ensures the app remains online-only.
  return;
});
