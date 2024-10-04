import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from '../utils/errors';

/**
 * Creates a middleware function that validates the request body against a provided DTO class.
 * This middleware ensures that all incoming API requests are properly validated before being processed by the controllers.
 * 
 * @param dtoClass - The class to validate the request body against
 * @returns An Express middleware function
 */
export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Transform the request body to an instance of the provided DTO class
      const dtoInstance = plainToClass(dtoClass, req.body);

      // Validate the transformed object using class-validator
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        // If validation fails, throw a ValidationError with details
        const validationErrors = errors.map(error => ({
          property: error.property,
          constraints: error.constraints
        }));
        throw new ValidationError('Validation failed', validationErrors);
      }

      // If validation succeeds, attach the validated DTO to the request and call the next middleware
      req.body = dtoInstance;
      next();
    } catch (error) {
      // Pass any errors to the next middleware (likely an error handler)
      next(error);
    }
  };
}

/**
 * This file implements the validation middleware for the Pollen8 API.
 * It addresses the following requirement:
 * - Input Validation (Technical specification/1.1 System Objectives/Security Measures)
 */