import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';

// Assuming these are set in the environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

/**
 * This function generates a new JWT token for a given payload.
 * @param payload - The data to be encoded in the JWT
 * @returns Generated JWT token
 */
export function generateToken(payload: JwtPayload): string {
  try {
    // Validate the payload
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload');
    }

    // Generate the JWT token using the payload and JWT configuration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // Return the generated token
    return token;
  } catch (error) {
    // Throw an error if token generation fails
    throw new Error(`Failed to generate token: ${error.message}`);
  }
}

/**
 * This function verifies the validity of a given JWT token and returns the decoded payload if valid.
 * @param token - The JWT token to verify
 * @returns Decoded payload if token is valid, null otherwise
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    // Attempt to verify the token using the JWT configuration
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check for token expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    // Return the decoded payload if valid
    return decoded;
  } catch (error) {
    // Return null if the token is invalid or verification fails
    return null;
  }
}

/**
 * This function decodes a JWT token without verifying its signature, useful for extracting payload data when verification is not necessary.
 * @param token - The JWT token to decode
 * @returns Decoded payload if token can be decoded, null otherwise
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    // Attempt to decode the token without verification
    const decoded = jwt.decode(token) as JwtPayload;

    // Return the decoded payload if successful
    return decoded;
  } catch (error) {
    // Return null if the token cannot be decoded
    return null;
  }
}

// Export the JwtPayload type for use in other files
export { JwtPayload };