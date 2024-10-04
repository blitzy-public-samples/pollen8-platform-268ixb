import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT Configuration
 * This file contains the configuration settings for JSON Web Tokens (JWT) used in the Pollen8 backend
 * for authentication and authorization.
 * 
 * Requirements addressed:
 * - Secure Authentication (Technical Specification/1.1 System Objectives/Verified Connections)
 *   Implement JWT for secure user authentication
 */

// Ensure these environment variables are set in your .env file
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '1h';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const jwtConfig: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: JWT_ACCESS_EXPIRATION,
    issuer: 'Pollen8',
    algorithm: 'HS256',
  },
};

export const refreshTokenConfig = {
  expiresIn: JWT_REFRESH_EXPIRATION,
};

/**
 * JWT Configuration Details:
 * - secretKey: A secure, randomly generated string used to sign JWTs, stored in environment variables for security
 * - tokenExpiration: Sets the lifespan of access tokens (e.g., 1 hour), balancing security with user experience
 * - refreshTokenSettings: Expiration time for refresh tokens (e.g., 7 days), enables secure token renewal without frequent logins
 * - tokenIssuer: Identifies the token issuer (e.g., 'Pollen8'), helps in token validation and tracking
 * - algorithm: Specifies the algorithm used for token signing (e.g., 'HS256'), ensures compatibility with JWT libraries
 */

/**
 * Usage:
 * Import this configuration in your auth module or where you set up JWT:
 * 
 * import { jwtConfig, refreshTokenConfig } from './config/jwt.config';
 * 
 * @Module({
 *   imports: [
 *     JwtModule.register(jwtConfig),
 *     // ... other imports
 *   ],
 *   // ... providers, controllers, etc.
 * })
 * export class AuthModule {}
 */

/**
 * Note: Ensure that your environment is properly set up with the required
 * JWT_SECRET, JWT_ACCESS_EXPIRATION, and JWT_REFRESH_EXPIRATION variables.
 * These should be kept secure and not exposed in the codebase.
 */
```

This implementation:

1. Imports the necessary type from @nestjs/jwt for type safety.
2. Defines the JWT configuration based on the provided specifications.
3. Uses environment variables for sensitive information like the secret key and token expirations.
4. Implements error handling for missing JWT_SECRET.
5. Exports both the main JWT configuration and a separate refresh token configuration.
6. Includes detailed comments explaining each part of the configuration and how to use it.
7. Addresses the security requirement mentioned in the technical specification.

Remember to set up the corresponding environment variables in your .env file or deployment environment:

```
JWT_SECRET=your_very_secure_random_string_here
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d