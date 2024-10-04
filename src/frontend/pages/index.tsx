import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Button from '../components/UI/Button';
import PhoneVerification from '../components/Auth/PhoneVerification';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { trackPageView } from '../utils/analytics';
import useAuth from '../hooks/useAuth';

/**
 * This file serves as the main entry point for the Pollen8 platform, representing the home page or landing page of the application.
 * 
 * Requirements addressed:
 * 1. Landing Page (Technical specification/1.1 System Objectives)
 *    Description: Provides an introduction to Pollen8 and its key features
 * 2. User Authentication Entry (Technical specification/1.2 Scope/Core Functionalities)
 *    Description: Offers a way for users to start the authentication process
 * 3. Visual Appeal (Technical specification/1.2 Scope/Product Overview)
 *    Description: Implements the minimalist black and white aesthetic
 */

const LandingPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.text.primary};
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing(4)};
  text-align: center;
`;

const HeroSection = styled.section`
  margin-bottom: ${props => props.theme.spacing(6)};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1.fontSize};
  font-weight: ${props => props.theme.typography.h1.fontWeight};
  margin-bottom: ${props => props.theme.spacing(2)};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.subtitle1.fontSize};
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const FeatureSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing(4)};
  margin-bottom: ${props => props.theme.spacing(6)};
`;

const FeatureItem = styled.div`
  padding: ${props => props.theme.spacing(2)};
  border: 1px solid ${props => props.theme.palette.divider};
  border-radius: ${props => props.theme.shape.borderRadius};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.typography.h5.fontSize};
  font-weight: ${props => props.theme.typography.h5.fontWeight};
  margin-bottom: ${props => props.theme.spacing(1)};
`;

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.typography.body2.fontSize};
`;

const CTASection = styled.section`
  margin-top: ${props => props.theme.spacing(4)};
`;

const LandingPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    trackPageView('Landing Page');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <LandingPageContainer>
      <Head>
        <title>Pollen8 - Professional Networking Reimagined</title>
        <meta name="description" content="Pollen8 is a data-driven professional networking platform that helps you build verified connections and grow your network strategically." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <MainContent>
        <HeroSection>
          <Title>Professional Networking Reimagined</Title>
          <Subtitle>Build verified connections and grow your network with data-driven insights</Subtitle>
          <Button onClick={() => router.push('/auth/verify')} size="large">
            Get Connected
          </Button>
        </HeroSection>

        <FeatureSection>
          <FeatureItem>
            <FeatureTitle>Verified Connections</FeatureTitle>
            <FeatureDescription>Connect with real professionals through our rigorous verification process</FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>Quantifiable Growth</FeatureTitle>
            <FeatureDescription>Track your network's value and growth with our unique metrics</FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>Visual Network Management</FeatureTitle>
            <FeatureDescription>Manage and analyze your network with intuitive visualizations</FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>Strategic Expansion</FeatureTitle>
            <FeatureDescription>Grow your network strategically with our smart invite system</FeatureDescription>
          </FeatureItem>
        </FeatureSection>

        <CTASection>
          <PhoneVerification />
        </CTASection>
      </MainContent>

      <Footer />
    </LandingPageContainer>
  );
};

export default LandingPage;