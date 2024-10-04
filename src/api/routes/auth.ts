import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { container } from '../config/inversify.config';

/**
 * Configures the authentication routes for the Pollen8 API.
 * 
 * Requirements addressed:
 * - User Authentication (Technical specification/1.1 System Objectives/Verified Connections)
 * - Secure Access (Technical specification/9.1 Authentication and Authorization)
 * 
 * @param router - Express Router instance
 * @returns void
 */
export function configureAuthRoutes(router: Router): void {
  const authController = container.get<AuthController>(AuthController);

  // POST /auth/verify - Initiate phone verification
  router.post(
    '/auth/verify',
    validationMiddleware({
      phoneNumber: { type: 'string', required: true }
    }),
    (req, res, next) => authController.verifyPhone(req, res, next)
  );

  // POST /auth/confirm - Confirm verification code
  router.post(
    '/auth/confirm',
    validationMiddleware({
      phoneNumber: { type: 'string', required: true },
      verificationCode: { type: 'string', required: true }
    }),
    (req, res, next) => authController.confirmVerification(req, res, next)
  );

  // POST /auth/refresh - Refresh authentication token
  router.post(
    '/auth/refresh',
    authMiddleware,
    (req, res, next) => {
      // TODO: Implement token refresh logic
      res.status(501).json({ message: 'Token refresh not implemented' });
    }
  );

  // POST /auth/logout - User logout
  router.post(
    '/auth/logout',
    authMiddleware,
    (req, res, next) => authController.logout(req, res, next)
  );
}

/**
 * Creates and configures an Express Router for authentication routes.
 * 
 * @returns Configured Express Router
 */
export function createAuthRouter(): Router {
  const router = Router();
  configureAuthRoutes(router);
  return router;
}