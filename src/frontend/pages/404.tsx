import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from '../components/UI/Button';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import theme from '../../shared/styles/theme';

/**
 * This file represents the custom 404 (Not Found) error page for the Pollen8 application.
 * It provides a user-friendly message and a way to navigate back to the home page.
 *
 * Requirements addressed:
 * 1. Custom Error Page
 *    Location: Technical specification/1.2 Scope/Core Functionalities
 *    Description: Provide a user-friendly 404 page
 */

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing(4)};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  margin-bottom: ${theme.spacing(2)};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  margin-bottom: ${theme.spacing(4)};
`;

const NotFoundPage: NextPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <NotFoundContainer>
      <Head>
        <title>404 - Page Not Found | Pollen8</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>

      <Header />

      <ContentWrapper>
        <Title>404 - Page Not Found</Title>
        <Subtitle>Oops! The page you're looking for doesn't exist or has been moved.</Subtitle>
        <Button onClick={handleGoHome} variant="primary" size="large">
          Go to Home Page
        </Button>
      </ContentWrapper>

      <Footer />
    </NotFoundContainer>
  );
};

export default NotFoundPage;