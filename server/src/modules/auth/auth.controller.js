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
  async verifyEmail(req, res, next) {
  try {
    const result = await authService.verifyEmail(req.query.token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
  async resendVerificationEmail(req, res, next) {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        throw new AppError("Email is required", 400);
      }
      const message = await authService.resendVerificationEmail(email);
      return res.status(StatusCodes.OK).json({
        success: true,
        message,
      });

    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
      data: result,
    });
  }
}

export const authController = new AuthController();
export { loginValidation };