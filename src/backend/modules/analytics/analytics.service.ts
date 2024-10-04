import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NetworkService } from '../network/network.service';
import { InviteService } from '../invite/invite.service';
import { NetworkValueCalculator } from '../../shared/utils/network-value-calculator.util';

/**
 * AnalyticsService class for handling analytics-related operations in the Pollen8 platform.
 * @description This class provides methods for calculating network growth, user engagement, and invite effectiveness.
 * @requirements Quantifiable Networking - Technical specification/1.1 System Objectives
 * @requirements Strategic Growth Tools - Technical specification/1.1 System Objectives
 */
@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userService: UserService,
    private readonly networkService: NetworkService,
    private readonly inviteService: InviteService,
    private readonly networkValueCalculator: NetworkValueCalculator
  ) {}

  /**
   * Calculates the network growth for a specific user within a given date range.
   * @param userId - The ID of the user
   * @param startDate - The start date of the analysis period
   * @param endDate - The end date of the analysis period
   * @returns Promise<NetworkGrowthData> - Object containing network growth data
   */
  async calculateNetworkGrowth(userId: string, startDate: Date, endDate: Date): Promise<NetworkGrowthData> {
    // Validate input parameters
    if (!userId || !startDate || !endDate) {
      throw new Error('Invalid input parameters for network growth calculation');
    }

    // Ensure startDate is before endDate
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    // Retrieve user's network data for start and end dates using NetworkService
    const startNetworkSize = await this.networkService.getNetworkSizeAtDate(userId, startDate);
    const endNetworkSize = await this.networkService.getNetworkSizeAtDate(userId, endDate);

    // Calculate growth metrics
    const newConnections = endNetworkSize - startNetworkSize;
    const growthRate = (newConnections / startNetworkSize) * 100;
    const averageGrowthPerDay = newConnections / ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate network value
    const startNetworkValue = this.networkValueCalculator.calculate(startNetworkSize);
    const endNetworkValue = this.networkValueCalculator.calculate(endNetworkSize);
    const networkValueGrowth = endNetworkValue - startNetworkValue;

    // Return NetworkGrowthData object with calculated metrics
    return {
      userId,
      startDate,
      endDate,
      startNetworkSize,
      endNetworkSize,
      newConnections,
      growthRate,
      averageGrowthPerDay,
      startNetworkValue,
      endNetworkValue,
      networkValueGrowth
    };
  }

  /**
   * Retrieves user engagement data for a specific user over a given period.
   * @param userId - The ID of the user
   * @param period - The period for which to retrieve engagement data (e.g., '7d', '30d', '90d')
   * @returns Promise<UserEngagementData> - Object containing user engagement data
   */
  async getUserEngagement(userId: string, period: string): Promise<UserEngagementData> {
    // Validate input parameters
    if (!userId || !period) {
      throw new Error('Invalid input parameters for user engagement retrieval');
    }

    // Determine date range based on the specified period
    const endDate = new Date();
    const startDate = this.calculateStartDate(period);

    // Retrieve user activity data from UserService
    const userActivity = await this.userService.getUserActivityInPeriod(userId, startDate, endDate);

    // Calculate engagement metrics
    const loginFrequency = userActivity.loginCount / this.getDaysBetweenDates(startDate, endDate);
    const connectionInteractions = userActivity.connectionInteractions;
    const invitesSent = userActivity.invitesSent;
    const profileUpdates = userActivity.profileUpdates;

    // Calculate an overall engagement score (this is a simplified example)
    const engagementScore = (loginFrequency * 0.3) + (connectionInteractions * 0.4) + (invitesSent * 0.2) + (profileUpdates * 0.1);

    // Return UserEngagementData object with calculated metrics
    return {
      userId,
      period,
      startDate,
      endDate,
      loginFrequency,
      connectionInteractions,
      invitesSent,
      profileUpdates,
      engagementScore
    };
  }

  /**
   * Calculates the effectiveness of invites sent by a specific user.
   * @param userId - The ID of the user
   * @returns Promise<InviteEffectivenessData> - Object containing invite effectiveness data
   */
  async getInviteEffectiveness(userId: string): Promise<InviteEffectivenessData> {
    // Retrieve invite data for the user from InviteService
    const invites = await this.inviteService.getInvitesByUser(userId, { page: 1, limit: 1000 });

    // Calculate effectiveness metrics
    let totalInvites = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    for (const invite of invites.items) {
      totalInvites++;
      totalClicks += invite.clicks;
      // Assuming we have a way to track successful conversions from invites
      totalConversions += invite.conversions || 0;
    }

    const clickThroughRate = totalClicks / totalInvites;
    const conversionRate = totalConversions / totalClicks;
    const overallEffectiveness = (clickThroughRate * 0.4) + (conversionRate * 0.6); // Weighted score

    // Return InviteEffectivenessData object with calculated metrics
    return {
      userId,
      totalInvites,
      totalClicks,
      totalConversions,
      clickThroughRate,
      conversionRate,
      overallEffectiveness
    };
  }

  /**
   * Calculates the total network value for a specific user.
   * @param userId - The ID of the user
   * @returns Promise<number> - The calculated network value
   */
  async getNetworkValue(userId: string): Promise<number> {
    // Retrieve user's network data from NetworkService
    const networkSize = await this.networkService.getNetworkSize(userId);

    // Use NetworkValueCalculator to calculate the total network value
    return this.networkValueCalculator.calculate(networkSize);
  }

  /**
   * Helper method to calculate the start date based on the given period.
   * @private
   * @param period - The period string (e.g., '7d', '30d', '90d')
   * @returns Date - The calculated start date
   */
  private calculateStartDate(period: string): Date {
    const days = parseInt(period);
    if (isNaN(days)) {
      throw new Error('Invalid period format. Use format like "7d", "30d", etc.');
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return startDate;
  }

  /**
   * Helper method to calculate the number of days between two dates.
   * @private
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns number - The number of days between the two dates
   */
  private getDaysBetweenDates(startDate: Date, endDate: Date): number {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}

interface NetworkGrowthData {
  userId: string;
  startDate: Date;
  endDate: Date;
  startNetworkSize: number;
  endNetworkSize: number;
  newConnections: number;
  growthRate: number;
  averageGrowthPerDay: number;
  startNetworkValue: number;
  endNetworkValue: number;
  networkValueGrowth: number;
}

interface UserEngagementData {
  userId: string;
  period: string;
  startDate: Date;
  endDate: Date;
  loginFrequency: number;
  connectionInteractions: number;
  invitesSent: number;
  profileUpdates: number;
  engagementScore: number;
}

interface InviteEffectivenessData {
  userId: string;
  totalInvites: number;
  totalClicks: number;
  totalConversions: number;
  clickThroughRate: number;
  conversionRate: number;
  overallEffectiveness: number;
}