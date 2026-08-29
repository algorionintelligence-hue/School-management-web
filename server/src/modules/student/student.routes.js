import { Router } from 'express';
import { studentController } from './student.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

const createStudentValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('middleName').optional().trim(),
  body('phone').optional().trim(),
  body('gender').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('gradeLevel').optional().trim(),
  body('section').optional().trim(),
  body('rollNumber').optional().trim(),
  body('guardianName').optional().trim(),
  body('guardianPhone').optional().trim(),
  body('guardianEmail').optional().trim().isEmail(),
  body('guardianRelation').optional().trim(),
  body('admissionDate').optional().isISO8601(),
  body('bloodGroup').optional().trim(),
  body('medicalNotes').optional().trim(),
];

router.use(authMiddleware);
router.post('/', createStudentValidation, validateMiddleware, studentController.create);
router.get('/', studentController.findAll);
router.get('/:id', studentController.findOne);
router.patch('/:id', studentController.update);
router.delete('/:id', studentController.remove);

export default router;