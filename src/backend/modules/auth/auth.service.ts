import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { phoneVerificationUtil } from '../../shared/utils/phone-verification.util';
import { jwtConfig } from '../../config/jwt.config';
import { twilioConfig } from '../../config/twilio.config';
import { User } from '../user/user.entity';

/**
 * AuthService class implementing authentication-related operations in the Pollen8 platform.
 * @description This class provides methods for user authentication, including phone verification and JWT token generation.
 * @requirements Phone Verification - Technical specification/1.1 System Objectives/Verified Connections
 * @requirements JWT Authentication - Implied from modern web application best practices
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Sends a verification code to the provided phone number using Twilio SMS service.
   * @param phoneNumber The phone number to send the verification code to
   * @returns A promise that resolves when the code is sent
   */
  async sendVerificationCode(phoneNumber: string): Promise<void> {
    try {
      const code = phoneVerificationUtil.generateVerificationCode();
      const sent = await phoneVerificationUtil.sendVerificationSMS(phoneNumber, code);
      if (!sent) {
        throw new Error('Failed to send verification SMS');
      }
      // In a real-world scenario, store the code securely with an expiration time
      console.log(`Verification code for ${phoneNumber}: ${code}`);
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw new UnauthorizedException('Failed to send verification code');
    }
  }

  /**
   * Verifies the code sent to the user's phone number.
   * @param phoneNumber The phone number to verify
   * @param code The verification code provided by the user
   * @returns A boolean indicating whether the verification was successful
   */
  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const isVerified = await phoneVerificationUtil.verifyPhoneNumber(phoneNumber, code);
      if (isVerified) {
        await this.userService.verifyPhoneNumber(phoneNumber, code);
      }
      return isVerified;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  /**
   * Logs in a user by phone number and returns a JWT access token.
   * @param phoneNumber The phone number of the user to log in
   * @returns An object containing the JWT access token
   */
  async login(phoneNumber: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findUserByPhoneNumber(phoneNumber);
      if (!user.isVerified) {
        throw new UnauthorizedException('Phone number not verified');
      }
      const payload = { sub: user.id, phoneNumber: user.phoneNumber };
      return {
        accessToken: this.jwtService.sign(payload, {
          secret: jwtConfig.secret,
          expiresIn: jwtConfig.expiresIn,
        }),
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Validates a user based on the JWT payload.
   * @param payload The JWT payload containing user information
   * @returns The validated user object or null
   */
  async validateUser(payload: any): Promise<User | null> {
    try {
      const user = await this.userService.findUserById(payload.sub);
      if (user && user.phoneNumber === payload.phoneNumber) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }
}