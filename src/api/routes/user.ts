import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { UpdateUserDto } from '../interfaces/user.interface';

/**
 * This file defines the user-related API routes for the Pollen8 platform,
 * handling user profile management and related operations.
 * 
 * Requirements addressed:
 * - User Profile Management (Technical specification/1.1 System Objectives/Verified Connections)
 * - Industry Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Interest Selection (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Location-based Enhancement (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */

export function createUserRoutes(): Router {
  const router = Router();
  const userController = new UserController();

  /**
   * GET /profile
   * Retrieves the user profile for the authenticated user
   */
  router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));

  /**
   * PUT /profile
   * Updates the user profile for the authenticated user
   */
  router.put('/profile', authMiddleware, validationMiddleware(UpdateUserDto), (req, res) => userController.updateProfile(req, res));

  /**
   * POST /industries
   * Adds industries to the user profile
   */
  router.post('/industries', authMiddleware, validationMiddleware(UpdateUserDto, ['industries']), (req, res) => userController.updateIndustries(req, res));

  /**
   * DELETE /industries/:id
   * Removes an industry from the user profile
   */
  router.delete('/industries/:id', authMiddleware, (req, res) => {
    // TODO: Implement industry removal logic
    res.status(501).json({ message: 'Industry removal not implemented yet' });
  });

  /**
   * POST /interests
   * Adds interests to the user profile
   */
  router.post('/interests', authMiddleware, validationMiddleware(UpdateUserDto, ['interests']), (req, res) => userController.updateInterests(req, res));

  /**
   * DELETE /interests/:id
   * Removes an interest from the user profile
   */
  router.delete('/interests/:id', authMiddleware, (req, res) => {
    // TODO: Implement interest removal logic
    res.status(501).json({ message: 'Interest removal not implemented yet' });
  });

  /**
   * PUT /location
   * Updates the user's location information
   */
  router.put('/location', authMiddleware, validationMiddleware(UpdateUserDto, ['city', 'zipCode']), (req, res) => userController.updateLocation(req, res));

  return router;
}

/**
 * Error handling middleware
 * This middleware catches any errors thrown in the routes and sends an appropriate error response
 */
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
}

// Apply error handling middleware to all routes
Router().use(errorHandler);

export default createUserRoutes;