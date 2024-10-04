import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import OnboardingForm from '../../components/Auth/OnboardingForm';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { UserProfile } from '../../shared/types/user';

/**
 * OnboardingPage component for guiding new users through the process of completing their profile after phone verification.
 * 
 * Requirements addressed:
 * 1. User Profile Creation
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Collect minimum required user information
 * 
 * 2. Industry Selection
 *    Location: Technical specification/1.2 Scope/Limitations and Constraints/2. Functional Constraints
 *    Description: Ensure users select at least 3 industries
 * 
 * 3. Interest Selection
 *    Location: Technical specification/1.2 Scope/Limitations and Constraints/2. Functional Constraints
 *    Description: Ensure users select at least 3 interests
 * 
 * 4. Location Data
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Collect user's location information
 */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.palette.background.default};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1.fontSize};
  font-weight: ${props => props.theme.typography.h1.fontWeight};
  color: ${props => props.theme.palette.text.primary};
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.body1.fontSize};
  color: ${props => props.theme.palette.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const OnboardingPage: NextPage = () => {
  const { user, isLoading, error, isAuthenticated, updateUserProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleOnboardingSubmit = async (profileData: UserProfile) => {
    try {
      await updateUserProfile(profileData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageContainer>
      <Head>
        <title>Complete Your Profile | Pollen8</title>
        <meta name="description" content="Complete your Pollen8 profile to start connecting with professionals in your industry." />
      </Head>

      <Header />

      <MainContent>
        <Title>Welcome to Pollen8</Title>
        <Description>
          Let's complete your profile to help you connect with professionals in your industry and areas of interest.
        </Description>
        <OnboardingForm onSubmit={handleOnboardingSubmit} />
      </MainContent>

      <Footer />
    </PageContainer>
  );
};

export default OnboardingPage;