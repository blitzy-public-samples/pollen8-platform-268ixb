import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { User } from '../interfaces/user.interface';

/**
 * This middleware function is responsible for authenticating users for protected routes.
 * It addresses the following requirements:
 * - User Authentication: Ensure that only authenticated users can access protected routes
 *   (Technical Specification/1.1 System Objectives/Verified Connections)
 * - JWT Validation: Validate JSON Web Tokens for secure API access
 *   (Technical Specification/9.1 Authentication and Authorization/9.1.3 Token Management)
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify the token using the verifyToken function from jwt utils
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      throw new JsonWebTokenError('Invalid token');
    }

    // TODO: Retrieve the user from the database using the decoded token information
    // This is a placeholder and should be replaced with actual database query
    const user: User = {
      id: decodedToken.id,
      phoneNumber: decodedToken.phoneNumber,
      city: '',
      zipCode: '',
      industries: [],
      interests: [],
      createdAt: new Date(),
      lastLogin: new Date()
    };

    if (!user) {
      throw new Error('User not found');
    }

    // Attach the user object to the request for use in subsequent middleware or route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of errors
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.message === 'No token provided') {
      return res.status(401).json({ message: 'No token provided' });
    } else if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    } else {
      // For any other unexpected errors
      console.error('Authentication error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}