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

// --- Service Worker Registration ---

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // In sandboxed environments, relative paths for service workers can be resolved
    // against an incorrect origin. To fix this, we construct an absolute URL
    // using `window.location.origin` to ensure the correct path.
    const swUrl = `${window.location.origin}/sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered successfully.');
        console.log('Service Worker scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  }
};

// To prevent "invalid state" errors, we register the service worker only after
// the page has fully loaded. This standard pattern handles cases where the
// script runs before or after the 'load' event has fired.
if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}
