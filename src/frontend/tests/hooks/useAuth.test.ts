/**
 * @file useAuth.test.ts
 * @description Unit tests for the useAuth custom hook, which manages authentication state and operations in the Pollen8 application.
 * @requirements_addressed
 * - User Authentication Testing (Technical specification/1.1 System Objectives/Verified Connections)
 * - Phone Verification Testing (Technical specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../../shared/types/user';
import userService from '../../../shared/api/userService';
import { AuthContext } from '../../context/AuthContext';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../shared/api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
}));

jest.mock('../../../shared/api/userService', () => ({
  getUserProfile: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth hook', () => {
  const mockUser: User = {
    id: '1',
    phoneNumber: '+1234567890',
    city: 'New York',
    zipCode: '10001',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with null user and not authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch user data if auth token exists', async () => {
    localStorageMock.setItem('authToken', 'mockToken');
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUser);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await waitForNextUpdate();

    expect(userService.getUserProfile).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login process', async () => {
    const mockVerificationId = 'mockVerificationId';
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUser);
    (window as any).apiClient.post.mockResolvedValueOnce({ data: { verificationId: mockVerificationId } });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await act(async () => {
      await result.current.login('+1234567890');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(window.apiClient.post).toHaveBeenCalledWith('/auth/verify', { phoneNumber: '+1234567890' });
  });

  it('should handle verification process', async () => {
    const mockToken = 'mockToken';
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUser);
    (window as any).apiClient.post.mockResolvedValueOnce({ data: { token: mockToken, user: mockUser } });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await act(async () => {
      await result.current.verifyCode('123456');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(window.apiClient.post).toHaveBeenCalledWith('/auth/confirm', { verificationId: null, code: '123456' });
    expect(localStorageMock.getItem('authToken')).toBe(mockToken);
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.getItem('authToken')).toBeNull();
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it('should handle login error', async () => {
    (window as any).apiClient.post.mockRejectedValueOnce(new Error('Login failed'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await act(async () => {
      await result.current.login('+1234567890');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to initiate login process');
  });

  it('should handle verification error', async () => {
    (window as any).apiClient.post.mockRejectedValueOnce(new Error('Verification failed'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await act(async () => {
      await result.current.verifyCode('123456');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to verify code');
  });
});