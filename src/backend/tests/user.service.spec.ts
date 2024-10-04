import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../modules/user/user.service';
import { UserRepository } from '../modules/user/user.repository';
import { User } from '../modules/user/user.entity';
import { PaginatedResult } from '../shared/interfaces/paginated-result.interface';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { UpdateUserDto } from '../modules/user/dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { phoneVerificationUtil } from '../shared/utils/phone-verification.util';

jest.mock('../shared/utils/phone-verification.util');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findByIdWithIndustriesAndInterests: jest.fn(),
    findByPhoneNumber: jest.fn(),
    findAllPaginated: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['Tech', 'Finance', 'Healthcare'],
        interests: ['AI', 'Blockchain', 'IoT'],
        city: 'New York',
        zipCode: '10001',
      };
      const mockUser = { id: '1', ...createUserDto };

      userRepository.findByPhoneNumber.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith(createUserDto.phoneNumber);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if industries or interests are less than 3', async () => {
      const invalidUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['Tech', 'Finance'],
        interests: ['AI', 'Blockchain'],
        city: 'New York',
        zipCode: '10001',
      };

      await expect(userService.createUser(invalidUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user with phone number already exists', async () => {
      const existingUserDto: CreateUserDto = {
        phoneNumber: '+1234567890',
        industries: ['Tech', 'Finance', 'Healthcare'],
        interests: ['AI', 'Blockchain', 'IoT'],
        city: 'New York',
        zipCode: '10001',
      };

      userRepository.findByPhoneNumber.mockResolvedValue({ id: '1' } as User);

      await expect(userService.createUser(existingUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890' } as User;
      userRepository.findByIdWithIndustriesAndInterests.mockResolvedValue(mockUser);

      const result = await userService.findUserById('1');

      expect(result).toEqual(mockUser);
      expect(userRepository.findByIdWithIndustriesAndInterests).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findByIdWithIndustriesAndInterests.mockResolvedValue(null);

      await expect(userService.findUserById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserByPhoneNumber', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890' } as User;
      userRepository.findByPhoneNumber.mockResolvedValue(mockUser);

      const result = await userService.findUserByPhoneNumber('+1234567890');

      expect(result).toEqual(mockUser);
      expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith('+1234567890');
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findByPhoneNumber.mockResolvedValue(null);

      await expect(userService.findUserByPhoneNumber('+1234567890')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        industries: ['Tech', 'Finance', 'Healthcare', 'Education'],
        interests: ['AI', 'Blockchain', 'IoT', 'Machine Learning'],
        city: 'San Francisco',
        zipCode: '94105',
      };
      const mockUser = { id: '1', ...updateUserDto } as User;

      userRepository.findByIdWithIndustriesAndInterests.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await userService.updateUser('1', updateUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByIdWithIndustriesAndInterests).toHaveBeenCalledWith('1');
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if industries or interests are less than 3', async () => {
      const invalidUpdateDto: UpdateUserDto = {
        industries: ['Tech', 'Finance'],
        interests: ['AI', 'Blockchain'],
      };

      userRepository.findByIdWithIndustriesAndInterests.mockResolvedValue({ id: '1' } as User);

      await expect(userService.updateUser('1', invalidUpdateDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findByIdWithIndustriesAndInterests.mockResolvedValue(null);

      await expect(userService.updateUser('1', {} as UpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockPaginatedResult: PaginatedResult<User> = {
        items: [{ id: '1', phoneNumber: '+1234567890' } as User],
        total: 1,
        page: 1,
        limit: 10,
      };

      userRepository.findAllPaginated.mockResolvedValue(mockPaginatedResult);

      const result = await userService.getAllUsers(paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(userRepository.findAllPaginated).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('verifyPhoneNumber', () => {
    it('should verify phone number successfully', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      const mockUser = { id: '1', phoneNumber, isVerified: false } as User;

      (phoneVerificationUtil.verify as jest.Mock).mockResolvedValue(true);
      userRepository.findByPhoneNumber.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({ ...mockUser, isVerified: true });

      const result = await userService.verifyPhoneNumber(phoneNumber, code);

      expect(result).toBe(true);
      expect(phoneVerificationUtil.verify).toHaveBeenCalledWith(phoneNumber, code);
      expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, isVerified: true });
    });

    it('should return false if verification fails', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';

      (phoneVerificationUtil.verify as jest.Mock).mockResolvedValue(false);

      const result = await userService.verifyPhoneNumber(phoneNumber, code);

      expect(result).toBe(false);
      expect(phoneVerificationUtil.verify).toHaveBeenCalledWith(phoneNumber, code);
      expect(userRepository.findByPhoneNumber).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});