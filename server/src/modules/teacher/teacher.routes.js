import { Router } from 'express';
import { teacherController } from './teacher.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';
import { UserRole } from '../../common/constants.js';

const router = Router();

const createTeacherValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('middleName').optional().trim(),
  body('phone').optional().trim(),
  body('gender').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('department').optional().trim(),
  body('specialization').optional().trim(),
  body('qualifications').optional().isArray(),
  body('joiningDate').optional().isISO8601(),
];

const updateTeacherValidation = [
  body('email').optional().trim().isEmail(),
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('middleName').optional().trim(),
  body('phone').optional().trim(),
  body('gender').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('department').optional().trim(),
  body('specialization').optional().trim(),
  body('qualifications').optional().isArray(),
  body('joiningDate').optional().isISO8601(),
];

router.use(authMiddleware);

// Only ADMIN can create teachers
router.post('/', requireRoles(UserRole.ADMIN), createTeacherValidation, validateMiddleware, teacherController.create);

// Only ADMIN can view all teachers
router.get('/', requireRoles(UserRole.ADMIN), teacherController.findAll);

// ADMIN can view any teacher; TEACHER can view only itself
router.get('/:id', requireRoles(UserRole.ADMIN, UserRole.TEACHER), teacherController.findOne);

// ADMIN can update any teacher; TEACHER can update only itself
router.patch('/:id', requireRoles(UserRole.ADMIN, UserRole.TEACHER), updateTeacherValidation, validateMiddleware, teacherController.update);

// Only ADMIN can delete teachers
router.delete('/:id', requireRoles(UserRole.ADMIN), teacherController.remove);

export default router;