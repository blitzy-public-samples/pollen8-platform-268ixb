import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import PhoneVerification from '../../components/Auth/PhoneVerification';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { trackPageView } from '../../utils/analytics';

/**
 * Verify page component for the Pollen8 platform.
 * This page serves as the container for the phone verification process during user authentication.
 * 
 * Requirements addressed:
 * 1. Phone Verification (Technical specification/1.1 System Objectives/Verified Connections)
 * 2. User Authentication (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */

const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${props => props.theme.palette.background.default};
`;

const Verify: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Track page view for analytics
    trackPageView('/auth/verify');

    // Redirect to dashboard if user is already authenticated
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Consider using a proper Loader component
  }

  return (
    <VerifyContainer>
      <Header />
      <MainContent>
        <PhoneVerification />
      </MainContent>
      <Footer />
    </VerifyContainer>
  );
};

export default Verify;