/**
 * This file contains utility functions for handling analytics in the Pollen8 frontend application.
 * It provides methods to track user interactions, network growth, and other key metrics essential
 * for measuring the platform's performance and user engagement.
 *
 * Requirements addressed:
 * 1. Quantifiable Networking (1. Introduction/1.1 System Objectives)
 * 2. Strategic Growth Tools (1. Introduction/1.1 System Objectives)
 */

import axios from 'axios';
import { User } from '../../shared/types/user';
import { Connection } from '../../shared/types/connection';
import { Invite, InviteAnalytics } from '../../shared/types/invite';
import { NETWORK_VALUE_PER_CONNECTION } from '../../shared/constants/networkValues';
import { calculateNetworkValue } from '../../shared/utils/networkCalculations';

/**
 * Interface defining the structure of network analytics data.
 */
interface NetworkAnalytics {
  totalConnections: number;
  networkValue: number;
  industryDistribution: Record<string, number>;
  growthRate: number;
}

/**
 * Interface defining the structure of analytics data to be sent to the backend.
 */
interface AnalyticsData {
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: number;
}

/**
 * Tracks a page view event in the analytics system.
 * @param pageName The name of the page being viewed.
 */
export const trackPageView = (pageName: string): void => {
  console.log(`Tracking page view: ${pageName}`);
  sendAnalyticsData({
    userId: 'anonymous', // Replace with actual user ID if available
    eventType: 'PAGE_VIEW',
    eventData: { pageName },
    timestamp: Date.now(),
  });
};

/**
 * Tracks the growth of a user's network.
 * @param user The user whose network growth is being tracked.
 * @param newConnections The number of new connections added.
 */
export const trackNetworkGrowth = (user: User, newConnections: number): void => {
  const totalConnections = (user.industries.length || 0) + newConnections;
  const networkValue = calculateNetworkValue(totalConnections);

  console.log(`Tracking network growth for user ${user.id}: ${newConnections} new connections`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'NETWORK_GROWTH',
    eventData: { newConnections, totalConnections, networkValue },
    timestamp: Date.now(),
  });
};

/**
 * Tracks when an invite link is clicked.
 * @param invite The invite object that was clicked.
 */
export const trackInviteClick = (invite: Invite): void => {
  console.log(`Tracking invite click: ${invite.id}`);
  sendAnalyticsData({
    userId: invite.userId,
    eventType: 'INVITE_CLICK',
    eventData: { inviteId: invite.id, clickCount: invite.clickCount + 1 },
    timestamp: Date.now(),
  });
};

/**
 * Calculates various network analytics for a user.
 * @param user The user for whom to calculate analytics.
 * @param connections The user's connections.
 * @returns An object containing calculated network analytics.
 */
export const calculateNetworkAnalytics = (user: User, connections: Connection[]): NetworkAnalytics => {
  const totalConnections = connections.length;
  const networkValue = calculateNetworkValue(totalConnections);

  // Calculate industry distribution
  const industryDistribution: Record<string, number> = {};
  connections.forEach((connection) => {
    connection.industries.forEach((industry) => {
      industryDistribution[industry] = (industryDistribution[industry] || 0) + 1;
    });
  });

  // Calculate growth rate (assuming we have historical data)
  // This is a placeholder calculation and should be replaced with actual historical data comparison
  const growthRate = totalConnections > 0 ? (newConnections / totalConnections) * 100 : 0;

  return {
    totalConnections,
    networkValue,
    industryDistribution,
    growthRate,
  };
};

/**
 * Tracks user engagement actions on the platform.
 * @param user The user performing the action.
 * @param action The engagement action being tracked.
 */
export const trackUserEngagement = (user: User, action: string): void => {
  console.log(`Tracking user engagement: ${user.id} performed ${action}`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'USER_ENGAGEMENT',
    eventData: { action },
    timestamp: Date.now(),
  });
};

/**
 * Sends collected analytics data to the backend API.
 * @param data The analytics data to be sent.
 * @returns A promise that resolves when the data is sent successfully.
 */
