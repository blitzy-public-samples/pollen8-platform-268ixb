import { EntityRepository, Repository, FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Industry } from '../entities/industry.entity';
import { Interest } from '../entities/interest.entity';
import { DatabaseConnection } from '../utils/database-connection.util';
import { createSelectQuery, createUpdateQuery } from '../utils/query-builder.util';

/**
 * UserRepository class for handling database operations related to user entities in the Pollen8 platform.
 * @description This class extends the TypeORM Repository class to provide custom database operations for User entities.
 * @requirements User Management - Handles CRUD operations for user data (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Phone Verification - Supports storing and retrieving verified phone numbers (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Industry Selection - Manages user's industry selections (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * @requirements Interest Selection - Manages user's interest selections (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * @requirements Location Data - Handles user's location information (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */
@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private readonly dbConnection: DatabaseConnection) {
    super();
  }

  /**
   * Creates a new user in the database.
   * @param userData Partial<User> - The user data to be created
   * @returns Promise<User> - The created user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    await this.save(user);
    return user;
  }

  /**
   * Finds a user by their phone number.
   * @param phoneNumber string - The phone number to search for
   * @returns Promise<User | undefined> - The found user or undefined
   */
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const options: FindOneOptions<User> = {
      where: { phoneNumber },
    };
    return this.findOne(options);
  }

  /**
   * Updates a user's profile information.
   * @param userId string - The ID of the user to update
   * @param profileData Partial<User> - The profile data to update
   * @returns Promise<User> - The updated user
   */
  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<User> {
    const updateQuery = createUpdateQuery(User, { id: userId }, profileData);
    await updateQuery.execute();
    return this.findOne(userId);
  }

  /**
   * Adds industry selections to a user's profile.
   * @param userId string - The ID of the user
   * @param industryIds string[] - The IDs of the industries to add
   * @returns Promise<void>
   */
  async addUserIndustries(userId: string, industryIds: string[]): Promise<void> {
    const user = await this.findOne(userId, { relations: ['industries'] });
    const industries = await this.dbConnection.getRepository(Industry).findByIds(industryIds);
    user.industries = [...user.industries, ...industries];
    await this.save(user);
  }

  /**
   * Adds interest selections to a user's profile.
   * @param userId string - The ID of the user
   * @param interestIds string[] - The IDs of the interests to add
   * @returns Promise<void>
   */
  async addUserInterests(userId: string, interestIds: string[]): Promise<void> {
    const user = await this.findOne(userId, { relations: ['interests'] });
    const interests = await this.dbConnection.getRepository(Interest).findByIds(interestIds);
    user.interests = [...user.interests, ...interests];
    await this.save(user);
  }

  /**
   * Updates a user's location information.
   * @param userId string - The ID of the user
   * @param city string - The new city
   * @param zipCode string - The new ZIP code
   * @returns Promise<User> - The updated user
   */
  async updateUserLocation(userId: string, city: string, zipCode: string): Promise<User> {
    const updateQuery = createUpdateQuery(User, { id: userId }, { city, zipCode });
    await updateQuery.execute();
    return this.findOne(userId);
  }

  /**
   * Retrieves a user's network information including connections and industries.
   * @param userId string - The ID of the user
   * @returns Promise<User> - The user with network information
   */
  async getUserNetworkInfo(userId: string): Promise<User> {
    const selectQuery = createSelectQuery(User, {
      where: { id: userId },
      relations: ['connections', 'industries'],
    });
    return selectQuery.getOne();
  }

  /**
   * Retrieves users based on shared industries.
   * @param industryIds string[] - The IDs of the industries to match
   * @param limit number - The maximum number of users to retrieve
   * @returns Promise<User[]> - The matched users
   */
  async getUsersBySharedIndustries(industryIds: string[], limit: number): Promise<User[]> {
    const selectQuery = createSelectQuery(User, {
      relations: ['industries'],
      take: limit,
    });
    selectQuery.innerJoin('user.industries', 'industry', 'industry.id IN (:...industryIds)', { industryIds });
    return selectQuery.getMany();
  }
}