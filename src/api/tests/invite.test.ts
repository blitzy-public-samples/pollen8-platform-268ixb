import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from '../services/inviteService';
import { InviteRepository } from '../repositories/invite.repository';
import { InviteAnalyticsRepository } from '../repositories/invite-analytics.repository';
import { IInvite } from '../interfaces/invite.interface';
import { config } from '../config/environment';
import * as jwt from '../utils/jwt';

// Mock the external dependencies
jest.mock('../repositories/invite.repository');
jest.mock('../repositories/invite-analytics.repository');
jest.mock('../utils/jwt');
jest.mock('../config/environment', () => ({
  config: {
    appUrl: 'https://pollen8.com'
  }
}));

describe('InviteService', () => {
  let inviteService: InviteService;
  let inviteRepository: jest.Mocked<InviteRepository>;
  let inviteAnalyticsRepository: jest.Mocked<InviteAnalyticsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteService,
        InviteRepository,
        InviteAnalyticsRepository
      ],
    }).compile();

    inviteService = module.get<InviteService>(InviteService);
    inviteRepository = module.get(InviteRepository) as jest.Mocked<InviteRepository>;
    inviteAnalyticsRepository = module.get(InviteAnalyticsRepository) as jest.Mocked<InviteAnalyticsRepository>;

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('createInvite', () => {
    it('should create a new invite', async () => {
      // Arrange
      const userId = 'user123';
      const inviteName = 'Test Invite';
      const mockInvite: IInvite = {
        id: 'invite123',
        userId,
        name: inviteName,
        url: 'https://pollen8.com/invite/mockToken',
        clickCount: 0,
        createdAt: new Date()
      };
      (jwt.generateToken as jest.Mock).mockReturnValue('mockToken');
      inviteRepository.create.mockResolvedValue(mockInvite);

      // Act
      const result = await inviteService.createInvite(userId, inviteName);

      // Assert
      expect(result).toEqual(mockInvite);
      expect(inviteRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        name: inviteName,
        url: expect.stringContaining('/invite/mockToken')
      }));
    });
  });

  describe('getInviteByUrl', () => {
    it('should return an invite when found', async () => {
      // Arrange
      const mockInvite: IInvite = {
        id: 'invite123',
        userId: 'user123',
        name: 'Test Invite',
        url: 'https://pollen8.com/invite/mockToken',
        clickCount: 0,
        createdAt: new Date()
      };
      inviteRepository.findByUrl.mockResolvedValue(mockInvite);

      // Act
      const result = await inviteService.getInviteByUrl(mockInvite.url);

      // Assert
      expect(result).toEqual(mockInvite);
      expect(inviteRepository.findByUrl).toHaveBeenCalledWith(mockInvite.url);
    });

    it('should return null when invite is not found', async () => {
      // Arrange
      inviteRepository.findByUrl.mockResolvedValue(null);

      // Act
      const result = await inviteService.getInviteByUrl('https://pollen8.com/invite/nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('incrementClickCount', () => {
    it('should increment the click count and record analytics', async () => {
      // Arrange
      const mockInvite: IInvite = {
        id: 'invite123',
        userId: 'user123',
        name: 'Test Invite',
        url: 'https://pollen8.com/invite/mockToken',
        clickCount: 5,
        createdAt: new Date()
      };
      inviteRepository.findById.mockResolvedValue(mockInvite);

      // Act
      await inviteService.incrementClickCount(mockInvite.id);

      // Assert
      expect(inviteRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        ...mockInvite,
        clickCount: 6
      }));
      expect(inviteAnalyticsRepository.recordClick).toHaveBeenCalledWith(mockInvite.id, expect.any(Date));
    });

    it('should throw an error when invite is not found', async () => {
      // Arrange
      inviteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(inviteService.incrementClickCount('nonexistent')).rejects.toThrow('Invite not found');
    });
  });

  describe('getInvitesByUser', () => {
    it('should return all invites for a user', async () => {
      // Arrange
      const userId = 'user123';
      const mockInvites: IInvite[] = [
        {
          id: 'invite1',
          userId,
          name: 'Invite 1',
          url: 'https://pollen8.com/invite/token1',
          clickCount: 3,
          createdAt: new Date()
        },
        {
          id: 'invite2',
          userId,
          name: 'Invite 2',
          url: 'https://pollen8.com/invite/token2',
          clickCount: 1,
          createdAt: new Date()
        }
      ];
      inviteRepository.findByUserId.mockResolvedValue(mockInvites);

      // Act
      const result = await inviteService.getInvitesByUser(userId);

      // Assert
      expect(result).toEqual(mockInvites);
      expect(inviteRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('getInviteAnalytics', () => {
    it('should return processed analytics data', async () => {
      // Arrange
      const inviteId = 'invite123';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const mockAnalyticsData = [
        { date: '2023-01-15', clicks: 5 },
        { date: '2023-01-16', clicks: 3 }
      ];
      inviteAnalyticsRepository.getAnalytics.mockResolvedValue(mockAnalyticsData);

      // Act
      const result = await inviteService.getInviteAnalytics(inviteId, startDate, endDate);

      // Assert
      expect(result).toEqual(mockAnalyticsData); // Assuming no processing is done yet
      expect(inviteAnalyticsRepository.getAnalytics).toHaveBeenCalledWith(inviteId, startDate, endDate);
    });
  });
});