import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteService } from './invite.service';
import { InviteEntity } from './invite.entity';
import { InviteRepository } from './invite.repository';
import { UserModule } from '../user/user.module';

/**
 * InviteModule class for encapsulating all invite-related functionality in the Pollen8 backend application.
 * @description This module organizes and provides invite-related components of the application.
 * @requirements Invite System - Technical Specification/1.1 System Objectives/Strategic Growth Tools
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([InviteEntity, InviteRepository]),
    UserModule, // Import UserModule for user-related functionality
  ],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}