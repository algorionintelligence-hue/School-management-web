import { Router } from 'express';
import { 
  authController, 
  signupValidation,
  loginValidation, 
  resendEmailValidation, 
  requestPasswordResetValidation, 
  resetPasswordValidation,
  verifyEmailValidation,
} from './auth.controller.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signupValidation, validateMiddleware, authController.signup);
router.post('/login', loginValidation, validateMiddleware, authController.login);
router.get('/verify-email', verifyEmailValidation, validateMiddleware, authController.verifyEmail);
router.post('/resend-verification-email', resendEmailValidation, validateMiddleware, authController.resendVerificationEmail);
router.post('/forgot-password', requestPasswordResetValidation, validateMiddleware, authController.forgetPassword);
router.post('/reset-password', resetPasswordValidation, validateMiddleware, authController.resetPassword);
router.get('/me', authMiddleware, authController.me);

export default router;