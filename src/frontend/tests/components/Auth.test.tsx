import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ThemeProvider } from 'styled-components';
import PhoneVerification from '../../components/Auth/PhoneVerification';
import OnboardingForm from '../../components/Auth/OnboardingForm';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../styles/theme';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the shared components
jest.mock('../../shared/components/IndustrySelector', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="industry-selector">Industry Selector</div>),
}));

jest.mock('../../shared/components/InterestSelector', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="interest-selector">Interest Selector</div>),
}));

const mockUseAuth = () => ({
  login: jest.fn(),
  verifyCode: jest.fn(),
  isLoading: false,
  error: null,
  isAuthenticated: false,
  user: null,
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );
};

describe('PhoneVerification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockImplementation(mockUseAuth);
  });

  it('renders phone number input initially', () => {
    renderWithProviders(<PhoneVerification />);
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Send Code')).toBeInTheDocument();
  });

  it('submits phone number and shows verification code input', async () => {
    const { login } = mockUseAuth();
    (useAuth as jest.Mock).mockReturnValue({ login, isLoading: false, error: null });

    renderWithProviders(<PhoneVerification />);

    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '+1234567890' } });
    fireEvent.click(screen.getByText('Send Code'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('+1234567890');
      expect(screen.getByPlaceholderText('Verification Code')).toBeInTheDocument();
    });
  });

  it('shows error message on invalid phone number', async () => {
    renderWithProviders(<PhoneVerification />);

    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByText('Send Code'));

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    });
  });

  it('submits verification code', async () => {
    const { verifyCode } = mockUseAuth();
    (useAuth as jest.Mock).mockReturnValue({ verifyCode, isLoading: false, error: null });

    renderWithProviders(<PhoneVerification />);

    // Move to verification code step
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '+1234567890' } });
    fireEvent.click(screen.getByText('Send Code'));

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Verification Code'), { target: { value: '123456' } });
      fireEvent.click(screen.getByText('Verify'));
    });

    await waitFor(() => {
      expect(verifyCode).toHaveBeenCalledWith('123456');
    });
  });
});

describe('OnboardingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockImplementation(() => ({
      user: { id: '1', phoneNumber: '+1234567890' },
      isLoading: false,
      error: null,
      isAuthenticated: true,
    }));
  });

  it('renders all form fields', () => {
    renderWithProviders(<OnboardingForm />);
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByTestId('industry-selector')).toBeInTheDocument();
    expect(screen.getByTestId('interest-selector')).toBeInTheDocument();
    expect(screen.getByText('Complete Onboarding')).toBeInTheDocument();
  });

  it('shows error messages for required fields', async () => {
    renderWithProviders(<OnboardingForm />);

    fireEvent.click(screen.getByText('Complete Onboarding'));

    await waitFor(() => {
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('ZIP Code is required')).toBeInTheDocument();
      expect(screen.getByText('Please select at least 3 industries')).toBeInTheDocument();
      expect(screen.getByText('Please select at least 3 interests')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    renderWithProviders(<OnboardingForm />);

    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByPlaceholderText('ZIP Code'), { target: { value: '10001' } });

    // Mock the selection of industries and interests
    const industrySelector = screen.getByTestId('industry-selector');
    const interestSelector = screen.getByTestId('interest-selector');

    fireEvent.change(industrySelector, { target: { value: ['industry1', 'industry2', 'industry3'] } });
    fireEvent.change(interestSelector, { target: { value: ['interest1', 'interest2', 'interest3'] } });

    fireEvent.click(screen.getByText('Complete Onboarding'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});