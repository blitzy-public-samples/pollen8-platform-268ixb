import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../modules/analytics/analytics.service';
import { UserService } from '../modules/user/user.service';
import { NetworkService } from '../modules/network/network.service';
import { InviteService } from '../modules/invite/invite.service';
import { NetworkValueCalculator } from '../shared/utils/network-value-calculator.util';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let userServiceMock: jest.Mocked<UserService>;
  let networkServiceMock: jest.Mocked<UserService>;
  let inviteServiceMock: jest.Mocked<InviteService>;
  let networkValueCalculatorMock: jest.Mocked<NetworkValueCalculator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: UserService,
          useValue: {
            getUserActivityInPeriod: jest.fn(),
          },
        },
        {
          provide: NetworkService,
          useValue: {
            getNetworkSizeAtDate: jest.fn(),
            getNetworkSize: jest.fn(),
          },
        },
        {
          provide: InviteService,
          useValue: {
            getInvitesByUser: jest.fn(),
          },
        },
        {
          provide: NetworkValueCalculator,
          useValue: {
            calculate: jest.fn(),
          },
        },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    userServiceMock = module.get(UserService) as jest.Mocked<UserService>;
    networkServiceMock = module.get(NetworkService) as jest.Mocked<NetworkService>;
    inviteServiceMock = module.get(InviteService) as jest.Mocked<InviteService>;
    networkValueCalculatorMock = module.get(NetworkValueCalculator) as jest.Mocked<NetworkValueCalculator>;
  });

  it('should be defined', () => {
    expect(analyticsService).toBeDefined();
  });

  describe('calculateNetworkGrowth', () => {
    it('should calculate network growth correctly', async () => {
      // Arrange
      const userId = 'user123';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      networkServiceMock.getNetworkSizeAtDate.mockResolvedValueOnce(100).mockResolvedValueOnce(150);
      networkValueCalculatorMock.calculate.mockReturnValueOnce(314).mockReturnValueOnce(471);

      // Act
      const result = await analyticsService.calculateNetworkGrowth(userId, startDate, endDate);

      // Assert
      expect(result).toEqual({
        userId,
        startDate,
        endDate,
        startNetworkSize: 100,
        endNetworkSize: 150,
        newConnections: 50,
        growthRate: 50,
        averageGrowthPerDay: 1.6129032258064515,
        startNetworkValue: 314,
        endNetworkValue: 471,
        networkValueGrowth: 157,
      });
      expect(networkServiceMock.getNetworkSizeAtDate).toHaveBeenCalledTimes(2);
      expect(networkValueCalculatorMock.calculate).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if start date is after end date', async () => {
      // Arrange
      const userId = 'user123';
      const startDate = new Date('2023-01-31');
      const endDate = new Date('2023-01-01');

      // Act & Assert
      await expect(analyticsService.calculateNetworkGrowth(userId, startDate, endDate)).rejects.toThrow('Start date must be before end date');
    });
  });

  describe('getUserEngagement', () => {
    it('should retrieve user engagement data correctly', async () => {
      // Arrange
      const userId = 'user123';
      const period = '30d';
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      userServiceMock.getUserActivityInPeriod.mockResolvedValue({
        loginCount: 15,
        connectionInteractions: 50,
        invitesSent: 10,
        profileUpdates: 2,
      });

      // Act
      const result = await analyticsService.getUserEngagement(userId, period);

      // Assert
      expect(result).toEqual({
        userId,
        period,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        loginFrequency: 0.5,
        connectionInteractions: 50,
        invitesSent: 10,
        profileUpdates: 2,
        engagementScore: 22.7,
      });
      expect(userServiceMock.getUserActivityInPeriod).toHaveBeenCalledWith(userId, expect.any(Date), expect.any(Date));
    });
  });

  describe('getInviteEffectiveness', () => {
    it('should calculate invite effectiveness correctly', async () => {
      // Arrange
      const userId = 'user123';
      inviteServiceMock.getInvitesByUser.mockResolvedValue({
        items: [
          { clicks: 10, conversions: 2 },
          { clicks: 20, conversions: 5 },
          { clicks: 15, conversions: 3 },
        ],
        total: 3,
      });

      // Act
      const result = await analyticsService.getInviteEffectiveness(userId);

      // Assert
      expect(result).toEqual({
        userId,
        totalInvites: 3,
        totalClicks: 45,
        totalConversions: 10,
        clickThroughRate: 15,
        conversionRate: 0.2222222222222222,
        overallEffectiveness: 6.133333333333334,
      });
      expect(inviteServiceMock.getInvitesByUser).toHaveBeenCalledWith(userId, { page: 1, limit: 1000 });
    });
  });

  describe('getNetworkValue', () => {
    it('should calculate network value correctly', async () => {
      // Arrange
      const userId = 'user123';
      networkServiceMock.getNetworkSize.mockResolvedValue(100);
      networkValueCalculatorMock.calculate.mockReturnValue(314);

      // Act
      const result = await analyticsService.getNetworkValue(userId);

      // Assert
      expect(result).toBe(314);
      expect(networkServiceMock.getNetworkSize).toHaveBeenCalledWith(userId);
      expect(networkValueCalculatorMock.calculate).toHaveBeenCalledWith(100);
    });
  });
});