/**
 * This file defines the TypeScript interfaces and types related to the invite functionality in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * 2. Invite Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */

import { UserId } from './user';

/**
 * Represents a unique identifier for an invite.
 */
export type InviteId = string;

/**
 * This interface defines the structure of an invite object in the Pollen8 platform.
 */
export interface Invite {
  /**
   * The unique identifier for the invite.
   */
  id: InviteId;

  /**
   * The ID of the user who created the invite.
   */
  userId: UserId;

  /**
   * The name or description of the invite.
   */
  name: string;

  /**
   * The unique URL for the invite.
   */
  url: string;

  /**
   * The number of times the invite link has been clicked.
   */
  clickCount: number;

  /**
   * The timestamp when the invite was created.
   */
  createdAt: Date;
}

/**
 * This interface defines the structure for invite analytics data.
 */
export interface InviteAnalytics {
  /**
   * The ID of the invite these analytics are for.
   */
  inviteId: InviteId;

  /**
   * An object representing the daily click counts.
   * The keys are date strings (YYYY-MM-DD) and the values are the number of clicks on that day.
   */
  dailyClicks: Record<string, number>;

  /**
   * The total number of clicks for this invite.
   */
  totalClicks: number;
}

/**
 * This type represents the data required to create a new invite.
 */
export type CreateInviteDto = Pick<Invite, 'name'>;

/**
 * This type represents the data that can be updated for an existing invite.
 */
export type UpdateInviteDto = Partial<Pick<Invite, 'name'>>;

/**
 * This interface defines the structure for the 30-day activity visualization data.
 */
export interface InviteActivityVisualization {
  /**
   * The ID of the invite this visualization is for.
   */
  inviteId: InviteId;

  /**
   * An array of daily click counts for the last 30 days.
   * Each item in the array represents a day, with the most recent day at index 0.
   */
  dailyClickCounts: number[];

  /**
   * The total number of clicks in the last 30 days.
   */
  totalClicksLast30Days: number;
}

/**
 * This type represents the possible statuses of an invite.
 */
export type InviteStatus = 'active' | 'expired' | 'revoked';

/**
 * This interface extends the Invite interface to include the current status of the invite.
 */
export interface InviteWithStatus extends Invite {
  /**
   * The current status of the invite.
   */
  status: InviteStatus;
}