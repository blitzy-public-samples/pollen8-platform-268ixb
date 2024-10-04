import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ProfileCard from '../components/Profile/ProfileCard';
import InviteGenerator from '../components/Invite/InviteGenerator';
import InviteStats from '../components/Invite/InviteStats';
import ErrorBoundary from '../components/ErrorBoundary';
import { trackPageView } from '../utils/analytics';

// Dynamically import NetworkDashboard for better initial load time
const NetworkDashboard = dynamic(
  () => import('../components/Network/NetworkDashboard'),
  { ssr: false, loading: () => <p>Loading network dashboard...</p> }
);

/**
 * Dashboard page component serves as the main landing page for authenticated users in the Pollen8 platform.
 * It integrates various components to provide a comprehensive overview of the user's professional network and platform activities.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Quantifiable Networking (Technical specification/1.1 System Objectives)
 * 3. Strategic Growth Tools (Technical specification/1.1 System Objectives)
 * 4. Verified Connections (Technical specification/1.1 System Objectives)
 */
const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile().catch((err) => setError('Failed to fetch profile data'));
    }
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    trackPageView('Dashboard');
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated || !user) {
    return null; // This will be handled by the first useEffect
  }

  return (
    <>
      <Head>
        <title>Pollen8 Dashboard</title>
        <meta name="description" content="Manage your professional network with Pollen8" />
      </Head>
      <div className="dashboard-layout">
        <Header />
        <div className="dashboard-content">
          <Sidebar />
          <main>
            <h1>Welcome, {user.name}</h1>
            <ErrorBoundary>
              <div className="dashboard-grid">
                <section className="profile-section">
                  <ProfileCard profile={profile} />
                </section>
                <section className="network-section">
                  <NetworkDashboard />
                </section>
                <section className="invite-section">
                  <InviteGenerator />
                  <InviteStats />
                </section>
              </div>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;