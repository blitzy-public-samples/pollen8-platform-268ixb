import { EntityRepository, Repository } from 'typeorm';
import { Interest } from '../entities/interest.entity';
import { DatabaseConnection } from '../utils/database-connection.util';
import { QueryBuilder } from '../utils/query-builder.util';

/**
 * This class defines the custom repository for managing Interest entities in the database.
 * It extends the base Repository class from TypeORM and is decorated with @EntityRepository to associate it with the Interest entity.
 * @description Repository for managing Interest entities in the Pollen8 platform's database layer.
 * @requirements User Interests - Manage user interests for profile creation and network matching (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Interest Selection - Allow users to select a minimum of 3 interests (Technical Specification/1.2 Scope/Core Functionalities)
 */
@EntityRepository(Interest)
export class InterestRepository extends Repository<Interest> {
  constructor(private databaseConnection: DatabaseConnection, private queryBuilder: QueryBuilder) {
    super();
  }

  /**
   * This function retrieves an Interest entity by its name.
   * @param name The name of the interest to find
   * @returns A Promise resolving to the found Interest entity or undefined if not found
   */
  async findByName(name: string): Promise<Interest | undefined> {
    return this.findOne({ where: { name } });
  }

  /**
   * This function creates a new Interest entity in the database.
   * @param name The name of the new interest to create
   * @returns A Promise resolving to the newly created Interest entity
   */
  async createInterest(name: string): Promise<Interest> {
    const interest = this.create({ name });
    return this.save(interest);
  }

  /**
   * This function retrieves a list of the most popular interests based on user selections.
   * @param limit The maximum number of interests to retrieve (default: 10)
   * @returns A Promise resolving to an array of the most popular Interest entities
   */
  async getPopularInterests(limit: number = 10): Promise<Interest[]> {
    const queryBuilder = this.createQueryBuilder('interest')
      .leftJoin('interest.users', 'user')
      .groupBy('interest.id')
      .orderBy('COUNT(user.id)', 'DESC')
      .limit(limit);

    return queryBuilder.getMany();
  }

  /**
   * This function retrieves interests that match a given search term.
   * @param searchTerm The term to search for in interest names
   * @param limit The maximum number of results to return (default: 10)
   * @returns A Promise resolving to an array of matching Interest entities
   */
  async searchInterests(searchTerm: string, limit: number = 10): Promise<Interest[]> {
    return this.createQueryBuilder('interest')
      .where('interest.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .limit(limit)
      .getMany();
  }

  /**
   * This function retrieves interests that are not associated with a given user.
   * @param userId The ID of the user
   * @param limit The maximum number of results to return (default: 10)
   * @returns A Promise resolving to an array of Interest entities not associated with the user
   */
  async getInterestsNotSelectedByUser(userId: string, limit: number = 10): Promise<Interest[]> {
    return this.createQueryBuilder('interest')
      .leftJoin('interest.users', 'user')
      .where('user.id IS NULL OR user.id != :userId', { userId })
      .limit(limit)
      .getMany();
  }
}