/**
 * @file useProfile.ts
 * @description Custom React hook for managing user profile data and operations in the Pollen8 application.
 * @requirements_addressed
 * - User Profile Management (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Industry Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Interest Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Location Data (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { User, UserProfile } from '../../shared/types/user';
import userService from '../../shared/api/userService';

interface ProfileHook {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  updateIndustries: (industries: string[]) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
}

export const useProfile = (): ProfileHook => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile(user.profile);
    }
  }, [user]);

  const updateProfile = useCallback(async (updatedProfile: Partial<UserProfile>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Client-side validation
      if (updatedProfile.zipCode && !/^\d{5}(-\d{4})?$/.test(updatedProfile.zipCode)) {
        throw new Error('Invalid ZIP code format');
      }

      const updatedUser = await userService.updateUserProfile({
        ...profile,
        ...updatedProfile,
      } as UserProfile);

      setProfile(updatedUser.profile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const updateIndustries = useCallback(async (industries: string[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure minimum required selections
      if (industries.length < 3) {
        throw new Error('Please select at least 3 industries');
      }

      const updatedUser = await userService.updateUserIndustries(industries);
      setProfile(updatedUser.profile);
    } catch (err) {
      console.error('Error updating industries:', err);
      setError('Failed to update industries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInterests = useCallback(async (interests: string[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure minimum required selections
      if (interests.length < 3) {
        throw new Error('Please select at least 3 interests');
      }

      const updatedUser = await userService.updateUserInterests(interests);
      setProfile(updatedUser.profile);
    } catch (err) {
      console.error('Error updating interests:', err);
      setError('Failed to update interests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updateIndustries,
    updateInterests,
  };
};

export default useProfile;