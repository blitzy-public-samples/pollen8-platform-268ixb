import axios from 'axios';
import * as analytics from '../../utils/analytics';
import { User } from '../../../shared/types/user';
import { Connection } from '../../../shared/types/connection';
import { Invite } from '../../../shared/types/invite';
import { NETWORK_VALUE_PER_CONNECTION } from '../../../shared/constants/networkValues';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock console methods
console.log = jest.fn();
console.error = jest.fn();

describe('trackPageView', () => {
  it('should call sendAnalyticsData with correct page view data', async () => {
    const pageName = 'Home';
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackPageView(pageName);

    expect(spy).toHaveBeenCalledWith({
      userId: 'anonymous',
      eventType: 'PAGE_VIEW',
      eventData: { pageName },
      timestamp: expect.any(Number),
    });
  });

  it('should handle errors gracefully', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));
    const pageName = 'Error Page';

    await analytics.trackPageView(pageName);

    expect(console.error).toHaveBeenCalledWith('Error sending analytics data:', expect.any(Error));
  });
});

describe('trackNetworkGrowth', () => {
  const mockUser: User = {
    id: 'user123',
    phone_number: '+1234567890',
    industries: ['Tech', 'Finance'],
    interests: ['AI', 'Blockchain'],
    city: 'New York',
    zip_code: '10001',
    created_at: new Date(),
    last_login: new Date(),
  };

  it('should calculate and send correct network growth data', async () => {
    const newConnections = 5;
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackNetworkGrowth(mockUser, newConnections);

    expect(spy).toHaveBeenCalledWith({
      userId: mockUser.id,
      eventType: 'NETWORK_GROWTH',
      eventData: {
        newConnections,
        totalConnections: mockUser.industries.length + newConnections,
        networkValue: (mockUser.industries.length + newConnections) * NETWORK_VALUE_PER_CONNECTION,
      },
      timestamp: expect.any(Number),
    });
  });

  it('should handle zero new connections', async () => {
    const newConnections = 0;
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackNetworkGrowth(mockUser, newConnections);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      eventData: expect.objectContaining({
        newConnections: 0,
        totalConnections: mockUser.industries.length,
      }),
    }));
  });

  it('should handle errors during data sending', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));
    const newConnections = 3;

    await analytics.trackNetworkGrowth(mockUser, newConnections);

    expect(console.error).toHaveBeenCalledWith('Error sending analytics data:', expect.any(Error));
  });
});

describe('trackInviteClick', () => {
  const mockInvite: Invite = {
    id: 'invite123',
    userId: 'user123',
    name: 'Test Invite',
    url: 'https://pollen8.com/invite/123',
    clickCount: 5,
    created_at: new Date(),
  };

  it('should send correct invite click data', async () => {
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackInviteClick(mockInvite);

    expect(spy).toHaveBeenCalledWith({
      userId: mockInvite.userId,
      eventType: 'INVITE_CLICK',
      eventData: { inviteId: mockInvite.id, clickCount: mockInvite.clickCount + 1 },
      timestamp: expect.any(Number),
    });
  });

  it('should increment invite click count', async () => {
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackInviteClick(mockInvite);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      eventData: expect.objectContaining({
        clickCount: mockInvite.clickCount + 1,
      }),
    }));
  });

  it('should handle errors during tracking', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));

    await analytics.trackInviteClick(mockInvite);

    expect(console.error).toHaveBeenCalledWith('Error sending analytics data:', expect.any(Error));
  });
});

describe('calculateNetworkAnalytics', () => {
  const mockUser: User = {
    id: 'user123',
    phone_number: '+1234567890',
    industries: ['Tech', 'Finance'],
    interests: ['AI', 'Blockchain'],
    city: 'New York',
    zip_code: '10001',
    created_at: new Date(),
    last_login: new Date(),
  };

  const mockConnections: Connection[] = [
    { id: 'conn1', userId: 'user123', connectedUserId: 'user456', industries: ['Tech'], connected_at: new Date() },
    { id: 'conn2', userId: 'user123', connectedUserId: 'user789', industries: ['Finance'], connected_at: new Date() },
    { id: 'conn3', userId: 'user123', connectedUserId: 'user101', industries: ['Tech'], connected_at: new Date() },
  ];

  it('should calculate correct network analytics', () => {
    const result = analytics.calculateNetworkAnalytics(mockUser, mockConnections);

    expect(result).toEqual({
      totalConnections: 3,
      networkValue: 3 * NETWORK_VALUE_PER_CONNECTION,
      industryDistribution: { Tech: 2, Finance: 1 },
      growthRate: expect.any(Number),
    });
  });

  it('should handle empty connections array', () => {
    const result = analytics.calculateNetworkAnalytics(mockUser, []);

    expect(result).toEqual({
      totalConnections: 0,
      networkValue: 0,
      industryDistribution: {},
      growthRate: 0,
    });
  });

  it('should calculate correct industry distribution', () => {
    const result = analytics.calculateNetworkAnalytics(mockUser, mockConnections);

    expect(result.industryDistribution).toEqual({ Tech: 2, Finance: 1 });
  });
});

describe('trackUserEngagement', () => {
  const mockUser: User = {
    id: 'user123',
    phone_number: '+1234567890',
    industries: ['Tech'],
    interests: ['AI'],
    city: 'San Francisco',
    zip_code: '94105',
    created_at: new Date(),
    last_login: new Date(),
  };

  it('should send correct user engagement data', async () => {
    const action = 'PROFILE_UPDATE';
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    analytics.trackUserEngagement(mockUser, action);

    expect(spy).toHaveBeenCalledWith({
      userId: mockUser.id,
      eventType: 'USER_ENGAGEMENT',
      eventData: { action },
      timestamp: expect.any(Number),
    });
  });

  it('should handle different types of engagement actions', async () => {
    const actions = ['PROFILE_VIEW', 'CONNECTION_REQUEST', 'INVITE_SENT'];
    const spy = jest.spyOn(analytics, 'sendAnalyticsData');

    actions.forEach(action => {
      analytics.trackUserEngagement(mockUser, action);
    });

    actions.forEach(action => {
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        eventData: { action },
      }));
    });
  });

  it('should handle errors during tracking', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));
    const action = 'ERROR_ACTION';

    await analytics.trackUserEngagement(mockUser, action);

    expect(console.error).toHaveBeenCalledWith('Error sending analytics data:', expect.any(Error));
  });
});

describe('sendAnalyticsData', () => {
  const mockAnalyticsData = {
    userId: 'user123',
    eventType: 'TEST_EVENT',
    eventData: { test: 'data' },
    timestamp: Date.now(),
  };

  it('should send data to the correct API endpoint', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: 'success' });

    await analytics.sendAnalyticsData(mockAnalyticsData);

    expect(mockAxios.post).toHaveBeenCalledWith('/api/analytics', mockAnalyticsData);
  });

  it('should handle successful API response', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: 'success' });

    await analytics.sendAnalyticsData(mockAnalyticsData);

    expect(console.log).toHaveBeenCalledWith('Analytics data sent successfully');
  });

  it('should handle API errors', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('API error'));

    await analytics.sendAnalyticsData(mockAnalyticsData);

    expect(console.error).toHaveBeenCalledWith('Error sending analytics data:', expect.any(Error));
  });

  it('should retry on network failures', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'))
               .mockResolvedValueOnce({ data: 'success' });

    await analytics.sendAnalyticsData(mockAnalyticsData);

    expect(mockAxios.post).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith('Analytics data sent successfully');
  });
});