/**
 * @file AuthContext.tsx
 * @description This file defines the Authentication Context for the Pollen8 application,
 * providing a centralized way to manage and access authentication state throughout the React component tree.
 * 
 * Requirements addressed:
 * 1. User Authentication (Technical specification/1.1 System Objectives/Verified Connections)
 * 2. Session Management (Technical specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../shared/types/user';
import userService from '../../shared/api/userService';
import { useAuth } from '../hooks/useAuth';
import { handleApiError, handleAuthError } from '../utils/errorHandling';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Verify the stored user data with the backend
          const freshUserData = await userService.getUserProfile();
          setUser(freshUserData);
        }
      } catch (err) {
        handleAuthError(err as Error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phoneNumber: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await auth.login(phoneNumber);
    } catch (err) {
      handleAuthError(err as Error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await auth.verifyCode(code);
      const userData = await userService.getUserProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      handleAuthError(err as Error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await auth.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      handleAuthError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    verifyCode,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;