import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { authMiddleware } from './middleware/auth';
import { applyRateLimit } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import createMainRouter from './routes';

/**
 * This file serves as the main application setup for the Pollen8 API, configuring the Express.js server and middleware.
 * 
 * Requirements addressed:
 * - API Setup (Technical specification/2. SYSTEM ARCHITECTURE/2.3.2 Backend Components)
 * - Security (Technical specification/9. SECURITY CONSIDERATIONS/9.3 SECURITY PROTOCOLS)
 * - Error Handling (Technical specification/2. SYSTEM ARCHITECTURE/2.3.2 Backend Components)
 */

const app: Express = express();

/**
 * Configures and applies middleware to the Express application.
 * 
 * @param {Express} app - The Express application instance
 */
function configureMiddleware(app: Express): void {
  // Apply CORS middleware
  app.use(cors({
    origin: config.corsAllowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Apply Helmet middleware for security headers
  app.use(helmet());

  // Apply Morgan middleware for request logging
  app.use(morgan('combined'));

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiting middleware
  app.use(applyRateLimit);

  // Apply authentication middleware to all routes except public ones
  app.use(/^(?!\/api\/v1\/auth).*$/, authMiddleware);
}

/**
 * Sets up API routes for the application.
 * 
 * @param {Express} app - The Express application instance
 */
function configureRoutes(app: Express): void {
  const mainRouter = createMainRouter();
  app.use('/api/v1', mainRouter);
}

/**
 * Sets up global error handling for the application.
 * 
 * @param {Express} app - The Express application instance
 */
function configureErrorHandling(app: Express): void {
  // Handle 404 errors
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);
}

// Configure middleware
configureMiddleware(app);

// Configure routes
configureRoutes(app);

// Configure error handling
configureErrorHandling(app);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Pollen8 API is running' });
});

export default app;