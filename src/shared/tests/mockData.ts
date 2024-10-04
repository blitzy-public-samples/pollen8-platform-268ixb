/**
 * This file contains mock data for testing purposes in the Pollen8 platform,
 * providing predefined datasets for users, connections, invites, industries, and interests.
 * 
 * Requirements addressed:
 * 1. Test Data (Technical Specification/3. SYSTEM DESIGN/3.3 API DESIGN)
 * 2. Data Structure Compliance (Technical Specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS)
 */

import { User, UserId, PhoneNumber } from '../types/user';
import { Connection } from '../types/connection';
import { Invite } from '../types/invite';
import { Industry } from '../types/industry';
import { Interest } from '../types/interest';

// Mock Industries
export const mockIndustries: Industry[] = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Healthcare' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Education' },
  { id: '5', name: 'Entertainment' },
];

// Mock Interests
export const mockInterests: Interest[] = [
  { id: '1', name: 'Artificial Intelligence' },
  { id: '2', name: 'Blockchain' },
  { id: '3', name: 'Renewable Energy' },
  { id: '4', name: 'Space Exploration' },
  { id: '5', name: 'Biotechnology' },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1' as UserId,
    phoneNumber: '+11234567890' as PhoneNumber,
    industries: [mockIndustries[0], mockIndustries[2]],
    interests: [mockInterests[0], mockInterests[1], mockInterests[2]],
    city: 'New York',
    zipCode: '10001',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-06-01'),
  },
  {
    id: '2' as UserId,
    phoneNumber: '+19876543210' as PhoneNumber,
    industries: [mockIndustries[1], mockIndustries[3]],
    interests: [mockInterests[2], mockInterests[3], mockInterests[4]],
    city: 'San Francisco',
    zipCode: '94105',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2023-06-02'),
  },
];

// Mock Connections
export const mockConnections: Connection[] = [
  {
    id: '1',
    userId: '1' as UserId,
    connectedUserId: '2' as UserId,
    connectionValue: 3.14,
    connectedAt: new Date('2023-03-01'),
    industries: ['Technology', 'Healthcare'],
  },
];

// Mock Invites
export const mockInvites: Invite[] = [
  {
    id: '1',
    userId: '1' as UserId,
    name: 'Tech Conference Invite',
    url: 'https://pollen8.com/invite/abc123',
    clickCount: 15,
    createdAt: new Date('2023-04-01'),
  },
];

/**
 * Generates a mock user object with default values, allowing for custom overrides.
 * @param overrides - Partial User object to override default values
 * @returns A mock user object
 */
export function generateMockUser(overrides: Partial<User> = {}): User {
  const defaultUser: User = {
    id: `${Math.random().toString(36).substr(2, 9)}` as UserId,
    phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}` as PhoneNumber,
    industries: [mockIndustries[0], mockIndustries[1], mockIndustries[2]],
    interests: [mockInterests[0], mockInterests[1], mockInterests[2]],
    city: 'Mock City',
    zipCode: '12345',
    createdAt: new Date(),
    lastLogin: new Date(),
  };

  return { ...defaultUser, ...overrides };
}

/**
 * Generates a mock connection object with default values, allowing for custom overrides.
 * @param overrides - Partial Connection object to override default values
 * @returns A mock connection object
 */
export function generateMockConnection(overrides: Partial<Connection> = {}): Connection {
  const defaultConnection: Connection = {
    id: `${Math.random().toString(36).substr(2, 9)}`,
    userId: `${Math.random().toString(36).substr(2, 9)}` as UserId,
    connectedUserId: `${Math.random().toString(36).substr(2, 9)}` as UserId,
    connectionValue: 3.14,
    connectedAt: new Date(),
    industries: [mockIndustries[0].name, mockIndustries[1].name],
  };

  return { ...defaultConnection, ...overrides };
}

/**
 * Generates a mock invite object with default values, allowing for custom overrides.
 * @param overrides - Partial Invite object to override default values
 * @returns A mock invite object
 */
export function generateMockInvite(overrides: Partial<Invite> = {}): Invite {
  const defaultInvite: Invite = {
    id: `${Math.random().toString(36).substr(2, 9)}`,
    userId: `${Math.random().toString(36).substr(2, 9)}` as UserId,
    name: 'Mock Invite',
    url: `https://pollen8.com/invite/${Math.random().toString(36).substr(2, 9)}`,
    clickCount: Math.floor(Math.random() * 100),
    createdAt: new Date(),
  };

  return { ...defaultInvite, ...overrides };
}