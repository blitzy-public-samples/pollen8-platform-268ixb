import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Sidebar from '../components/Layout/Sidebar';
import Loader from '../components/UI/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import { trackPageView } from '../utils/analytics';

// Dynamically import NetworkDashboard for better performance
const NetworkDashboard = dynamic(
  () => import('../components/Network/NetworkDashboard'),
  { loading: () => <Loader />, ssr: false }
);

/**
 * NetworkPage component serves as the main entry point for the network functionality in the Pollen8 platform's frontend.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 * 3. Strategic Growth Tools (Technical specification/1.1 System Objectives)
 */
const NetworkPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    trackPageView('Network Page');
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // or a custom unauthorized component
  }

  return (
    <AuthContext.Consumer>
      {(authContext) => (
        <>
          <Head>
            <title>Pollen8 - Your Professional Network</title>
            <meta name="description" content="Manage and grow your professional network with Pollen8's intuitive tools and analytics." />
            <link rel="canonical" href="https://pollen8.com/network" />
          </Head>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex">
              <Sidebar />
              <ErrorBoundary>
                <div className="flex-grow p-6">
                  <h1 className="sr-only">Network Management Dashboard</h1>
                  <NetworkDashboard user={authContext.user} />
                </div>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </>
      )}
    </AuthContext.Consumer>
  );
};

export default NetworkPage;