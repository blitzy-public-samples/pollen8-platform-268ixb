import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Loader from '../UI/Loader';
import Toast from '../UI/Toast';
import { validatePhoneNumber } from '../../shared/utils/validation';

/**
 * PhoneVerification component handles the phone number verification process
 * during user authentication in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Phone Verification (Technical specification/1.1 System Objectives/Verified Connections)
 * 2. User Authentication (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */

interface FormData {
  phoneNumber: string;
  verificationCode: string;
}

const PhoneVerificationContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.palette.text.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PhoneVerification: React.FC = () => {
  const { register, handleSubmit, errors, watch } = useForm<FormData>();
  const { login, verifyCode, isLoading, error } = useAuth();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const phoneNumber = watch('phoneNumber');

  useEffect(() => {
    if (error) {
      setToastMessage(error);
    }
  }, [error]);

  const onSubmitPhone = async (data: FormData) => {
    try {
      await login(data.phoneNumber);
      setStep('code');
    } catch (err) {
      console.error('Phone submission error:', err);
      setToastMessage('Failed to send verification code. Please try again.');
    }
  };

  const onSubmitCode = async (data: FormData) => {
    try {
      await verifyCode(data.verificationCode);
    } catch (err) {
      console.error('Code verification error:', err);
      setToastMessage('Failed to verify code. Please try again.');
    }
  };

  return (
    <PhoneVerificationContainer>
      <Title>{step === 'phone' ? 'Enter Your Phone Number' : 'Enter Verification Code'}</Title>
      <Form onSubmit={handleSubmit(step === 'phone' ? onSubmitPhone : onSubmitCode)}>
        {step === 'phone' ? (
          <Input
            type="tel"
            placeholder="Phone Number"
            {...register('phoneNumber', {
              required: 'Phone number is required',
              validate: validatePhoneNumber
            })}
            error={errors.phoneNumber?.message}
          />
        ) : (
          <Input
            type="text"
            placeholder="Verification Code"
            {...register('verificationCode', {
              required: 'Verification code is required',
              minLength: { value: 6, message: 'Code must be 6 digits' },
              maxLength: { value: 6, message: 'Code must be 6 digits' }
            })}
            error={errors.verificationCode?.message}
          />
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader size="small" /> : step === 'phone' ? 'Send Code' : 'Verify'}
        </Button>
      </Form>
      {step === 'code' && (
        <Button variant="text" onClick={() => setStep('phone')}>
          Change Phone Number
        </Button>
      )}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} type="error" />
      )}
    </PhoneVerificationContainer>
  );
};

export default PhoneVerification;