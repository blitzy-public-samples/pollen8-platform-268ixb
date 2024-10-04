import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { jwtConfig } from '../../config/jwt.config';

/**
 * JWT Strategy for Authentication
 * This class implements the JWT strategy for Passport authentication in NestJS.
 * 
 * Requirements addressed:
 * - Secure Authentication (Technical Specification/1.1 System Objectives/Verified Connections)
 *   Implement JWT-based authentication for API endpoints
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  /**
   * Validates the JWT payload and returns the user if valid.
   * @param payload - The decoded JWT payload
   * @returns The validated user object or null
   */
  async validate(payload: any): Promise<any> {
    const userId = payload.sub; // 'sub' is the standard claim for the subject (user ID)
    const user = await this.userService.findUserById(userId);
    
    if (!user) {
      return null; // This will result in an Unauthorized exception
    }
    
    // You can add additional checks here, e.g., checking if the user is still active
    
    // Return the user object, which will be added to the Request object
    return user;
  }
}

/**
 * Usage:
 * 1. Import and add this strategy to your AuthModule providers:
 *    @Module({
 *      imports: [PassportModule, JwtModule.register(jwtConfig)],
 *      providers: [AuthService, JwtStrategy],
 *      // ...
 *    })
 *    export class AuthModule {}
 * 
 * 2. Use the JWT authentication guard in your controllers:
 *    @UseGuards(JwtAuthGuard)
 *    @Get('profile')
 *    getProfile(@Request() req) {
 *      return req.user;
 *    }
 * 
 * Note: Ensure that the UserService is properly implemented and injected,
 * and that the jwtConfig is correctly set up as shown in the jwt.config.ts file.
 */