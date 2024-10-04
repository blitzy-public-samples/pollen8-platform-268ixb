import { User, CreateUserDto } from '../interfaces/user.interface';
import { JWT_SECRET } from '../config/environment';
import { generateToken, verifyToken } from '../utils/jwt';
import { sendVerificationCode, verifyCode } from '../utils/phoneVerification';
import { UserService } from './userService';
import * as bcrypt from 'bcrypt';

/**
 * AuthService class encapsulates all authentication-related operations including
 * phone verification, user login, and token management.
 * 
 * Requirements addressed:
 * - Phone Verification (Technical specification/1.1 System Objectives/Verified Connections)
 * - JWT Authentication (Technical specification/9.1 Authentication and Authorization)
 */
export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Initiates the phone verification process by sending a verification code to the provided phone number.
   * @param phoneNumber - The phone number to verify
   * @returns A Promise resolving to true if the verification code was sent successfully, false otherwise
   */
  async initiatePhoneVerification(phoneNumber: string): Promise<boolean> {
    try {
      // Validate the phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      // Send verification code using the phoneVerification utility
      await sendVerificationCode(phoneNumber);
      return true;
    } catch (error) {
      console.error('Phone verification initiation failed:', error);
      return false;
    }
  }

  /**
   * Verifies the provided code against the one sent to the phone number.
   * @param phoneNumber - The phone number to verify
   * @param code - The verification code provided by the user
   * @returns A Promise resolving to true if the code is valid, false otherwise
   */
  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // Verify the code using the phoneVerification utility
      const isValid = await verifyCode(phoneNumber, code);

      if (isValid) {
        // Update user's phone verification status
        await this.userService.updatePhoneVerificationStatus(phoneNumber, true);
      }

      return isValid;
    } catch (error) {
      console.error('Phone verification failed:', error);
      return false;
    }
  }

  /**
   * Authenticates a user and returns a JWT token along with the user object.
   * @param phoneNumber - The user's phone number
   * @param password - The user's password
   * @returns A Promise resolving to an object containing the JWT token and user object if authentication is successful
   */
  async login(phoneNumber: string, password: string): Promise<{ token: string; user: User } | null> {
    try {
      // Retrieve user by phone number using UserService
      const user = await this.userService.getUserByPhoneNumber(phoneNumber);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify the provided password against the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate a JWT token
      const token = generateToken({ userId: user.id, phoneNumber: user.phoneNumber });

      // Return the token and user object
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  /**
   * Verifies a JWT token and returns the associated user if valid.
   * @param token - The JWT token to verify
   * @returns A Promise resolving to the User object if the token is valid, null otherwise
   */
  async verifyToken(token: string): Promise<User | null> {
    try {
      // Verify the token using the jwt utility
      const decoded = verifyToken(token);

      if (!decoded) {
        return null;
      }

      // Retrieve and return the associated user
      const user = await this.userService.getUserById(decoded.userId);
      return user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Changes a user's password after verifying the old password.
   * @param userId - The ID of the user changing their password
   * @param oldPassword - The user's current password
   * @param newPassword - The new password to set
   * @returns A Promise resolving to true if the password was changed successfully, false otherwise
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Retrieve user by ID using UserService
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify the old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!isOldPasswordValid) {
        throw new Error('Invalid old password');
      }

      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update the user's password using UserService
      const updated = await this.userService.updatePassword(userId, newPasswordHash);

      return updated;
    } catch (error) {
      console.error('Password change failed:', error);
      return false;
    }
  }

  /**
   * Validates the format of a phone number.
   * @param phoneNumber - The phone number to validate
   * @returns True if the phone number is valid, false otherwise
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Implement phone number validation logic
    // This is a simple example and should be replaced with a more robust validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}