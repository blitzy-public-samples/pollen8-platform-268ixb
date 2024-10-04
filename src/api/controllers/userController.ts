import { Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthMiddleware } from '../middleware/auth';
import { User, UpdateUserDto } from '../interfaces/user.interface';

/**
 * UserController handles HTTP requests related to user operations in the Pollen8 API.
 * This controller addresses the following requirements:
 * - User Management (Technical specification/1.1 System Objectives/Verified Connections)
 * - Industry Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Interest Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Location Management (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves the profile of the authenticated user.
   * @param req - The request object containing the authenticated user
   * @param res - The response object to send the user profile
   */
  @Get('/profile')
  @UseGuards(AuthMiddleware)
  async getProfile(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const userProfile = await this.userService.getUserById(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
  }

  /**
   * Updates the profile of the authenticated user.
   * @param req - The request object containing the authenticated user and update data
   * @param res - The response object to send the updated user profile
   */
  @Put('/profile')
  @UseGuards(AuthMiddleware)
  async updateProfile(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const updateData: UpdateUserDto = req.body;

      // TODO: Implement input validation using a validation utility
      // const validationErrors = validateUserInput(updateData);
      // if (validationErrors.length > 0) {
      //   return res.status(400).json({ message: 'Invalid input', errors: validationErrors });
      // }

      const updatedUser = await this.userService.updateProfile(userId, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  }

  /**
   * Updates the industry preferences of the authenticated user.
   * @param req - The request object containing the authenticated user and industry data
   * @param res - The response object to send the updated user profile
   */
  @Put('/industries')
  @UseGuards(AuthMiddleware)
  async updateIndustries(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const { industries } = req.body;

      // TODO: Implement input validation for industries
      // const validationErrors = validateIndustries(industries);
      // if (validationErrors.length > 0) {
      //   return res.status(400).json({ message: 'Invalid input', errors: validationErrors });
      // }

      const updatedUser = await this.userService.updateProfile(userId, { industries });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user industries', error: error.message });
    }
  }

  /**
   * Updates the interest preferences of the authenticated user.
   * @param req - The request object containing the authenticated user and interest data
   * @param res - The response object to send the updated user profile
   */
  @Put('/interests')
  @UseGuards(AuthMiddleware)
  async updateInterests(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const { interests } = req.body;

      // TODO: Implement input validation for interests
      // const validationErrors = validateInterests(interests);
      // if (validationErrors.length > 0) {
      //   return res.status(400).json({ message: 'Invalid input', errors: validationErrors });
      // }

      const updatedUser = await this.userService.updateProfile(userId, { interests });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user interests', error: error.message });
    }
  }

  /**
   * Updates the location of the authenticated user.
   * @param req - The request object containing the authenticated user and location data
   * @param res - The response object to send the updated user profile
   */
  @Put('/location')
  @UseGuards(AuthMiddleware)
  async updateLocation(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const { city, zipCode } = req.body;

      // TODO: Implement input validation for location data
      // const validationErrors = validateLocation(city, zipCode);
      // if (validationErrors.length > 0) {
      //   return res.status(400).json({ message: 'Invalid input', errors: validationErrors });
      // }

      const updatedUser = await this.userService.updateProfile(userId, { city, zipCode });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user location', error: error.message });
    }
  }
}