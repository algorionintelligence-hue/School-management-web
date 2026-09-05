import { Router } from 'express';
import { authController, loginValidation } from './auth.controller.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
const router = Router();

router.post('/login', loginValidation, validateMiddleware, authController.login);
router.get("/verify-email",authController.verifyEmail);
router.get('/resend-email', authController.re)


export default router;