import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PaginatedResult } from '@shared/interfaces/paginated-result.interface';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { phoneVerificationUtil } from '@shared/utils/phone-verification.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UserService class implementing the business logic for user-related operations in the Pollen8 platform.
 * @description This class provides methods for user creation, retrieval, updates, and phone verification.
 * @requirements User Management - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Phone Verification - Technical Specification/1.1 System Objectives/Verified Connections
 * @requirements Industry Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Interest Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Location-based Profile - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  /**
   * Creates a new user in the system.
   * @param userData The data for creating a new user
   * @returns A promise that resolves to the created user
   * @throws BadRequestException if the user data is invalid
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    // Validate minimum industry and interest selections
    if (userData.industries.length < 3 || userData.interests.length < 3) {
      throw new BadRequestException('At least 3 industries and 3 interests must be selected');
    }

    // Check if user with the given phone number already exists
    const existingUser = await this.userRepository.findByPhoneNumber(userData.phoneNumber);
    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }

    // Create a new User entity
    const user = this.userRepository.create(userData);

    // Save the user to the database
    return this.userRepository.save(user);
  }

  /**
   * Retrieves a user by their ID.
   * @param id The ID of the user to retrieve
   * @returns A promise that resolves to the found user
   * @throws NotFoundException if the user is not found
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findByIdWithIndustriesAndInterests(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Retrieves a user by their phone number.
   * @param phoneNumber The phone number of the user to retrieve
   * @returns A promise that resolves to the found user
   * @throws NotFoundException if the user is not found
   */
  async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Updates a user's information.
   * @param id The ID of the user to update
   * @param updateData The data to update the user with
   * @returns A promise that resolves to the updated user
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the update data is invalid
   */
  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);

    // Validate minimum industry and interest selections if updating
    if (updateData.industries && updateData.industries.length < 3) {
      throw new BadRequestException('At least 3 industries must be selected');
    }
    if (updateData.interests && updateData.interests.length < 3) {
      throw new BadRequestException('At least 3 interests must be selected');
    }

    // Update the user entity with the new data
    Object.assign(user, updateData);

    // Save the updated user to the database
    return this.userRepository.save(user);
  }

  /**
   * Retrieves all users with pagination.
   * @param paginationDto The pagination parameters
   * @returns A promise that resolves to a paginated list of users
   */
  async getAllUsers(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const { page, limit } = paginationDto;
    return this.userRepository.findAllPaginated(page, limit);
  }

  /**
   * Verifies a user's phone number.
   * @param phoneNumber The phone number to verify
   * @param code The verification code
   * @returns A promise that resolves to true if verification is successful, false otherwise
   */
  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<boolean> {
    const isVerified = await phoneVerificationUtil.verify(phoneNumber, code);
    if (isVerified) {
      const user = await this.findUserByPhoneNumber(phoneNumber);
      user.isVerified = true;
      await this.userRepository.save(user);
    }
    return isVerified;
  }
}