import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface';
import { AuthMiddleware } from '../middleware/auth';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Industry } from '../shared/types/industry';
import { Interest } from '../shared/types/interest';
import * as phoneVerification from '../utils/phoneVerification';
import * as jwtUtil from '../utils/jwt';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<Repository<User>>;
  let mockIndustryRepository: jest.Mocked<Repository<Industry>>;
  let mockInterestRepository: jest.Mocked<Repository<Interest>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Industry),
          useValue: {
            findByIds: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Interest),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mockUserRepository = module.get(getRepositoryToken(User));
    mockIndustryRepository = module.get(getRepositoryToken(Industry));
    mockInterestRepository = module.get(getRepositoryToken(Interest));
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['1', '2', '3'],
        interests: ['1', '2', '3'],
        city: 'New York',
        zipCode: '10001',
      };
      const mockUser = { id: '1', ...createUserDto };
      jest.spyOn(phoneVerification, 'verifyPhoneNumber').mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(null);
      mockIndustryRepository.findByIds.mockResolvedValue([{}, {}, {}] as Industry[]);
      mockInterestRepository.findByIds.mockResolvedValue([{}, {}, {}] as Interest[]);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await userService.register(createUserDto);

      // Assert
      expect(result).toEqual(mockUser);
      expect(phoneVerification.verifyPhoneNumber).toHaveBeenCalledWith(createUserDto.phoneNumber);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { phoneNumber: createUserDto.phoneNumber } });
      expect(mockIndustryRepository.findByIds).toHaveBeenCalledWith(createUserDto.industries);
      expect(mockInterestRepository.findByIds).toHaveBeenCalledWith(createUserDto.interests);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if phone verification fails', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['1', '2', '3'],
        interests: ['1', '2', '3'],
        city: 'New York',
        zipCode: '10001',
      };
      jest.spyOn(phoneVerification, 'verifyPhoneNumber').mockResolvedValue(false);

      // Act & Assert
      await expect(userService.register(createUserDto)).rejects.toThrow('Phone number verification failed');
    });

    it('should throw an error if user already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['1', '2', '3'],
        interests: ['1', '2', '3'],
        city: 'New York',
        zipCode: '10001',
      };
      jest.spyOn(phoneVerification, 'verifyPhoneNumber').mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue({} as User);

      // Act & Assert
      await expect(userService.register(createUserDto)).rejects.toThrow('User with this phone number already exists');
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user successfully', async () => {
      // Arrange
      const phone = '+1234567890';
      const mockUser = { id: '1', phoneNumber: phone };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(jwtUtil, 'generateToken').mockReturnValue('mock-token');

      // Act
      const result = await userService.authenticate(phone);

      // Assert
      expect(result).toEqual({ user: mockUser, token: 'mock-token' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { phoneNumber: phone } });
      expect(jwtUtil.generateToken).toHaveBeenCalledWith(mockUser.id);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const phone = '+1234567890';
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.authenticate(phone)).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        city: 'Los Angeles',
        zipCode: '90001',
        industries: ['4', '5', '6'],
        interests: ['4', '5', '6'],
      };
      const mockUser = { id: userId, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockIndustryRepository.findByIds.mockResolvedValue([{}, {}, {}] as Industry[]);
      mockInterestRepository.findByIds.mockResolvedValue([{}, {}, {}] as Interest[]);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await userService.updateProfile(userId, updateUserDto);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockIndustryRepository.findByIds).toHaveBeenCalledWith(updateUserDto.industries);
      expect(mockInterestRepository.findByIds).toHaveBeenCalledWith(updateUserDto.interests);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        city: 'Los Angeles',
        zipCode: '90001',
      };
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateProfile(userId, updateUserDto)).rejects.toThrow('User not found');
    });
  });
});

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(async () => {
    mockUserService = {
      getUserById: jest.fn(),
      updateProfile: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      // Arrange
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockReq = { user: mockUser } as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      mockUserService.getUserById.mockResolvedValue(mockUser);

      // Act
      await userController.getProfile(mockReq, mockRes);

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors when getting user profile', async () => {
      // Arrange
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockReq = { user: mockUser } as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      mockUserService.getUserById.mockRejectedValue(new Error('Test error'));

      // Act
      await userController.getProfile(mockReq, mockRes);

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error retrieving user profile',
        error: 'Test error',
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const updateData = { city: 'New York', zipCode: '10001' };
      const mockReq = { user: mockUser, body: updateData } as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      mockUserService.updateProfile.mockResolvedValue({ ...mockUser, ...updateData });

      // Act
      await userController.updateProfile(mockReq, mockRes);

      // Assert
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(mockUser.id, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ ...mockUser, ...updateData });
    });

    it('should handle errors when updating user profile', async () => {
      // Arrange
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const updateData = { city: 'New York', zipCode: '10001' };
      const mockReq = { user: mockUser, body: updateData } as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      mockUserService.updateProfile.mockRejectedValue(new Error('Test error'));

      // Act
      await userController.updateProfile(mockReq, mockRes);

      // Assert
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(mockUser.id, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error updating user profile',
        error: 'Test error',
      });
    });
  });

  // Additional tests for updateIndustries, updateInterests, and updateLocation methods can be added here
  // following a similar pattern to the updateProfile test
});