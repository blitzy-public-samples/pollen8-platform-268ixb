import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import Button from '../UI/Button';
import Input from '../UI/Input';
import IndustrySelector from '../../shared/components/IndustrySelector';
import InterestSelector from '../../shared/components/InterestSelector';
import { User, UserProfile } from '../../shared/types/user';
import { Industry } from '../../shared/types/industry';
import { Interest } from '../../shared/types/interest';

/**
 * OnboardingForm component for collecting essential user information during the onboarding process.
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

const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.typography.h2.fontSize};
  font-weight: ${props => props.theme.typography.h2.fontWeight};
  color: ${props => props.theme.palette.text.primary};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.palette.error.main};
  font-size: 14px;
  margin-top: 0.5rem;
`;

interface OnboardingFormData extends UserProfile {
  industries: Industry[];
  interests: Interest[];
}

const OnboardingForm: React.FC = () => {
  const { user, isLoading, error: authError, isAuthenticated } = useAuth();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<OnboardingFormData>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const watchedIndustries = watch('industries', []);
  const watchedInterests = watch('interests', []);

  useEffect(() => {
    if (isAuthenticated && user?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setSubmitError(null);
      // TODO: Implement API call to update user profile
      console.log('Submitting onboarding data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting onboarding form:', error);
      setSubmitError('Failed to complete onboarding. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Complete Your Profile</FormTitle>

      <FormSection>
        <Controller
          name="city"
          control={control}
          rules={{ required: 'City is required' }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="City"
              {...field}
              error={errors.city?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Controller
          name="zipCode"
          control={control}
          rules={{ required: 'ZIP Code is required', pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP Code' } }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="ZIP Code"
              {...field}
              error={errors.zipCode?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Controller
          name="industries"
          control={control}
          rules={{ 
            validate: value => value.length >= 3 || 'Please select at least 3 industries'
          }}
          render={({ field }) => (
            <IndustrySelector
              selectedIndustries={field.value}
              onChange={field.onChange}
              error={errors.industries?.message}
            />
          )}
        />
        {watchedIndustries.length < 3 && (
          <ErrorMessage>Please select at least {3 - watchedIndustries.length} more industries</ErrorMessage>
        )}
      </FormSection>

      <FormSection>
        <Controller
          name="interests"
          control={control}
          rules={{ 
            validate: value => value.length >= 3 || 'Please select at least 3 interests'
          }}
          render={({ field }) => (
            <InterestSelector
              selectedInterests={field.value}
              onChange={field.onChange}
              error={errors.interests?.message}
            />
          )}
        />
        {watchedInterests.length < 3 && (
          <ErrorMessage>Please select at least {3 - watchedInterests.length} more interests</ErrorMessage>
        )}
      </FormSection>

      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        isLoading={isLoading}
        disabled={watchedIndustries.length < 3 || watchedInterests.length < 3}
      >
        Complete Onboarding
      </Button>
    </FormContainer>
  );
};

export default OnboardingForm;