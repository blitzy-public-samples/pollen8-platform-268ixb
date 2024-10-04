import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UserModule } from '../user/user.module';
import { NetworkModule } from '../network/network.module';
import { InviteModule } from '../invite/invite.module';
import { NetworkValueCalculator } from '../../shared/utils/network-value-calculator.util';

/**
 * AnalyticsModule for the Pollen8 backend application
 * @description This module organizes and encapsulates analytics-related functionality
 * @requirements Analytics Integration - Technical Specification/1.1 System Objectives/Quantifiable Networking
 */
@Module({
  imports: [
    UserModule,
    NetworkModule,
    InviteModule
  ],
  providers: [
    AnalyticsService,
    NetworkValueCalculator
  ],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}