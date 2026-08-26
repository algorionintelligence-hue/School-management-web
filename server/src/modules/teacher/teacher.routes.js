import { Router } from 'express';
import { teacherController } from './teacher.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';

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
  body('employeeId').optional().trim(),
  body('department').optional().trim(),
  body('specialization').optional().trim(),
  body('qualifications').optional().isArray(),
  body('officeRoom').optional().trim(),
  body('joiningDate').optional().isISO8601(),
  body('isHeadOfDepartment').optional().isBoolean(),
];

router.use(authMiddleware);
router.post('/', createTeacherValidation, validateMiddleware, teacherController.create);
router.get('/', teacherController.findAll);
router.get('/:id', teacherController.findOne);
router.patch('/:id', teacherController.update);
router.delete('/:id', teacherController.remove);

export default router;