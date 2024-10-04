import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { controller, httpPost, request, response, next } from 'inversify-express-utils';
import { AuthService } from '../services/authService';
import { User } from '../interfaces/user.interface';
import { generateToken } from '../utils/jwt';
import { verifyPhoneNumber } from '../utils/phoneVerification';
import { validateRequest } from '../middleware/validation';

/**
 * AuthController handles all authentication-related routes and processes.
 * 
 * Requirements addressed:
 * - Phone Verification (Technical specification/1.1 System Objectives/Verified Connections)
 * - User Authentication (Technical specification/9.1 Authentication and Authorization)
 */
@injectable()
@controller('/auth')
export class AuthController {
  private authService: AuthService;

  constructor(@inject(AuthService) authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Initiates the phone verification process for a user.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @httpPost('/verify')
  async verifyPhone(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      // Extract phone number from request body
      const { phoneNumber } = req.body;

      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        res.status(400).json({ error: 'Invalid phone number format' });
        return;
      }

      // Call authService to initiate phone verification
      const verificationInitiated = await this.authService.initiatePhoneVerification(phoneNumber);

      if (verificationInitiated) {
        res.status(200).json({ message: 'Verification code sent successfully' });
      } else {
        res.status(500).json({ error: 'Failed to send verification code' });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirms the phone verification code and completes the user authentication process.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @httpPost('/confirm')
  async confirmVerification(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      // Extract phone number and verification code from request body
      const { phoneNumber, verificationCode } = req.body;

      // Validate input data
      if (!this.isValidPhoneNumber(phoneNumber) || !verificationCode) {
        res.status(400).json({ error: 'Invalid phone number or verification code' });
        return;
      }

      // Call authService to verify phone number
      const isVerified = await this.authService.verifyPhoneNumber(phoneNumber, verificationCode);

      if (isVerified) {
        // Generate JWT token
        const user = await this.authService.getUserByPhoneNumber(phoneNumber);
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const token = generateToken({ userId: user.id, phoneNumber: user.phoneNumber });

        // Send 200 response with token and user data
        res.status(200).json({ token, user });
      } else {
        res.status(400).json({ error: 'Invalid verification code' });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles user logout by invalidating the current session or token.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @httpPost('/logout')
  async logout(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      // Extract user ID from authenticated request
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Call authService to invalidate user's token or session
      const logoutSuccessful = await this.authService.logout(userId);

      if (logoutSuccessful) {
        res.status(200).json({ message: 'Logout successful' });
      } else {
        res.status(500).json({ error: 'Logout failed' });
      }
    } catch (error) {
      next(error);
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