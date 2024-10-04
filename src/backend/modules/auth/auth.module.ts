import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConfig } from '../../config/jwt.config';
import { twilioConfig } from '../../config/twilio.config';

/**
 * AuthModule for the Pollen8 backend application
 * 
 * This module is responsible for handling authentication-related functionality,
 * including user authentication, JWT token management, and phone number verification.
 * 
 * @requirements User Authentication - Technical specification/1.1 System Objectives/Verified Connections
 * @description Implements phone number verification for user authentication
 */
@Global()
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'TWILIO_CONFIG',
      useValue: twilioConfig,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    // Validate Twilio configuration on module initialization
    const { validateTwilioConfig } = require('../../config/twilio.config');
    validateTwilioConfig();
  }
}