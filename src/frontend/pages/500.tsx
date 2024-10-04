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
 * This file contains the custom 500 (Internal Server Error) page component for the Pollen8 application,
 * providing a user-friendly error message when server-side errors occur.
 *
 * Requirements addressed:
 * 1. Error Handling
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provide a custom 500 error page for better user experience
 */

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px); // Adjust based on header and footer height
  padding: ${theme.spacing(4)};
  text-align: center;
  background-color: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
`;

const ErrorTitle = styled.h1`
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  margin-bottom: ${theme.spacing(2)};
`;

const ErrorMessage = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  margin-bottom: ${theme.spacing(4)};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  margin-top: ${theme.spacing(2)};
`;

const Custom500: NextPage = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.reload();
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>500 - Internal Server Error | Pollen8</title>
        <meta name="description" content="An unexpected error occurred on our server. We're working to fix it." />
      </Head>
      <Header />
      <ErrorContainer>
        <ErrorTitle>500 - Internal Server Error</ErrorTitle>
        <ErrorMessage>
          Oops! Something went wrong on our end. We're working to fix it as quickly as possible.
        </ErrorMessage>
        <ButtonContainer>
          <Button onClick={handleRefresh} variant="primary">
            Refresh Page
          </Button>
          <Button onClick={handleReturnToDashboard} variant="outline">
            Return to Dashboard
          </Button>
        </ButtonContainer>
      </ErrorContainer>
      <Footer />
    </>
  );
};

export default Custom500;