import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IInvite } from '../interfaces/invite.interface';
import { config } from '../config/environment';
import { generateToken } from '../utils/jwt';
import { InviteRepository } from '../repositories/invite.repository';
import { InviteAnalyticsRepository } from '../repositories/invite-analytics.repository';

/**
 * This service encapsulates the business logic for managing invites in the Pollen8 platform.
 * It addresses the following requirements from the Technical specification/1.1 System Objectives/Strategic Growth Tools:
 * - Implement invite generation and tracking
 * - Track and manage invite link clicks
 * - Provide data for invite activity tracking
 */
@Injectable()
export class InviteService {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly inviteAnalyticsRepository: InviteAnalyticsRepository
  ) {}

  /**
   * Creates a new invite for a user.
   * @param userId - The ID of the user creating the invite
   * @param name - The name or description of the invite
   * @returns The created invite object
   */
  async createInvite(userId: string, name: string): Promise<IInvite> {
    const id = uuidv4();
    const token = generateToken({ id, userId });
    const url = `${config.appUrl}/invite/${token}`;

    const invite: IInvite = {
      id,
      userId,
      name,
      url,
      clickCount: 0,
      createdAt: new Date()
    };

    return this.inviteRepository.create(invite);
  }

  /**
   * Retrieves an invite by its unique URL.
   * @param url - The unique URL of the invite
   * @returns The invite object if found, null otherwise
   */
  async getInviteByUrl(url: string): Promise<IInvite | null> {
    return this.inviteRepository.findByUrl(url);
  }

  /**
   * Increments the click count for a specific invite.
   * @param inviteId - The ID of the invite
   */
  async incrementClickCount(inviteId: string): Promise<void> {
    const invite = await this.inviteRepository.findById(inviteId);
    if (!invite) {
      throw new Error('Invite not found');
    }

    invite.clickCount += 1;
    await this.inviteRepository.update(invite);

    // Record analytics data
    await this.inviteAnalyticsRepository.recordClick(inviteId, new Date());
  }

  /**
   * Retrieves all invites created by a specific user.
   * @param userId - The ID of the user
   * @returns An array of invite objects
   */
  async getInvitesByUser(userId: string): Promise<IInvite[]> {
    return this.inviteRepository.findByUserId(userId);
  }

  /**
   * Retrieves analytics data for a specific invite within a date range.
   * @param inviteId - The ID of the invite
   * @param startDate - The start date of the analytics period
   * @param endDate - The end date of the analytics period
   * @returns Analytics data for the invite
   */
  async getInviteAnalytics(inviteId: string, startDate: Date, endDate: Date): Promise<any> {
    const analyticsData = await this.inviteAnalyticsRepository.getAnalytics(inviteId, startDate, endDate);
    
    // Process and aggregate the data as needed
    const processedData = this.processAnalyticsData(analyticsData);

    return processedData;
  }

  /**
   * Helper method to process and aggregate analytics data.
   * @param analyticsData - Raw analytics data
   * @returns Processed analytics data
   */
  private processAnalyticsData(analyticsData: any[]): any {
    // Implement data processing logic here
    // This could include aggregating daily clicks, calculating trends, etc.
    // For now, we'll return the raw data
    return analyticsData;
  }
}