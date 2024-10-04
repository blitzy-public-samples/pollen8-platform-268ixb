import { EntityRepository, Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { createSelectQuery, createInsertQuery, createUpdateQuery } from '../utils/query-builder.util';
import { getConnection } from '../utils/database-connection.util';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repository for handling invite-related database operations in the Pollen8 platform.
 * @description This class extends the TypeORM Repository to provide custom methods for invite-related database operations.
 * @requirements Invite System - Manage invite-related database operations (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements Trackable invite links - Handle database operations for invite links (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements Click analytics - Store and retrieve invite click data (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */
@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
  /**
   * Creates a new invite record in the database.
   * @param userId - The ID of the user creating the invite
   * @param name - The name of the invite
   * @returns The created invite object
   */
  async createInvite(userId: string, name: string): Promise<Invite> {
    const url = this.generateUniqueUrl();
    const invite = new Invite({ userId, name, url });
    const insertQuery = createInsertQuery(Invite, invite);
    await insertQuery.execute();
    return invite;
  }

  /**
   * Retrieves an invite record by its unique URL.
   * @param url - The unique URL of the invite
   * @returns The found invite or undefined if not found
   */
  async getInviteByUrl(url: string): Promise<Invite | undefined> {
    const selectQuery = createSelectQuery(Invite, {
      where: { url },
      relations: ['user'],
    });
    return selectQuery.getOne();
  }

  /**
   * Increments the click count for a specific invite.
   * @param inviteId - The ID of the invite to update
   */
  async updateInviteClicks(inviteId: string): Promise<void> {
    const updateQuery = createUpdateQuery(Invite, { id: inviteId }, { clickCount: () => 'clickCount + 1' });
    await updateQuery.execute();
  }

  /**
   * Retrieves all invites created by a specific user.
   * @param userId - The ID of the user
   * @returns An array of invites created by the user
   */
  async getInvitesByUser(userId: string): Promise<Invite[]> {
    const selectQuery = createSelectQuery(Invite, {
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return selectQuery.getMany();
  }

  /**
   * Retrieves analytics data for a specific invite within a date range.
   * @param inviteId - The ID of the invite
   * @param startDate - The start date of the analytics period
   * @param endDate - The end date of the analytics period
   * @returns An array of invite analytics data
   */
  async getInviteAnalytics(inviteId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();

    return queryBuilder
      .select('DATE(ia.createdAt)', 'date')
      .addSelect('SUM(ia.clickCount)', 'totalClicks')
      .from('invite_analytics', 'ia')
      .where('ia.inviteId = :inviteId', { inviteId })
      .andWhere('ia.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(ia.createdAt)')
      .orderBy('DATE(ia.createdAt)', 'ASC')
      .getRawMany();
  }

  /**
   * Generates a unique URL for the invite.
   * @private
   * @returns A unique URL string
   */
  private generateUniqueUrl(): string {
    return `${process.env.INVITE_BASE_URL}/${uuidv4()}`;
  }
}

// Additional notes:
// 1. This repository extends TypeORM's Repository class to provide custom methods for invite-related operations.
// 2. It uses the query builder utility functions to create type-safe and optimized database queries.
// 3. The createInvite method generates a unique URL for each invite using the UUID library.
// 4. The getInviteAnalytics method uses a raw SQL query to aggregate click data, which may need to be optimized for large datasets.
// 5. Error handling should be implemented in the service layer that uses this repository.
// 6. Consider adding caching mechanisms for frequently accessed data, such as invite analytics.