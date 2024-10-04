import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Req, Res, Next, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { InviteService } from '../services/inviteService';
import { IInvite } from '../interfaces/invite.interface';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateInviteDto, GetInviteAnalyticsDto } from '../dto/invite.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

/**
 * InviteController handles HTTP requests related to invite functionality.
 * It addresses the following requirements from the Technical Specification/1.1 System Objectives/Strategic Growth Tools:
 * - Handle creation of unique invite links
 * - Manage tracking of invite clicks and activity
 */
@ApiTags('Invites')
@Controller('invites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   * Handles the creation of a new invite link for a user.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Create a new invite link' })
  @ApiResponse({ status: 201, description: 'The invite has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createInvite(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body(new ValidationPipe()) createInviteDto: CreateInviteDto
  ): Promise<void> {
    try {
      const userId = req.user['id']; // Assuming the user ID is attached to the request by the auth middleware
      const invite: IInvite = await this.inviteService.createInvite(userId, createInviteDto.name);
      res.status(HttpStatus.CREATED).json(invite);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves analytics data for a user's invite links.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @Get('analytics')
  @Roles('user')
  @ApiOperation({ summary: 'Get invite analytics' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved invite analytics.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getInviteAnalytics(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Query(new ValidationPipe()) getInviteAnalyticsDto: GetInviteAnalyticsDto
  ): Promise<void> {
    try {
      const userId = req.user['id'];
      const { inviteId, startDate, endDate } = getInviteAnalyticsDto;
      const analytics = await this.inviteService.getInviteAnalytics(inviteId, new Date(startDate), new Date(endDate));
      res.status(HttpStatus.OK).json(analytics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Records a click event for a specific invite link.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  @Put('track/:inviteUrl')
  @ApiOperation({ summary: 'Track invite link click' })
  @ApiResponse({ status: 200, description: 'Successfully tracked invite click.' })
  @ApiResponse({ status: 404, description: 'Invite not found.' })
  async trackInviteClick(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('inviteUrl') inviteUrl: string
  ): Promise<void> {
    try {
      const invite = await this.inviteService.getInviteByUrl(inviteUrl);
      if (!invite) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Invite not found' });
        return;
      }
      await this.inviteService.incrementClickCount(invite.id);
      res.status(HttpStatus.OK).json({ message: 'Invite click tracked successfully' });
    } catch (error) {
      next(error);
    }
  }
}