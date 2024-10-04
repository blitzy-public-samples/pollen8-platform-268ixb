import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { InviteGenerator } from '@/components/Invite/InviteGenerator';
import { InviteStats } from '@/components/Invite/InviteStats';
import { useInvite } from '@/hooks/useInvite';

// Mock the useInvite hook
jest.mock('@/hooks/useInvite');

// Mock the shared components and utilities
jest.mock('@/shared/components/InviteLink', () => ({
  InviteLink: ({ inviteUrl }: { inviteUrl: string }) => <div data-testid="invite-link">{inviteUrl}</div>,
}));
jest.mock('@/shared/utils/validation', () => ({
  validateInviteName: jest.fn((name) => name.length > 0),
}));
jest.mock('@/shared/api/inviteService', () => ({
  createInvite: jest.fn(),
  deleteInvite: jest.fn(),
}));

describe('InviteGenerator Component', () => {
  const mockUserId = 'user123';

  beforeEach(() => {
    (useInvite as jest.Mock).mockReturnValue({
      createInvite: jest.fn().mockResolvedValue({ url: 'https://pollen8.com/invite/abc123' }),
      deleteInvite: jest.fn().mockResolvedValue({}),
      analytics: { totalClicks: 10, dailyClicks: [] },
      loading: false,
      error: null,
    });
  });

  test('renders the component', () => {
    render(<InviteGenerator userId={mockUserId} />);
    expect(screen.getByText('Generate Invite Link')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter invite name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Invite' })).toBeInTheDocument();
  });

  test('handles invite name input', () => {
    render(<InviteGenerator userId={mockUserId} />);
    const input = screen.getByPlaceholderText('Enter invite name');
    fireEvent.change(input, { target: { value: 'Test Invite' } });
    expect(input).toHaveValue('Test Invite');
  });

  test('generates invite link on form submission', async () => {
    render(<InviteGenerator userId={mockUserId} />);
    const input = screen.getByPlaceholderText('Enter invite name');
    const submitButton = screen.getByRole('button', { name: 'Generate Invite' });

    fireEvent.change(input, { target: { value: 'Test Invite' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('invite-link')).toHaveTextContent('https://pollen8.com/invite/abc123');
    });
  });

  test('displays error message for invalid input', async () => {
    (useInvite as jest.Mock).mockReturnValue({
      ...useInvite(),
      createInvite: jest.fn().mockRejectedValue(new Error('Invalid invite name')),
    });

    render(<InviteGenerator userId={mockUserId} />);
    const input = screen.getByPlaceholderText('Enter invite name');
    const submitButton = screen.getByRole('button', { name: 'Generate Invite' });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to generate invite link. Please try again.')).toBeInTheDocument();
    });
  });

  test('handles successful invite creation', async () => {
    render(<InviteGenerator userId={mockUserId} />);
    const input = screen.getByPlaceholderText('Enter invite name');
    const submitButton = screen.getByRole('button', { name: 'Generate Invite' });

    fireEvent.change(input, { target: { value: 'Valid Invite' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invite link generated successfully!')).toBeInTheDocument();
    });
  });

  test('displays generated invite link', async () => {
    render(<InviteGenerator userId={mockUserId} />);
    const input = screen.getByPlaceholderText('Enter invite name');
    const submitButton = screen.getByRole('button', { name: 'Generate Invite' });

    fireEvent.change(input, { target: { value: 'Test Invite' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('invite-link')).toBeInTheDocument();
    });
  });
});

describe('InviteStats Component', () => {
  const mockInviteId = 'invite123';

  beforeEach(() => {
    (useInvite as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      invite: {
        id: mockInviteId,
        url: `https://pollen8.com/invite/${mockInviteId}`,
        createdAt: '2023-05-01T00:00:00Z',
        totalClicks: 150,
      },
      analytics: {
        dailyClicks: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          clicks: Math.floor(Math.random() * 20),
        })),
      },
      fetchInviteData: jest.fn(),
    });
  });

  test('renders the component', () => {
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByText('Invite Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Clicks: 150')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Invite URL:/)).toBeInTheDocument();
  });

  test('displays loading state', () => {
    (useInvite as jest.Mock).mockReturnValue({
      ...useInvite(),
      loading: true,
    });
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('displays error state', () => {
    (useInvite as jest.Mock).mockReturnValue({
      ...useInvite(),
      error: 'Failed to fetch invite data',
      invite: null,
      analytics: null,
    });
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByText('Failed to fetch invite data')).toBeInTheDocument();
  });

  test('renders invite statistics', () => {
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByText('Total Clicks: 150')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(`https://pollen8.com/invite/${mockInviteId}`)).toBeInTheDocument();
  });

  test('renders chart with mock data', () => {
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByRole('img')).toBeInTheDocument(); // Assuming recharts renders an img role
  });

  test('handles missing analytics data', () => {
    (useInvite as jest.Mock).mockReturnValue({
      ...useInvite(),
      analytics: null,
    });
    render(<InviteStats inviteId={mockInviteId} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});