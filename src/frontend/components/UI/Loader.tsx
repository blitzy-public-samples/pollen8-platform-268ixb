import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../shared/styles/theme';

/**
 * This file contains a reusable Loader component for the Pollen8 platform,
 * providing a consistent loading indicator across the application.
 * 
 * Requirements addressed:
 * 1. User Experience
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provide visual feedback during asynchronous operations
 */

// Define the props for the Loader component
interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
}

// Define the spin animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Create a styled component for the spinner wrapper
const SpinnerWrapper = styled.div<LoaderProps>`
  display: inline-block;
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '20px';
      case 'large':
        return '40px';
      default:
        return '30px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '20px';
      case 'large':
        return '40px';
      default:
        return '30px';
    }
  }};
`;

// Create a styled component for the spinner
const Spinner = styled.div<LoaderProps>`
  width: 100%;
  height: 100%;
  border: 3px solid ${props => {
    switch (props.color) {
      case 'secondary':
        return theme.palette.secondary.main;
      case 'white':
        return '#FFFFFF';
      default:
        return theme.palette.primary.main;
    }
  }};
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/**
 * Loader component that renders a loading spinner with customizable size and color.
 * 
 * @param {LoaderProps} props - The props for the Loader component
 * @returns {JSX.Element} The rendered Loader component
 */
const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = 'primary' }) => {
  return (
    <SpinnerWrapper size={size} color={color} role="status" aria-label="Loading">
      <Spinner size={size} color={color} />
    </SpinnerWrapper>
  );
};

export default Loader;