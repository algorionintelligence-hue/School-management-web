import { Router } from 'express';
import { studentController } from './student.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';
import { GradeLevel, Section, BloodGroup, Gender, GuardianRelation } from '../../common/constants.js';

const router = Router();

const createStudentValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('middleName').optional().trim(),
  body('phone').optional().trim(),
  body('gender').optional().isIn(Object.values(Gender)).withMessage(`Gender must be one of: ${Object.values(Gender).join(', ')}`),
  body('dateOfBirth').optional().isISO8601(),
  body('gradeLevel').optional().isIn(Object.values(GradeLevel)).withMessage(`Grade level must be one of: ${Object.values(GradeLevel).join(', ')}`),
  body('section').optional().isIn(Object.values(Section)).withMessage(`Section must be one of: ${Object.values(Section).join(', ')}`),
  body('guardianName').optional().trim(),
  body('guardianPhone').optional().trim(),
  body('guardianEmail').optional().trim().isEmail(),
  body('guardianRelation').optional().isIn(Object.values(GuardianRelation)).withMessage(`Guardian relation must be one of: ${Object.values(GuardianRelation).join(', ')}`),
  body('admissionDate').optional().isISO8601(),
  body('bloodGroup').optional().isIn(Object.values(BloodGroup)).withMessage(`Blood group must be one of: ${Object.values(BloodGroup).join(', ')}`),
  body('medicalNotes').optional().trim(),
];

const updateStudentValidation = [
  body('email').optional().trim().isEmail(),
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('middleName').optional().trim(),
  body('phone').optional().trim(),
  body('gender').optional().isIn(Object.values(Gender)).withMessage(`Gender must be one of: ${Object.values(Gender).join(', ')}`),
  body('dateOfBirth').optional().isISO8601(),
  body('gradeLevel').optional().isIn(Object.values(GradeLevel)).withMessage(`Grade level must be one of: ${Object.values(GradeLevel).join(', ')}`),
  body('section').optional().isIn(Object.values(Section)).withMessage(`Section must be one of: ${Object.values(Section).join(', ')}`),
  body('guardianName').optional().trim(),
  body('guardianPhone').optional().trim(),
  body('guardianEmail').optional().trim().isEmail(),
  body('guardianRelation').optional().isIn(Object.values(GuardianRelation)).withMessage(`Guardian relation must be one of: ${Object.values(GuardianRelation).join(', ')}`),
  body('admissionDate').optional().isISO8601(),
  body('bloodGroup').optional().isIn(Object.values(BloodGroup)).withMessage(`Blood group must be one of: ${Object.values(BloodGroup).join(', ')}`),
  body('medicalNotes').optional().trim(),
];

router.use(authMiddleware);
router.post('/', createStudentValidation, validateMiddleware, studentController.create);
router.get('/', validateMiddleware, studentController.findAll);
router.get('/:id', studentController.findOne);
router.patch('/:id', updateStudentValidation, validateMiddleware, studentController.update);
router.delete('/:id', studentController.remove);

export default router;