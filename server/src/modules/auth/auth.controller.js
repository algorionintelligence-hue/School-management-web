import { StatusCodes } from 'http-status-codes';
import { authService } from './auth.service.js';
import { body } from 'express-validator';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('domain').trim().notEmpty().withMessage('Domain is required').isString(),
];

export class AuthController {
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
}

export const authController = new AuthController();
export { loginValidation };