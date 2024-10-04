import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from '../modules/invite/invite.service';
import { InviteRepository } from '../modules/invite/invite.repository';
import { AnalyticsService } from '../modules/analytics/analytics.service';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { Invite } from '../modules/invite/invite.entity';
import { PaginatedResult } from '@shared/interfaces/paginated-result.interface';

describe('InviteService', () => {
  let inviteService: InviteService;
  let inviteRepository: jest.Mocked<InviteRepository>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  beforeEach(async () => {
    const mockInviteRepository = {
      createInvite: jest.fn(),
      getInvitesByUser: jest.fn(),
      updateInviteClicks: jest.fn(),
      getInviteAnalytics: jest.fn(),
    };

    const mockAnalyticsService = {
      trackEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteService,
        { provide: InviteRepository, useValue: mockInviteRepository },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compile();

    inviteService = module.get<InviteService>(InviteService);
    inviteRepository = module.get(InviteRepository) as jest.Mocked<InviteRepository>;
    analyticsService = module.get(AnalyticsService) as jest.Mocked<AnalyticsService>;
  });

  describe('generateInvite', () => {
    it('should generate a unique invite link', async () => {
      // Arrange
      const userId = 'user123';
      const inviteName = 'Test Invite';
      const mockInvite: Invite = {
        id: 'invite123',
        userId,
        name: inviteName,
        url: 'https://pollen8.com/invite/abc123',
        clickCount: 0,
        createdAt: new Date(),
      };
      inviteRepository.createInvite.mockResolvedValue(mockInvite);

      // Act
      const result = await inviteService.createInvite(userId, inviteName);

      // Assert
      expect(inviteRepository.createInvite).toHaveBeenCalledWith(userId, inviteName);
      expect(result).toEqual(mockInvite);
      expect(result.url).toBeDefined();
      expect(result.url).toContain('https://pollen8.com/invite/');
    });
  });

  describe('trackInviteClick', () => {
    it('should increment click count for valid invite', async () => {
      // Arrange
      const inviteId = 'invite123';

      // Act
      await inviteService.trackInviteClick(inviteId);

      // Assert
      expect(inviteRepository.updateInviteClicks).toHaveBeenCalledWith(inviteId);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith('invite_click', { inviteId });
    });

    it('should throw an error if updating click count fails', async () => {
      // Arrange
      const inviteId = 'invalidInvite';
      inviteRepository.updateInviteClicks.mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(inviteService.trackInviteClick(inviteId)).rejects.toThrow('Failed to track invite click');
    });
  });

  describe('getInviteAnalytics', () => {
    it('should return 30-day activity data', async () => {
      // Arrange
      const inviteId = 'invite123';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-30');
      const mockAnalyticsData = {
        inviteId,
        totalClicks: 100,
        clicksByDay: [/* ... mock daily click data ... */],
      };
      inviteRepository.getInviteAnalytics.mockResolvedValue(mockAnalyticsData);

      // Act
      const result = await inviteService.getInviteAnalytics(inviteId, startDate, endDate);

      // Assert
      expect(inviteRepository.getInviteAnalytics).toHaveBeenCalledWith(inviteId, startDate, endDate);
      expect(result).toBeDefined();
      expect(result.inviteId).toBe(inviteId);
      expect(result.totalClicks).toBe(100);
      expect(result.clicksPerDay).toBeDefined();
      expect(result.conversionRate).toBeDefined();
    });

    it('should throw an error for invalid date range', async () => {
      // Arrange
      const inviteId = 'invite123';
      const startDate = new Date('2023-01-30');
      const endDate = new Date('2023-01-01');

      // Act & Assert
      await expect(inviteService.getInviteAnalytics(inviteId, startDate, endDate)).rejects.toThrow('Start date must be before end date');
    });
  });

  describe('getInvitesByUser', () => {
    it('should return paginated invites for a user', async () => {
      // Arrange
      const userId = 'user123';
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockPaginatedResult: PaginatedResult<Invite> = {
        items: [/* ... mock invite objects ... */],
        total: 20,
        page: 1,
        limit: 10,
      };
      inviteRepository.getInvitesByUser.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await inviteService.getInvitesByUser(userId, paginationDto);

      // Assert
      expect(inviteRepository.getInvitesByUser).toHaveBeenCalledWith(userId, paginationDto.page, paginationDto.limit);
      expect(result).toEqual(mockPaginatedResult);
      expect(result.items.length).toBeLessThanOrEqual(paginationDto.limit);
    });
  });
});