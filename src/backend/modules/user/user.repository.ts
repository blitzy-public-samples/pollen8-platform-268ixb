import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { PaginatedResult } from '@shared/interfaces/paginated-result.interface';

/**
 * UserRepository class for handling database operations related to user entities in the Pollen8 platform.
 * @description This class extends the Repository class from TypeORM and provides custom methods for user-related database operations.
 * @requirements User Data Management - Technical Specification/1.1 System Objectives/Verified Connections
 * @requirements Industry Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Interest Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Finds a user by their phone number.
   * @param phoneNumber The phone number of the user to find
   * @returns A promise that resolves to the found user or undefined if not found
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return this.findOne({ where: { phoneNumber } });
  }

  /**
   * Finds a user by ID and includes their selected industries and interests.
   * @param id The ID of the user to find
   * @returns A promise that resolves to the found user with industries and interests or undefined if not found
   */
  async findByIdWithIndustriesAndInterests(id: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.industries', 'industries')
      .leftJoinAndSelect('user.interests', 'interests')
      .where('user.id = :id', { id })
      .getOne();
  }

  /**
   * Retrieves a paginated list of users.
   * @param page The page number to retrieve
   * @param limit The number of users per page
   * @returns A promise that resolves to a PaginatedResult containing users
   */
  async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: users,
      total,
      page,
      limit
    };
  }
}