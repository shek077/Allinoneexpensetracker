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

// To prevent race conditions and "invalid state" errors, especially in sandboxed
// environments, we ensure the document is fully stable before registering.
// A small timeout helps sidestep transient states that can occur immediately
// after the 'load' event.
const safelyRegister = () => {
    setTimeout(registerServiceWorker, 100);
};

// Check if the document is already loaded. If it is, register immediately (after a brief timeout).
// Otherwise, wait for the 'load' event. This covers all timing scenarios.
if (document.readyState === 'complete') {
  safelyRegister();
} else {
  window.addEventListener('load', safelyRegister);
}
