import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';
import { config } from '../config/environment';

/**
 * This file contains the error handling middleware for the Pollen8 API, responsible for catching and formatting errors before sending responses to clients.
 * It addresses the following requirements:
 * 1. Consistent Error Responses (Technical Specification/System Design/API Design)
 * 2. Error Logging (Technical Specification/System Design/Monitoring and Incident Response)
 */

/**
 * Custom API Error class for handling application-specific errors
 */
export class APIError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface for consistent error formatting
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
}

/**
 * Central error handling middleware for the Pollen8 API
 * Catches all errors thrown during request processing, logs them, and sends a formatted error response to the client
 *
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Step 1: Log the error using the imported logger
  log.error(`Error: ${err.message}`, { stack: err.stack });

  // Step 2: Determine the error type (custom API error or generic server error)
  const statusCode = (err as APIError).statusCode || 500;
  const isOperational = (err as APIError).isOperational !== undefined ? (err as APIError).isOperational : true;

  // Step 3: Format the error response based on the environment
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: isOperational ? err.message : 'Internal Server Error',
    },
  };

  if (config.nodeEnv === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Step 4: Set the appropriate HTTP status code
  res.status(statusCode);

  // Step 5: Send the formatted error response as JSON
  res.json(errorResponse);
};

/**
 * Middleware to handle 404 Not Found errors
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new APIError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Async wrapper to catch errors in async route handlers
 *
 * @param fn - Async route handler function
 * @returns Wrapped function that catches and forwards errors to the error handler
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};