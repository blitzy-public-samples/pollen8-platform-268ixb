import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';
import { PhoneVerificationUtil } from '../shared/utils/phone-verification.util';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findUserByPhoneNumber: jest.fn(),
    findUserById: jest.fn(),
    verifyPhoneNumber: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sendVerificationCode', () => {
    it('should send a verification code successfully', async () => {
      const phoneNumber = '+1234567890';
      const sendVerificationSMSSpy = jest.spyOn(PhoneVerificationUtil, 'sendVerificationSMS').mockResolvedValue(true);
      const generateVerificationCodeSpy = jest.spyOn(PhoneVerificationUtil, 'generateVerificationCode').mockReturnValue('123456');

      await expect(authService.sendVerificationCode(phoneNumber)).resolves.not.toThrow();

      expect(generateVerificationCodeSpy).toHaveBeenCalled();
      expect(sendVerificationSMSSpy).toHaveBeenCalledWith(phoneNumber, '123456');
    });

    it('should throw an error if sending SMS fails', async () => {
      const phoneNumber = '+1234567890';
      jest.spyOn(PhoneVerificationUtil, 'sendVerificationSMS').mockResolvedValue(false);

      await expect(authService.sendVerificationCode(phoneNumber)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyCode', () => {
    it('should verify phone number successfully', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      jest.spyOn(PhoneVerificationUtil, 'verifyPhoneNumber').mockResolvedValue(true);

      const result = await authService.verifyCode(phoneNumber, code);

      expect(result).toBe(true);
      expect(mockUserService.verifyPhoneNumber).toHaveBeenCalledWith(phoneNumber, code);
    });

    it('should return false if verification fails', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      jest.spyOn(PhoneVerificationUtil, 'verifyPhoneNumber').mockResolvedValue(false);

      const result = await authService.verifyCode(phoneNumber, code);

      expect(result).toBe(false);
      expect(mockUserService.verifyPhoneNumber).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should generate JWT token for verified user', async () => {
      const phoneNumber = '+1234567890';
      const user = { id: '1', phoneNumber, isVerified: true };
      const token = 'jwt_token';
      mockUserService.findUserByPhoneNumber.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.login(phoneNumber);

      expect(result).toEqual({ accessToken: token });
      expect(mockUserService.findUserByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, phoneNumber: user.phoneNumber },
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedException for unverified user', async () => {
      const phoneNumber = '+1234567890';
      const user = { id: '1', phoneNumber, isVerified: false };
      mockUserService.findUserByPhoneNumber.mockResolvedValue(user);

      await expect(authService.login(phoneNumber)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if payload is valid', async () => {
      const payload = { sub: '1', phoneNumber: '+1234567890' };
      const user = { id: '1', phoneNumber: '+1234567890' };
      mockUserService.findUserById.mockResolvedValue(user);

      const result = await authService.validateUser(payload);

      expect(result).toEqual(user);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(payload.sub);
    });

    it('should return null if user is not found', async () => {
      const payload = { sub: '1', phoneNumber: '+1234567890' };
      mockUserService.findUserById.mockResolvedValue(null);

      const result = await authService.validateUser(payload);

      expect(result).toBeNull();
    });

    it('should return null if phone numbers do not match', async () => {
      const payload = { sub: '1', phoneNumber: '+1234567890' };
      const user = { id: '1', phoneNumber: '+0987654321' };
      mockUserService.findUserById.mockResolvedValue(user);

      const result = await authService.validateUser(payload);

      expect(result).toBeNull();
    });
  });
});