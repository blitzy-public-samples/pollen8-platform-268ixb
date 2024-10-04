import { Controller, Get, Post, Delete, Req, Res, Next, HttpStatus, UseGuards, Body, Param, Query } from '@nestjs/common';
import { NetworkService } from '../services/networkService';
import { AuthGuard } from '@nestjs/passport';
import { NetworkStats, NetworkGraph, NetworkFilter, NetworkSortOption, NetworkQueryParams, NetworkQueryResponse } from '../interfaces/network.interface';
import { Connection } from '../../shared/types/connection';
import { Request, Response, NextFunction } from 'express';

@Controller('network')
@UseGuards(AuthGuard('jwt'))
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  /**
   * Retrieves the network graph for the authenticated user.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  @Get('graph')
  async getNetwork(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userId = req.user['id'];
      const filter: NetworkFilter = req.query.filter as NetworkFilter;
      const networkGraph: NetworkGraph = await this.networkService.getNetworkGraph(userId, filter);
      res.status(HttpStatus.OK).json(networkGraph);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adds a new connection to the user's network.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  @Post('connection')
  async addConnection(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userId = req.user['id'];
      const { connectionId } = req.body;
      if (!connectionId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Connection ID is required' });
        return;
      }
      const newConnection: Connection = await this.networkService.addConnection(userId, connectionId);
      res.status(HttpStatus.CREATED).json(newConnection);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes a connection from the user's network.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  @Delete('connection/:connectionId')
  async removeConnection(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userId = req.user['id'];
      const { connectionId } = req.params;
      await this.networkService.removeConnection(userId, connectionId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves analytics data for the user's network.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  @Get('analytics')
  async getNetworkAnalytics(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userId = req.user['id'];
      const networkStats: NetworkStats = await this.networkService.getNetworkStats(userId);
      res.status(HttpStatus.OK).json(networkStats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a list of connections for the user with optional sorting and filtering.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  @Get('connections')
  async getConnections(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userId = req.user['id'];
      const { skip, take, sortBy, sortOrder, filters } = req.query;
      const params: NetworkQueryParams = {
        userId,
        skip: Number(skip) || 0,
        take: Number(take) || 10,
        sortBy: sortBy as NetworkSortOption,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        filters: filters as NetworkFilter
      };
      const response: NetworkQueryResponse = await this.networkService.getConnections(params);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}