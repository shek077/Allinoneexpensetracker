import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // In sandboxed environments, trying to construct a full URL can be unreliable
    // due to invalid base URLs (e.g., from `import.meta.url` or `window.location`).
    // A simple relative path is often the most robust solution, as the browser
    // resolves it against the document's location.
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully.');
        console.log('Service Worker scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}
