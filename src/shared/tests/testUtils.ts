/**
 * This file contains utility functions and setup code for testing shared components and utilities across the Pollen8 platform.
 * 
 * Requirements addressed:
 * - Test Utilities (Technical Specification/3. SYSTEM DESIGN/3.3 API DESIGN)
 */

import { User, UserId, PhoneNumber } from '../types/user';
import { Connection } from '../types/connection';
import { Invite, InviteId } from '../types/invite';
import { networkCalculations } from '../utils';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedFunction } from 'jest-mock';

/**
 * Creates a mock user object for testing purposes.
 * It generates default values for all User properties and allows overriding specific properties.
 * 
 * @param overrides - Partial User object to override default values
 * @returns A mock user object
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  const defaultUser: User = {
    id: 'user-123' as UserId,
    phoneNumber: '+1234567890' as PhoneNumber,
    industries: [{ id: 'ind-1', name: 'Technology' }, { id: 'ind-2', name: 'Finance' }, { id: 'ind-3', name: 'Healthcare' }],
    interests: [{ id: 'int-1', name: 'AI' }, { id: 'int-2', name: 'Blockchain' }, { id: 'int-3', name: 'IoT' }],
    city: 'New York',
    zipCode: '10001',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    lastLogin: new Date('2023-06-01T12:00:00Z'),
  };

  return { ...defaultUser, ...overrides };
}

/**
 * Creates a mock connection object for testing purposes.
 * It generates default values for all Connection properties and allows overriding specific properties.
 * 
 * @param overrides - Partial Connection object to override default values
 * @returns A mock connection object
 */
export function createMockConnection(overrides: Partial<Connection> = {}): Connection {
  const defaultConnection: Connection = {
    id: 'conn-123',
    userId: 'user-123' as UserId,
    connectedUserId: 'user-456' as UserId,
    connectionValue: 3.14,
    connectedAt: new Date('2023-06-01T12:00:00Z'),
    industries: ['Technology', 'Finance'],
  };

  return { ...defaultConnection, ...overrides };
}

/**
 * Creates a mock invite object for testing purposes.
 * It generates default values for all Invite properties and allows overriding specific properties.
 * 
 * @param overrides - Partial Invite object to override default values
 * @returns A mock invite object
 */
export function createMockInvite(overrides: Partial<Invite> = {}): Invite {
  const defaultInvite: Invite = {
    id: 'invite-123' as InviteId,
    userId: 'user-123' as UserId,
    name: 'Test Invite',
    url: 'https://pollen8.com/invite/abc123',
    clickCount: 0,
    createdAt: new Date('2023-06-01T12:00:00Z'),
  };

  return { ...defaultInvite, ...overrides };
}

/**
 * A utility function that wraps the render function from @testing-library/react with necessary providers
 * (e.g., ThemeProvider, AuthProvider) for testing components that rely on context.
 * 
 * @param ui - The React component to render
 * @param options - Additional render options
 * @returns The result of rendering the component with providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Add necessary providers here, e.g.:
    // return (
    //   <ThemeProvider theme={theme}>
    //     <AuthProvider>
    //       {children}
    //     </AuthProvider>
    //   </ThemeProvider>
    // );
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Mocks the network calculation functions for consistent test results.
 * Returns an object with mocked network calculation functions.
 * 
 * @returns An object containing mocked network calculation functions
 */
export function mockNetworkCalculations(): typeof networkCalculations {
  const mockedCalculations: Record<string, MockedFunction<any>> = {};

  for (const [key, value] of Object.entries(networkCalculations)) {
    if (typeof value === 'function') {
      mockedCalculations[key] = jest.fn().mockImplementation(() => 3.14);
    }
  }

  return mockedCalculations as typeof networkCalculations;
}

// Export additional test utilities
export { userEvent };