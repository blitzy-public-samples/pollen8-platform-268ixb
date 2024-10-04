import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../context/ThemeContext';

/**
 * This file contains the implementation of a reusable Toast component for displaying
 * temporary notifications or messages to the user in the Pollen8 application.
 * 
 * Requirements addressed:
 * 1. User Feedback
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provide visual feedback for user actions
 */

// Define the props for the Toast component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

// Define the styled components
const ToastContainer = styled.div<{ type: ToastProps['type'] }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;

  ${({ type, theme }) => {
    const isDarkMode = theme.palette.mode === 'dark';
    switch (type) {
      case 'success':
        return `
          background-color: ${isDarkMode ? '#2ecc71' : '#e6fff2'};
          color: ${isDarkMode ? '#ffffff' : '#27ae60'};
        `;
      case 'error':
        return `
          background-color: ${isDarkMode ? '#e74c3c' : '#ffe6e6'};
          color: ${isDarkMode ? '#ffffff' : '#c0392b'};
        `;
      case 'info':
      default:
        return `
          background-color: ${isDarkMode ? '#3498db' : '#e6f3ff'};
          color: ${isDarkMode ? '#ffffff' : '#2980b9'};
        `;
    }
  }}

  &.fadeOut {
    animation: fadeOut 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
`;

const ToastMessage = styled.p`
  margin: 0;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!isVisible) {
      const fadeOutTimer = setTimeout(() => {
        onClose();
      }, 300); // Match this with the fadeOut animation duration

      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <ToastContainer
      type={type}
      className={isVisible ? 'fadeIn' : 'fadeOut'}
      theme={theme}
      role="alert"
      aria-live="assertive"
    >
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={handleClose} aria-label="Close notification">
        ×
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;