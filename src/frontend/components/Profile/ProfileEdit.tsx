import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { User } from '../../shared/types/user';
import IndustrySelector from '../../shared/components/IndustrySelector';
import InterestSelector from '../../shared/components/InterestSelector';
import { useProfile } from '../../hooks/useProfile';
import { validateProfile } from '../../shared/utils/validation';

/**
 * This file contains a React component that allows users to edit their profile information
 * on the Pollen8 platform, adhering to the minimalist black and white design aesthetic.
 *
 * Requirements addressed:
 * 1. User Profile Creation
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Allow users to create and edit their profile
 * 
 * 2. Industry Selection
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Enable selection of minimum 3 industries
 * 
 * 3. Interest Selection
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Enable selection of minimum 3 interests
 * 
 * 4. Location-based Profile
 *    Location: Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 *    Description: Include location information in profile
 * 
 * 5. Visual Design
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implement black and white minimalist aesthetic
 */

interface ProfileEditProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const ProfileEditContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.palette.text.primary};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.palette.error.main};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({
    defaultValues: user,
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(user.industries || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);
  const [industryError, setIndustryError] = useState<string | null>(null);
  const [interestError, setInterestError] = useState<string | null>(null);
  const { updateProfile } = useProfile();

  useEffect(() => {
    if (selectedIndustries.length < 3) {
      setIndustryError('Please select at least 3 industries');
    } else {
      setIndustryError(null);
    }
  }, [selectedIndustries]);

  useEffect(() => {
    if (selectedInterests.length < 3) {
      setInterestError('Please select at least 3 interests');
    } else {
      setInterestError(null);
    }
  }, [selectedInterests]);

  const handleIndustryChange = (industries: string[]) => {
    setSelectedIndustries(industries);
  };

  const handleInterestChange = (interests: string[]) => {
    setSelectedInterests(interests);
  };

  const onSubmit = async (data: User) => {
    const updatedUser = {
      ...data,
      industries: selectedIndustries,
      interests: selectedInterests,
    };

    const validationErrors = validateProfile(updatedUser);
    if (validationErrors) {
      // Handle validation errors
      console.error('Profile validation failed:', validationErrors);
      return;
    }

    try {
      await updateProfile(updatedUser);
      onSave(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <ProfileEditContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="Enter your name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            type="text"
            placeholder="Enter your ZIP code"
            {...register('zipCode', {
              required: 'ZIP code is required',
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Invalid ZIP code',
              },
            })}
            error={errors.zipCode?.message}
          />
        </FormGroup>

        <FormGroup>
          <Label>Industries</Label>
          <IndustrySelector
            selectedIndustries={selectedIndustries}
            onChange={handleIndustryChange}
          />
          {industryError && <ErrorMessage>{industryError}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Interests</Label>
          <InterestSelector
            selectedInterests={selectedInterests}
            onChange={handleInterestChange}
          />
          {interestError && <ErrorMessage>{interestError}</ErrorMessage>}
        </FormGroup>

        <ButtonGroup>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!!industryError || !!interestError}
          >
            Save Changes
          </Button>
        </ButtonGroup>
      </form>
    </ProfileEditContainer>
  );
};

export default ProfileEdit;