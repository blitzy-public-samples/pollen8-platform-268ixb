import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { NetworkModule } from './modules/network/network.module';
import { InviteModule } from './modules/invite/invite.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DatabaseConfig } from './config/database.config';

/**
 * AppModule serves as the root module of the Pollen8 backend application,
 * orchestrating all other modules and defining the application's structure.
 * 
 * @description This module imports and configures all other modules and providers
 * needed for the Pollen8 backend.
 * 
 * Requirements addressed:
 * - Modular Architecture (Technical Specification/2. SYSTEM ARCHITECTURE/2.3.2 Backend Components)
 *   Implements a modular structure for the backend
 * - Database Integration (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 *   Configures database connection
 * - Authentication (Technical Specification/9. SECURITY CONSIDERATIONS/9.1 AUTHENTICATION AND AUTHORIZATION)
 *   Includes AuthModule for user authentication
 */
@Module({
  imports: [
    // Configure TypeORM with the database configuration
    TypeOrmModule.forRoot(DatabaseConfig),
    
    // Import all feature modules
    UserModule,
    AuthModule,
    NetworkModule,
    InviteModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}