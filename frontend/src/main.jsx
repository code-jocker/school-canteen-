// Suppress React DevTools warning before any React code runs
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

const suppressDevToolsWarning = (originalFn) => {
  return function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('React DevTools') || 
         message.includes('react-devtools') ||
         message.includes('Download the React DevTools'))) {
      return;
    }
    return originalFn.apply(this, args);
  };
};

console.warn = suppressDevToolsWarning(originalConsoleWarn);
console.error = suppressDevToolsWarning(originalConsoleError);

// Also suppress on window.__REACT_DEVTOOLS_GLOBAL_HOOK__ if it exists
if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  // Override any listeners that might show warnings
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
