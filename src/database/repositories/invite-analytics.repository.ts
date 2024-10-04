import { EntityRepository, Repository, Between } from 'typeorm';
import { InviteAnalytics } from '../entities/invite-analytics.entity';
import { QueryBuilder } from '../utils/query-builder.util';

/**
 * InviteAnalyticsRepository handles database operations related to invite analytics in the Pollen8 platform.
 * @description This class extends the TypeORM Repository to provide custom methods for invite analytics-related database operations.
 * @requirements Click Analytics - Manage database operations for invite click analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements 30-day Activity Visualization - Handle data retrieval for invite activity visualization (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */
@EntityRepository(InviteAnalytics)
export class InviteAnalyticsRepository extends Repository<InviteAnalytics> {
  /**
   * Creates a new invite analytics record in the database.
   * @param inviteId - The ID of the invite associated with this analytics record.
   * @param date - The date for which the analytics are being recorded.
   * @param clicks - The number of clicks for the invite on the given date.
   * @returns The created invite analytics record.
   */
  async createInviteAnalytics(inviteId: string, date: Date, clicks: number): Promise<InviteAnalytics> {
    const inviteAnalytics = new InviteAnalytics({
      inviteId,
      date,
      dailyClicks: [clicks],
    });
    return this.save(inviteAnalytics);
  }

  /**
   * Updates the click count for an existing invite analytics record.
   * @param id - The ID of the invite analytics record to update.
   * @param clicks - The number of clicks to add to the existing count.
   */
  async updateInviteAnalytics(id: string, clicks: number): Promise<void> {
    const inviteAnalytics = await this.findOne(id);
    if (inviteAnalytics) {
      inviteAnalytics.dailyClicks[inviteAnalytics.dailyClicks.length - 1] += clicks;
      await this.save(inviteAnalytics);
    }
  }

  /**
   * Retrieves invite analytics records for a specific invite within a given date range.
   * @param inviteId - The ID of the invite to retrieve analytics for.
   * @param startDate - The start date of the range to retrieve analytics for.
   * @param endDate - The end date of the range to retrieve analytics for.
   * @returns An array of invite analytics records.
   */
  async getInviteAnalyticsByDateRange(inviteId: string, startDate: Date, endDate: Date): Promise<InviteAnalytics[]> {
    return this.find({
      where: {
        inviteId,
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  /**
   * Retrieves aggregated analytics data for an invite over a specified period.
   * @param inviteId - The ID of the invite to retrieve analytics for.
   * @param period - The period for which to aggregate the data (e.g., 'daily', 'weekly', 'monthly').
   * @returns An array of aggregated analytics data.
   */
  async getAggregatedAnalytics(inviteId: string, period: string): Promise<AggregatedAnalytics[]> {
    const queryBuilder = new QueryBuilder(this.createQueryBuilder('inviteAnalytics'));

    queryBuilder
      .where('inviteAnalytics.inviteId = :inviteId', { inviteId })
      .addGroupBy(period, 'inviteAnalytics.date')
      .addSelect('SUM(inviteAnalytics.dailyClicks)', 'totalClicks')
      .addOrderBy('period', 'ASC');

    return queryBuilder.getRawMany();
  }
}

/**
 * Represents the structure of aggregated analytics data.
 */
interface AggregatedAnalytics {
  period: string;
  totalClicks: number;
}