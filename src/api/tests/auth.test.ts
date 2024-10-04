import { AuthService } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { UserService } from '../services/userService';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../services/userService');
jest.mock('../utils/jwt');
jest.mock('../utils/phoneVerification');
jest.mock('bcrypt');

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    authService = new AuthService(mockUserService);
    authController = new AuthController(authService);

    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('verifyPhone', () => {
    it('should initiate phone verification successfully', async () => {
      // Arrange
      const phoneNumber = '+1234567890';
      mockRequest.body = { phoneNumber };
      jest.spyOn(authService, 'initiatePhoneVerification').mockResolvedValue(true);

      // Act
      await authController.verifyPhone(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Verification code sent successfully' });
    });

    it('should return 400 for invalid phone number', async () => {
      // Arrange
      const phoneNumber = 'invalid';
      mockRequest.body = { phoneNumber };

      // Act
      await authController.verifyPhone(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid phone number format' });
    });

    it('should return 500 if verification initiation fails', async () => {
      // Arrange
      const phoneNumber = '+1234567890';
      mockRequest.body = { phoneNumber };
      jest.spyOn(authService, 'initiatePhoneVerification').mockResolvedValue(false);

      // Act
      await authController.verifyPhone(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to send verification code' });
    });
  });

  describe('confirmVerification', () => {
    it('should confirm verification and return token', async () => {
      // Arrange
      const phoneNumber = '+1234567890';
      const verificationCode = '123456';
      const userId = 'user-id';
      const token = 'jwt-token';
      const user = { id: userId, phoneNumber };
      mockRequest.body = { phoneNumber, verificationCode };
      jest.spyOn(authService, 'verifyPhoneNumber').mockResolvedValue(true);
      jest.spyOn(authService, 'getUserByPhoneNumber').mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      // Act
      await authController.confirmVerification(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token, user });
    });

    it('should return 400 for invalid verification code', async () => {
      // Arrange
      const phoneNumber = '+1234567890';
      const verificationCode = '123456';
      mockRequest.body = { phoneNumber, verificationCode };
      jest.spyOn(authService, 'verifyPhoneNumber').mockResolvedValue(false);

      // Act
      await authController.confirmVerification(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid verification code' });
    });

    it('should return 404 if user is not found after verification', async () => {
      // Arrange
      const phoneNumber = '+1234567890';
      const verificationCode = '123456';
      mockRequest.body = { phoneNumber, verificationCode };
      jest.spyOn(authService, 'verifyPhoneNumber').mockResolvedValue(true);
      jest.spyOn(authService, 'getUserByPhoneNumber').mockResolvedValue(null);

      // Act
      await authController.confirmVerification(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const userId = 'user-id';
      mockRequest.user = { id: userId };
      jest.spyOn(authService, 'logout').mockResolvedValue(true);

      // Act
      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 500 if logout fails', async () => {
      // Arrange
      const userId = 'user-id';
      mockRequest.user = { id: userId };
      jest.spyOn(authService, 'logout').mockResolvedValue(false);

      // Act
      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Logout failed' });
    });
  });
});