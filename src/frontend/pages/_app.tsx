import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { initializeAnalytics, trackPageView } from '../utils/analytics';
import Toast from '../components/UI/Toast';
import '../styles/index.css';

/**
 * This is the main application component that wraps all pages in the Pollen8 frontend.
 * It sets up global providers, applies common layouts, and handles analytics initialization.
 * 
 * Requirements addressed:
 * 1. Global State Management
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Implement global state management for user authentication and theme
 * 
 * 2. Consistent Styling
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Apply global styles and theme across all pages
 * 
 * 3. Performance Optimization
 *    Location: Technical specification/1.2 Scope/Core Functionalities
 *    Description: Implement performance optimizations for the SPA
 */

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Initialize analytics when the app loads
    initializeAnalytics();

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    // Add event listener for route changes
    window.addEventListener('routeChangeComplete', handleRouteChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Head>
          <title>Pollen8 - Professional Networking Platform</title>
          <meta name="description" content="Pollen8 - A data-driven, visually engaging professional networking platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <link rel="icon" href="/favicon.ico" />
          {/* Preload Proxima Nova font */}
          <link
            rel="preload"
            href="/fonts/ProximaNova-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <Component {...pageProps} />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default MyApp;