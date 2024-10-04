/**
 * This file defines the TypeScript interface for the Invite entity in the Pollen8 platform's API.
 * It addresses the requirement for defining the structure of invite data as part of the Invite System
 * specified in the Technical specification/1.1 System Objectives/Strategic Growth Tools.
 */

/**
 * Interface defining the structure of an Invite object in the Pollen8 platform.
 */
export interface IInvite {
  /**
   * Unique identifier for the invite.
   */
  id: string;

  /**
   * Identifier of the user who created the invite.
   */
  userId: string;

  /**
   * Name or description of the invite.
   */
  name: string;

  /**
   * Unique URL for the invite link.
   */
  url: string;

  /**
   * Number of times the invite link has been clicked.
   */
  clickCount: number;

  /**
   * Timestamp of when the invite was created.
   */
  createdAt: Date;
}