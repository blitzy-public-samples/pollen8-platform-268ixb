import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { RolesGuard } from '@shared/guards/roles.guard';

/**
 * UserModule class that encapsulates all user-related functionality in the Pollen8 backend application.
 * @description This module organizes user-related components and dependencies.
 * @requirements User Management - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Modular Architecture - Technical Specification/2. System Architecture/2.3.2 Backend Components
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
  ],
  providers: [
    UserService,
    RolesGuard,
  ],
  exports: [UserService],
})
export class UserModule {}