import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, CreateUserDto, UpdateUserDto, UserProfileDto } from '../interfaces/user.interface';
import { Industry } from '../shared/types/industry';
import { Interest } from '../shared/types/interest';
import { environment } from '../config/environment';
import { verifyPhoneNumber } from '../utils/phoneVerification';
import { generateToken } from '../utils/jwt';
import * as bcrypt from 'bcrypt';

/**
 * UserService handles all business logic related to user operations in the Pollen8 platform.
 * This service addresses the following requirements:
 * - User Authentication (Technical specification/1.2 Scope/Core Functionalities)
 * - Profile Management (Technical specification/1.2 Scope/Core Functionalities)
 * - Location-based Enhancement (Technical specification/1.2 Scope/Core Functionalities)
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Industry)
    private industryRepository: Repository<Industry>,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>
  ) {}

  /**
   * Registers a new user in the system after verifying their phone number.
   * @param userData - The data for creating a new user
   * @returns The newly created user object
   */
  async register(userData: CreateUserDto): Promise<User> {
    // Verify phone number
    const isVerified = await verifyPhoneNumber(userData.phoneNumber);
    if (!isVerified) {
      throw new Error('Phone number verification failed');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { phoneNumber: userData.phoneNumber } });
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    // Validate industries and interests
    const industries = await this.validateIndustries(userData.industries);
    const interests = await this.validateInterests(userData.interests);

    if (industries.length < 3 || interests.length < 3) {
      throw new Error('At least 3 industries and 3 interests are required');
    }

    // Create new user
    const newUser = this.userRepository.create({
      ...userData,
      industries,
      interests,
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    // Save user to database
    return this.userRepository.save(newUser);
  }

  /**
   * Authenticates a user and generates a JWT token upon successful authentication.
   * @param phone - The user's phone number
   * @param password - The user's password
   * @returns An object containing the authenticated user and JWT token
   */
  async authenticate(phone: string): Promise<{ user: User; token: string }> {
    // Find user by phone number
    const user = await this.userRepository.findOne({ where: { phoneNumber: phone } });
    if (!user) {
      throw new Error('User not found');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login timestamp
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return { user, token };
  }

  /**
   * Updates a user's profile information including industries and interests.
   * @param userId - The ID of the user to update
   * @param profileData - The updated profile data
   * @returns The updated user object
   */
  async updateProfile(userId: string, profileData: UpdateUserDto): Promise<User> {
    // Find user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Update user properties
    if (profileData.city) user.city = profileData.city;
    if (profileData.zipCode) user.zipCode = profileData.zipCode;

    // Update industries and interests if provided
    if (profileData.industries) {
      user.industries = await this.validateIndustries(profileData.industries);
    }
    if (profileData.interests) {
      user.interests = await this.validateInterests(profileData.interests);
    }

    // Save updated user to database
    return this.userRepository.save(user);
  }

  /**
   * Retrieves a user's information by their ID.
   * @param userId - The ID of the user to retrieve
   * @returns The user object
   */
  async getUserById(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['industries', 'interests']
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Return user profile DTO to exclude sensitive information
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      city: user.city,
      zipCode: user.zipCode,
      industries: user.industries,
      interests: user.interests
    };
  }

  /**
   * Validates and retrieves industry objects based on provided IDs.
   * @param industryIds - Array of industry IDs
   * @returns Array of validated Industry objects
   */
  private async validateIndustries(industryIds: string[]): Promise<Industry[]> {
    const industries = await this.industryRepository.findByIds(industryIds);
    if (industries.length !== industryIds.length) {
      throw new Error('One or more invalid industry IDs provided');
    }
    return industries;
  }

  /**
   * Validates and retrieves interest objects based on provided IDs.
   * @param interestIds - Array of interest IDs
   * @returns Array of validated Interest objects
   */
  private async validateInterests(interestIds: string[]): Promise<Interest[]> {
    const interests = await this.interestRepository.findByIds(interestIds);
    if (interests.length !== interestIds.length) {
      throw new Error('One or more invalid interest IDs provided');
    }
    return interests;
  }
}