export const sendAnalyticsData = async (data: AnalyticsData): Promise<void> => {
  try {
    // Validate the input data
    if (!data.userId || !data.eventType || !data.eventData || !data.timestamp) {
      throw new Error('Invalid analytics data');
    }

    // Make an asynchronous API call to send the data
    await axios.post('/api/analytics', data);
    console.log('Analytics data sent successfully');
  } catch (error) {
    console.error('Error sending analytics data:', error);
    // Implement retry logic for failed requests
    // This is a simple exponential backoff retry mechanism
    await retryAnalyticsSend(data);
  }
};

/**
 * Retries sending analytics data with exponential backoff.
 * @param data The analytics data to be sent.
 * @param retryCount The current retry attempt (default: 0).
 */
const retryAnalyticsSend = async (data: AnalyticsData, retryCount: number = 0): Promise<void> => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  if (retryCount < maxRetries) {
    const delay = baseDelay * Math.pow(2, retryCount);
    console.log(`Retrying analytics send in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    try {
      await sendAnalyticsData(data);
    } catch (error) {
      await retryAnalyticsSend(data, retryCount + 1);
    }
  } else {
    console.error('Max retries reached for sending analytics data');
    // Here you might want to store the failed data locally for later retry
    // or send it to a separate error logging service
  }
};

/**
 * Calculates and tracks the invite conversion rate.
 * @param invite The invite object.
 * @param inviteAnalytics The analytics data for the invite.
 */
export const trackInviteConversion = (invite: Invite, inviteAnalytics: InviteAnalytics): void => {
  const conversionRate = invite.clickCount > 0 ? (inviteAnalytics.totalClicks / invite.clickCount) * 100 : 0;
  console.log(`Tracking invite conversion for invite ${invite.id}: ${conversionRate.toFixed(2)}%`);
  sendAnalyticsData({
    userId: invite.userId,
    eventType: 'INVITE_CONVERSION',
    eventData: { inviteId: invite.id, conversionRate },
    timestamp: Date.now(),
  });
};

/**
 * Tracks the industry-specific growth of a user's network.
 * @param user The user whose network growth is being tracked.
 * @param industry The industry in which growth occurred.
 * @param newConnections The number of new connections in the specified industry.
 */
export const trackIndustryGrowth = (user: User, industry: string, newConnections: number): void => {
  console.log(`Tracking industry growth for user ${user.id}: ${newConnections} new connections in ${industry}`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'INDUSTRY_GROWTH',
    eventData: { industry, newConnections },
    timestamp: Date.now(),
  });
};

/**
 * Tracks the user's activity streak (consecutive days of platform usage).
 * @param user The user whose activity streak is being tracked.
 * @param currentStreak The current number of consecutive days of activity.
 */
export const trackActivityStreak = (user: User, currentStreak: number): void => {
  console.log(`Tracking activity streak for user ${user.id}: ${currentStreak} days`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'ACTIVITY_STREAK',
    eventData: { currentStreak },
    timestamp: Date.now(),
  });
};

/**
 * Initializes analytics tracking for a user session.
 * This should be called when a user logs in or starts a new session.
 * @param user The user starting the session.
 */
export const initializeAnalyticsSession = (user: User): void => {
  console.log(`Initializing analytics session for user ${user.id}`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'SESSION_START',
    eventData: { userAgent: navigator.userAgent, timestamp: Date.now() },
    timestamp: Date.now(),
  });
};

/**
 * Ends analytics tracking for a user session.
 * This should be called when a user logs out or ends their session.
 * @param user The user ending the session.
 * @param sessionDuration The duration of the session in milliseconds.
 */
export const endAnalyticsSession = (user: User, sessionDuration: number): void => {
  console.log(`Ending analytics session for user ${user.id}`);
  sendAnalyticsData({
    userId: user.id,
    eventType: 'SESSION_END',
    eventData: { sessionDuration },
    timestamp: Date.now(),
  });
};