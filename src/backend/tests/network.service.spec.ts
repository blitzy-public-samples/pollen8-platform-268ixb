import { Test, TestingModule } from '@nestjs/testing';
import { NetworkService } from '../modules/network/network.service';
import { NetworkRepository } from '../modules/network/network.repository';
import { UserService } from '../modules/user/user.service';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { NetworkEntity } from '../modules/network/network.entity';
import { calculateNetworkValue } from '../shared/utils/network-value-calculator.util';

jest.mock('../shared/utils/network-value-calculator.util');

describe('NetworkService', () => {
  let networkService: NetworkService;
  let networkRepository: NetworkRepository;
  let userService: UserService;

  const mockNetworkRepository = {
    findConnectionsByUserId: jest.fn(),
    findOne: jest.fn(),
    createConnection: jest.fn(),
    removeConnection: jest.fn(),
    getNetworkSize: jest.fn(),
  };

  const mockUserService = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkService,
        {
          provide: NetworkRepository,
          useValue: mockNetworkRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    networkService = module.get<NetworkService>(NetworkService);
    networkRepository = module.get<NetworkRepository>(NetworkRepository);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(networkService).toBeDefined();
  });

  describe('getNetworkForUser', () => {
    it('should retrieve user connections with pagination', async () => {
      const userId = 'user123';
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockConnections: NetworkEntity[] = [
        { id: 'conn1', userId: 'user123', connectedUserId: 'user456' },
        { id: 'conn2', userId: 'user123', connectedUserId: 'user789' },
      ];
      const mockPaginatedResult = {
        items: mockConnections,
        total: 2,
        page: 1,
        limit: 10,
      };

      mockNetworkRepository.findConnectionsByUserId.mockResolvedValue(mockPaginatedResult);

      const result = await networkService.getNetworkForUser(userId, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockNetworkRepository.findConnectionsByUserId).toHaveBeenCalledWith(userId, paginationDto);
    });
  });

  describe('createConnection', () => {
    it('should create a new connection between users', async () => {
      const userId = 'user123';
      const connectedUserId = 'user456';
      const mockConnection: NetworkEntity = { id: 'conn1', userId, connectedUserId };

      mockUserService.getUserById.mockResolvedValue({});
      mockNetworkRepository.findOne.mockResolvedValue(null);
      mockNetworkRepository.createConnection.mockResolvedValue(mockConnection);

      const result = await networkService.createConnection(userId, connectedUserId);

      expect(result).toEqual(mockConnection);
      expect(mockUserService.getUserById).toHaveBeenCalledTimes(2);
      expect(mockNetworkRepository.findOne).toHaveBeenCalled();
      expect(mockNetworkRepository.createConnection).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if connection already exists', async () => {
      const userId = 'user123';
      const connectedUserId = 'user456';

      mockUserService.getUserById.mockResolvedValue({});
      mockNetworkRepository.findOne.mockResolvedValue({ id: 'existingConn' });

      await expect(networkService.createConnection(userId, connectedUserId)).rejects.toThrow('Connection already exists');
    });
  });

  describe('removeConnection', () => {
    it('should remove an existing connection between users', async () => {
      const userId = 'user123';
      const connectedUserId = 'user456';

      mockNetworkRepository.findOne.mockResolvedValue({ id: 'existingConn' });

      await networkService.removeConnection(userId, connectedUserId);

      expect(mockNetworkRepository.removeConnection).toHaveBeenCalledWith(userId, connectedUserId);
    });

    it('should throw an error if connection does not exist', async () => {
      const userId = 'user123';
      const connectedUserId = 'user456';

      mockNetworkRepository.findOne.mockResolvedValue(null);

      await expect(networkService.removeConnection(userId, connectedUserId)).rejects.toThrow('Connection does not exist');
    });
  });

  describe('calculateNetworkValue', () => {
    it('should calculate the network value based on network size', async () => {
      const userId = 'user123';
      const networkSize = 10;
      const expectedValue = 31.4; // 3.14 * 10

      mockNetworkRepository.getNetworkSize.mockResolvedValue(networkSize);
      (calculateNetworkValue as jest.Mock).mockReturnValue(expectedValue);

      const result = await networkService.calculateNetworkValue(userId);

      expect(result).toBe(expectedValue);
      expect(mockNetworkRepository.getNetworkSize).toHaveBeenCalledWith(userId);
      expect(calculateNetworkValue).toHaveBeenCalledWith(networkSize);
    });
  });

  describe('getNetworkAnalytics', () => {
    it('should return network analytics data', async () => {
      const userId = 'user123';
      const mockConnections = [
        { id: 'conn1', userId: 'user123', connectedUserId: 'user456' },
        { id: 'conn2', userId: 'user123', connectedUserId: 'user789' },
      ];
      const mockPaginatedResult = {
        items: mockConnections,
        total: 2,
        page: 1,
        limit: 1000,
      };

      mockNetworkRepository.findConnectionsByUserId.mockResolvedValue(mockPaginatedResult);
      mockNetworkRepository.getNetworkSize.mockResolvedValue(2);
      (calculateNetworkValue as jest.Mock).mockReturnValue(6.28);

      const result = await networkService.getNetworkAnalytics(userId);

      expect(result).toEqual({
        networkSize: 2,
        networkValue: 6.28,
        growthRate: expect.any(Number),
        industryDistribution: expect.any(Object),
        connections: mockConnections,
      });
    });
  });
});