import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { User } from '../../../shared/types/user';
import ProfileCard from '../../components/Profile/ProfileCard';
import ProfileEdit from '../../components/Profile/ProfileEdit';
import useProfile from '../../hooks/useProfile';
import theme from '../../styles/theme';

// Mock the useProfile hook
jest.mock('../../hooks/useProfile');

// Mock user data
const mockUser: User = {
  id: '1',
  phoneNumber: '+1234567890',
  name: 'John Doe',
  email: 'john@example.com',
  city: 'New York',
  zipCode: '10001',
  industries: [{ id: '1', name: 'Technology' }, { id: '2', name: 'Finance' }, { id: '3', name: 'Healthcare' }],
  interests: [{ id: '1', name: 'Coding' }, { id: '2', name: 'Investing' }, { id: '3', name: 'Fitness' }],
};

// Helper function to render components with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ProfileCard Component', () => {
  beforeEach(() => {
    (useProfile as jest.Mock).mockReturnValue({
      updateProfile: jest.fn(),
    });
  });

  it('renders user profile information correctly', () => {
    renderWithTheme(<ProfileCard user={mockUser} />);

    expect(screen.getByText(mockUser.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.city}, ${mockUser.zipCode}`)).toBeInTheDocument();
    
    mockUser.industries.forEach(industry => {
      expect(screen.getByText(industry.name)).toBeInTheDocument();
    });

    mockUser.interests.forEach(interest => {
      expect(screen.getByText(interest.name)).toBeInTheDocument();
    });
  });

  it('calls handleEditProfile when Edit Profile button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    renderWithTheme(<ProfileCard user={mockUser} />);

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    expect(consoleSpy).toHaveBeenCalledWith('Edit profile clicked');
    consoleSpy.mockRestore();
  });
});

describe('ProfileEdit Component', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockUpdateProfile = jest.fn();

  beforeEach(() => {
    (useProfile as jest.Mock).mockReturnValue({
      updateProfile: mockUpdateProfile,
    });
  });

  it('renders the form with user data', () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.zipCode)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates ZIP code format', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const zipCodeInput = screen.getByPlaceholderText('Enter your ZIP code');
    fireEvent.change(zipCodeInput, { target: { value: 'invalid-zip' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid ZIP code')).toBeInTheDocument();
    });
  });

  it('calls onSave with updated user data when form is submitted', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Doe',
      }));
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('calls onCancel when Cancel button is clicked', () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables Save Changes button when less than 3 industries are selected', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Assuming IndustrySelector component has a way to remove industries
    const industryRemoveButtons = screen.getAllByText('Remove Industry');
    fireEvent.click(industryRemoveButtons[0]);
    fireEvent.click(industryRemoveButtons[1]);

    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Please select at least 3 industries')).toBeInTheDocument();
    });
  });

  it('disables Save Changes button when less than 3 interests are selected', async () => {
    renderWithTheme(<ProfileEdit user={mockUser} onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Assuming InterestSelector component has a way to remove interests
    const interestRemoveButtons = screen.getAllByText('Remove Interest');
    fireEvent.click(interestRemoveButtons[0]);
    fireEvent.click(interestRemoveButtons[1]);

    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Please select at least 3 interests')).toBeInTheDocument();
    });
  });
});