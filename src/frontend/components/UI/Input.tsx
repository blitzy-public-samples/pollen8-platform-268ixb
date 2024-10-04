import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

/**
 * This file defines a reusable Input component for the Pollen8 platform's user interface,
 * adhering to the black and white minimalist design aesthetic.
 * 
 * Requirements addressed:
 * 1. Minimalist Design
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implement a black and white aesthetic for UI components
 * 
 * 2. Proxima Nova Font
 *    Location: Technical specification/3.5 Theme Design/Typography
 *    Description: Use Proxima Nova font for form fields
 */

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const StyledInput = styled.input<{ error?: string; theme: any }>`
  width: 100%;
  padding: 12px 16px;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.body1.fontSize};
  font-weight: ${props => props.theme.typography.body1.fontWeight};
  color: ${props => props.theme.palette.text.primary};
  background-color: ${props => props.theme.palette.background.default};
  border: 3px solid ${props => props.error ? props.theme.palette.error.main : props.theme.palette.primary.main};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${props => props.error ? props.theme.palette.error.main : props.theme.palette.primary.dark};
  }

  &::placeholder {
    color: ${props => props.theme.palette.text.secondary};
  }

  @media (max-width: 768px) {
    font-size: 16px; // Prevent zoom on mobile devices
  }
`;

const ErrorMessage = styled.p<{ theme: any }>`
  margin-top: 4px;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: 12px;
  color: ${props => props.theme.palette.error.main};
`;

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, error }) => {
  const theme = useTheme();

  return (
    <div>
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        theme={theme}
        aria-invalid={!!error}
        aria-describedby={error ? `${type}-error` : undefined}
      />
      {error && (
        <ErrorMessage theme={theme} id={`${type}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};

export default Input;