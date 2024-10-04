import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

/**
 * Frontend Initialization
 * Requirements addressed:
 * 1. Frontend Initialization (Technical specification/2.3.1 Frontend Components)
 *    Description: Set up the React application entry point
 * 2. React Root Rendering (Technical specification/2.3.1 Frontend Components)
 *    Description: Render the main App component
 * 3. Performance Optimization (Technical specification/1.2 Scope/Core Functionalities)
 *    Description: Implement performance enhancements for initial load
 */

// Create root using ReactDOM.createRoot for concurrent mode rendering
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the App component within React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Implementation details:
 * 
 * 1. Import necessary dependencies:
 *    - React and ReactDOM for rendering
 *    - App component as the main application container
 *    - Global styles from './styles/index.css'
 * 
 * 2. Use ReactDOM.createRoot for Concurrent Mode:
 *    - This enables React 18's concurrent rendering features
 *    - Improves performance for large component trees
 * 
 * 3. Render within React.StrictMode:
 *    - Enables additional checks and warnings in development
 *    - Helps identify potential problems in the application
 * 
 * Performance considerations:
 * - Using createRoot enables concurrent rendering, improving overall app performance
 * - Strict Mode helps catch potential issues early in the development process
 * 
 * Accessibility:
 * - Ensure that the root element has appropriate ARIA attributes if necessary
 * 
 * Error Handling:
 * - Consider implementing an error boundary at this level to catch any unhandled errors
 * 
 * Future enhancements:
 * - Implement code splitting for performance optimization
 * - Add service worker registration for PWA features
 * - Initialize any necessary third-party libraries or services
 */

// Error handling for production
if (process.env.NODE_ENV === 'production') {
  // Log errors to an error tracking service (e.g., Sentry)
  window.onerror = (message, source, lineno, colno, error) => {
    // TODO: Implement error logging to a service
    console.error('Unhandled error:', error);
  };
}

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report core web vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Preload critical assets
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'style';
preloadLink.href = '/styles/critical.css'; // Adjust path as needed
document.head.appendChild(preloadLink);

// Initialize any global services or configurations
// Example: Analytics initialization
import('./utils/analytics').then((analytics) => {
  analytics.init();
});