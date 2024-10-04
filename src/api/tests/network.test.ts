import { Test, TestingModule } from '@nestjs/testing';
import { NetworkService } from '../services/networkService';
import { NetworkController } from '../controllers/networkController';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from '../../shared/types/connection';
import { User } from '../interfaces/user.interface';
import { NetworkStats, NetworkGraph, NetworkFilter, NetworkQueryParams, NetworkQueryResponse } from '../interfaces/network.interface';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('NetworkService', () => {
  let networkService: NetworkService;
  let mockConnectionRepository: jest.Mocked<any>;
  let mockUserRepository: jest.Mocked<any>;

  beforeEach(async () => {
    mockConnectionRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    mockUserRepository = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkService,
        {
          provide: getRepositoryToken(Connection),
          useValue: mockConnectionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    networkService = module.get<NetworkService>(NetworkService);
  });

  describe('getNetworkStats', () => {
    it('should return network statistics', async () => {
      const userId = 'testUserId';
      const mockConnections = [
        { connectionValue: 3.14 },
        { connectionValue: 3.14 },
      ];
      mockConnectionRepository.find.mockResolvedValue(mockConnections);

      const result = await networkService.getNetworkStats(userId);

      expect(result).toHaveProperty('totalConnections', 2);
      expect(result).toHaveProperty('totalValue', 6.28);
      expect(result).toHaveProperty('growthRate');
      expect(result).toHaveProperty('topIndustries');
    });
  });

  describe('getNetworkGraph', () => {
    it('should return a network graph', async () => {
      const userId = 'testUserId';
      const mockConnections = [
        { userId: 'user1', connectedUserId: 'user2', connectionValue: 3.14 },
        { userId: 'user1', connectedUserId: 'user3', connectionValue: 3.14 },
      ];
      mockConnectionRepository.find.mockResolvedValue(mockConnections);
      mockUserRepository.findByIds.mockResolvedValue([
        { id: 'user1', phoneNumber: '1234567890', industries: [{ name: 'Tech' }] },
        { id: 'user2', phoneNumber: '2345678901', industries: [{ name: 'Finance' }] },
        { id: 'user3', phoneNumber: '3456789012', industries: [{ name: 'Healthcare' }] },
      ]);

      const result = await networkService.getNetworkGraph(userId);

      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
    });
  });

  describe('addConnection', () => {
    it('should add a new connection', async () => {
      const userId = 'user1';
      const connectionId = 'user2';
      mockUserRepository.findByIds.mockResolvedValue([{ id: userId }, { id: connectionId }]);
      mockConnectionRepository.findOne.mockResolvedValue(null);
      mockConnectionRepository.create.mockReturnValue({ userId, connectedUserId: connectionId });
      mockConnectionRepository.save.mockResolvedValue({ id: 'newConnectionId', userId, connectedUserId: connectionId });

      const result = await networkService.addConnection(userId, connectionId);

      expect(result).toHaveProperty('id', 'newConnectionId');
      expect(result).toHaveProperty('userId', userId);
      expect(result).toHaveProperty('connectedUserId', connectionId);
    });

    it('should throw an error if connection already exists', async () => {
      const userId = 'user1';
      const connectionId = 'user2';
      mockUserRepository.findByIds.mockResolvedValue([{ id: userId }, { id: connectionId }]);
      mockConnectionRepository.findOne.mockResolvedValue({ id: 'existingConnectionId' });

      await expect(networkService.addConnection(userId, connectionId)).rejects.toThrow('Connection already exists');
    });
  });

  describe('removeConnection', () => {
    it('should remove an existing connection', async () => {
      const userId = 'user1';
      const connectionId = 'user2';
      mockUserRepository.findByIds.mockResolvedValue([{ id: userId }, { id: connectionId }]);
      mockConnectionRepository.findOne.mockResolvedValue({ id: 'existingConnectionId' });

      await networkService.removeConnection(userId, connectionId);

      expect(mockConnectionRepository.remove).toHaveBeenCalled();
    });

    it('should throw an error if connection does not exist', async () => {
      const userId = 'user1';
      const connectionId = 'user2';
      mockUserRepository.findByIds.mockResolvedValue([{ id: userId }, { id: connectionId }]);
      mockConnectionRepository.findOne.mockResolvedValue(null);

      await expect(networkService.removeConnection(userId, connectionId)).rejects.toThrow('Connection does not exist');
    });
  });

  describe('getConnections', () => {
    it('should return connections with stats and growth metrics', async () => {
      const userId = 'testUserId';
      const params: NetworkQueryParams = { userId, skip: 0, take: 10 };
      mockConnectionRepository.getManyAndCount.mockResolvedValue([[{ id: 'conn1' }, { id: 'conn2' }], 2]);

      const result = await networkService.getConnections(params);

      expect(result).toHaveProperty('connections');
      expect(result).toHaveProperty('totalCount', 2);
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('growthMetrics');
    });
  });
});

describe('NetworkController', () => {
  let networkController: NetworkController;
  let mockNetworkService: jest.Mocked<NetworkService>;

  beforeEach(async () => {
    mockNetworkService = {
      getNetworkGraph: jest.fn(),
      addConnection: jest.fn(),
      removeConnection: jest.fn(),
      getNetworkStats: jest.fn(),
      getConnections: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkController],
      providers: [
        {
          provide: NetworkService,
          useValue: mockNetworkService,
        },
      ],
    }).compile();

    networkController = module.get<NetworkController>(NetworkController);
  });

  describe('getNetwork', () => {
    it('should return a network graph', async () => {
      const mockReq = { user: { id: 'testUserId' }, query: {} } as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;
      const mockGraph: NetworkGraph = { nodes: [], edges: [] };

      mockNetworkService.getNetworkGraph.mockResolvedValue(mockGraph);

      await networkController.getNetwork(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockGraph);
    });
  });

  describe('addConnection', () => {
    it('should add a new connection', async () => {
      const mockReq = { user: { id: 'testUserId' }, body: { connectionId: 'testConnectionId' } } as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;
      const mockConnection: Connection = { id: 'newConnectionId', userId: 'testUserId', connectedUserId: 'testConnectionId' } as Connection;

      mockNetworkService.addConnection.mockResolvedValue(mockConnection);

      await networkController.addConnection(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith(mockConnection);
    });

    it('should return bad request if connectionId is missing', async () => {
      const mockReq = { user: { id: 'testUserId' }, body: {} } as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await networkController.addConnection(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Connection ID is required' });
    });
  });

  describe('removeConnection', () => {
    it('should remove a connection', async () => {
      const mockReq = { user: { id: 'testUserId' }, params: { connectionId: 'testConnectionId' } } as unknown as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await networkController.removeConnection(mockReq, mockRes, mockNext);

      expect(mockNetworkService.removeConnection).toHaveBeenCalledWith('testUserId', 'testConnectionId');
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('getNetworkAnalytics', () => {
    it('should return network analytics', async () => {
      const mockReq = { user: { id: 'testUserId' } } as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;
      const mockStats: NetworkStats = { totalConnections: 10, totalValue: 31.4, growthRate: 0.05, topIndustries: [] };

      mockNetworkService.getNetworkStats.mockResolvedValue(mockStats);

      await networkController.getNetworkAnalytics(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockStats);
    });
  });

  describe('getConnections', () => {
    it('should return connections with query parameters', async () => {
      const mockReq = { user: { id: 'testUserId' }, query: { skip: '0', take: '10' } } as unknown as Request;
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;
      const mockResponse: NetworkQueryResponse = {
        connections: [],
        totalCount: 0,
        stats: { totalConnections: 0, totalValue: 0, growthRate: 0, topIndustries: [] },
        growthMetrics: { newConnections: 0, valueIncrease: 0, growthPercentage: 0, mostActiveIndustries: [] }
      };

      mockNetworkService.getConnections.mockResolvedValue(mockResponse);

      await networkController.getConnections(mockReq, mockRes, mockNext);

      expect(mockNetworkService.getConnections).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'testUserId',
        skip: 0,
        take: 10
      }));
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
  });
});