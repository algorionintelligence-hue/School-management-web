import { StatusCodes } from 'http-status-codes';
import { authService } from './auth.service.js';
import { body, query } from 'express-validator';
import { BadRequestException } from '../../common/errors/HttpException.js';

export const signupValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required').isString(),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isString(),
];

export const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('domain').optional().trim().isString(),
];

export const resendEmailValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];

export const requestPasswordResetValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];

export const resetPasswordValidation = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('newPassword').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const verifyEmailValidation = [
  query('token').trim().notEmpty().withMessage('Verification token is required'),
];

export class AuthController {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const result = await authService.verifyEmail(req.query.token);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Email verified successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(req, res, next) {
    try {
      const result = await authService.resendVerificationEmail(req.body.email);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req, res, next) {
    try {
      const result = await authService.forgetPassword(req.body.email);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const userId = req.user?.sub || req.user?.userId;
      if (!userId) {
        throw new BadRequestException("User ID missing from token payload");
      }
      const user = await authService.getCurrentUser(userId);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();