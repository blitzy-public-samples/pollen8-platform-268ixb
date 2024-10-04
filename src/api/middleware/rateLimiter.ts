import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';
import { log } from '../utils/logger';

/**
 * This file implements a rate limiting middleware for the Pollen8 API to prevent abuse and ensure fair usage of the platform.
 * It addresses the API Security requirement from the Technical Specification/9.3 SECURITY PROTOCOLS/9.3.1 API Security.
 */

/**
 * Creates and exports an instance of the rate limiter middleware.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export const rateLimiter = rateLimit({
  // Step 1: Configure rate limiter to allow 100 requests per minute per IP address
  windowMs: 60 * 1000, // 1 minute
  max: config.nodeEnv === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production, 1000 in development

  // Step 2: Use environment variables for configurable rate limit values
  message: 'Too many requests from this IP, please try again later.',

  // Step 3: Set up error handling for rate limit exceeded (429 status code)
  handler: (req: Request, res: Response) => {
    log.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    });
  },

  // Step 4: Log rate limit violations using the custom logger utility
  onLimitReached: (req: Request, res: Response, options: any) => {
    log.warn(`Rate limit reached for IP: ${req.ip}`);
  },

  // Step 5: Add rate limit headers to the response
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Step 6: Apply the rate limiter middleware to the request
  skip: (req: Request) => {
    // Optionally skip rate limiting for certain routes or conditions
    return req.path === '/health' || req.path === '/metrics';
  },
});

/**
 * Middleware function to apply rate limiting to specific routes.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const applyRateLimit = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter(req, res, next);
};

export default applyRateLimit;