import React from 'react';
import styled from 'styled-components';
import theme from '../../shared/styles/theme';

/**
 * This file defines a reusable Button component for the Pollen8 platform's user interface.
 * It's designed to be a flexible, accessible, and visually consistent button element
 * that adheres to the platform's black and white aesthetic.
 *
 * Requirements addressed:
 * 1. Consistent UI
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provides a standardized button component for use across the application
 * 
 * 2. Accessibility
 *    Location: Technical specification/9.3.4 Compliance and Best Practices/WCAG compliance
 *    Description: Ensures buttons are accessible to all users
 * 
 * 3. Theming
 *    Location: Technical specification/3.5 Theme Design/Color Palette
 *    Description: Implements the black and white design aesthetic
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.button.fontSize};
  font-weight: ${theme.typography.button.fontWeight};
  text-transform: ${theme.typography.button.textTransform};
  border-radius: 50px;
  padding: ${props => 
    props.size === 'small' ? '8px 16px' :
    props.size === 'large' ? '16px 32px' :
    '12px 24px'
  };
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.primary.contrastText};
          border: none;
          &:hover, &:focus {
            background-color: ${theme.palette.grey[800]};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.palette.secondary.main};
          color: ${theme.palette.secondary.contrastText};
          border: none;
          &:hover, &:focus {
            background-color: ${theme.palette.grey[200]};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.palette.primary.main};
          border: 2px solid ${theme.palette.primary.main};
          &:hover, &:focus {
            background-color: ${theme.palette.grey[200]};
          }
        `;
      default:
        return `
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.primary.contrastText};
          border: none;
          &:hover, &:focus {
            background-color: ${theme.palette.grey[800]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.isLoading && `
    position: relative;
    color: transparent;
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-top: -8px;
      margin-left: -8px;
      border: 2px solid ${theme.palette.common.white};
      border-top-color: transparent;
      border-radius: 50%;
      animation: button-loading-spinner 1s linear infinite;
    }
  `}

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default React.memo(Button);