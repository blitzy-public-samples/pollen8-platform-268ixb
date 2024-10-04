/**
 * @file useAuth.ts
 * @description Custom React hook for managing authentication state and operations in the Pollen8 application.
 * @requirements_addressed
 * - User Authentication (Technical specification/1.1 System Objectives/Verified Connections)
 * - Phone Verification (Technical specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */

import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { User } from '../../shared/types/user';
import { apiClient, setAuthToken, clearAuthToken } from '../../shared/api/apiClient';
import userService from '../../shared/api/userService';
import { AuthContext } from '../context/AuthContext';

interface AuthHook {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): AuthHook => {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token and fetch user data if it exists
    const token = localStorage.getItem('authToken');
    if (token && !user) {
      setAuthToken(token);
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getUserProfile();
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/verify', { phoneNumber });
      setVerificationId(response.data.verificationId);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initiate login process');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/confirm', { verificationId, code });
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      setUser(userData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    clearAuthToken();
    setUser(null);
    router.push('/');
  }, [router, setUser]);

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    verifyCode,
    logout,
  };
};

export default useAuth;