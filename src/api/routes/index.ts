import { Router } from 'express';
import { configureAuthRoutes, createAuthRouter } from './auth';
import { createUserRoutes } from './user';
import { default as networkRoutes } from './network';
import { configureInviteRoutes } from './invite';

/**
 * This file serves as the central hub for organizing and exporting all API routes in the Pollen8 backend application.
 * 
 * Requirements addressed:
 * - API Route Organization (Technical Specification/2. SYSTEM ARCHITECTURE/2.3.2 Backend Components)
 * 
 * @module src/api/routes/index
 */

/**
 * Creates and configures the main router for the Pollen8 API.
 * This function combines all the individual route modules into a single router.
 * 
 * @returns {Router} The configured Express router with all API routes
 */
export default function createMainRouter(): Router {
  const router = Router();

  // Configure authentication routes
  const authRouter = createAuthRouter();
  router.use('/auth', authRouter);

  // Configure user routes
  const userRouter = createUserRoutes();
  router.use('/users', userRouter);

  // Configure network routes
  router.use('/network', networkRoutes);

  // Configure invite routes
  configureInviteRoutes(router);

  return router;
}

/**
 * Error handling middleware
 * This middleware catches any errors thrown in the routes and sends an appropriate error response
 */
function errorHandler(err: Error, req: any, res: any, next: any) {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
}

// Apply error handling middleware to all routes
Router().use(errorHandler);

// Export individual route modules for potential direct use
export { configureAuthRoutes, createAuthRouter } from './auth';
export { createUserRoutes } from './user';
export { default as networkRoutes } from './network';
export { configureInviteRoutes } from './invite';