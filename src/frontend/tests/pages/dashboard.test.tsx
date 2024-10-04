import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import Dashboard from '../../pages/dashboard';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { NetworkDashboard } from '../../components/Network/NetworkDashboard';
import { ProfileCard } from '../../components/Profile/ProfileCard';
import { InviteGenerator } from '../../components/Invite/InviteGenerator';
import { InviteStats } from '../../components/Invite/InviteStats';

// Mock the hooks and components
jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useProfile');
jest.mock('../../components/Network/NetworkDashboard', () => ({
  __esModule: true,
  NetworkDashboard: jest.fn(() => <div data-testid="network-dashboard">Network Dashboard</div>),
}));
jest.mock('../../components/Profile/ProfileCard', () => ({
  __esModule: true,
  ProfileCard: jest.fn(() => <div data-testid="profile-card">Profile Card</div>),
}));
jest.mock('../../components/Invite/InviteGenerator', () => ({
  __esModule: true,
  InviteGenerator: jest.fn(() => <div data-testid="invite-generator">Invite Generator</div>),
}));
jest.mock('../../components/Invite/InviteStats', () => ({
  __esModule: true,
  InviteStats: jest.fn(() => <div data-testid="invite-stats">Invite Stats</div>),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock global functions
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
const mockRouter = { push: jest.fn() };

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { name: 'Test User' },
      isAuthenticated: true,
      loading: false,
    });
    mockUseProfile.mockReturnValue({
      profile: { id: '1', name: 'Test User', email: 'test@example.com' },
      fetchProfile: jest.fn().mockResolvedValue({}),
    });
  });

  test('renders correctly for authenticated user', async () => {
    render(<Dashboard />);

    // Wait for the component to fully render
    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });

    // Check if all expected components are rendered
    expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    expect(screen.getByTestId('network-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('invite-generator')).toBeInTheDocument();
    expect(screen.getByTestId('invite-stats')).toBeInTheDocument();

    // Verify that fetchProfile was called
    expect(mockUseProfile().fetchProfile).toHaveBeenCalled();
  });

  test('redirects to login page for unauthenticated user', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });

    // Verify that the dashboard content is not rendered
    expect(screen.queryByText('Welcome, Test User')).not.toBeInTheDocument();
    expect(screen.queryByTestId('profile-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('network-dashboard')).not.toBeInTheDocument();
  });

  test('displays loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
    });

    render(<Dashboard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when profile fetch fails', async () => {
    const mockFetchProfile = jest.fn().mockRejectedValue(new Error('Failed to fetch profile'));
    mockUseProfile.mockReturnValue({
      profile: null,
      fetchProfile: mockFetchProfile,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch profile data')).toBeInTheDocument();
    });
  });

  // Additional tests can be added here to cover more scenarios and interactions
});