import { Router } from 'express';
import { studentController } from './student.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { body } from 'express-validator';
import { GradeLevel, Section, BloodGroup, Gender, GuardianRelation, UserRole } from '../../common/constants.js';

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

// Only ADMIN can create students
router.post('/', requireRoles(UserRole.ADMIN), createStudentValidation, validateMiddleware, studentController.create);

// ADMIN and TEACHER can view all students list
router.get('/', requireRoles(UserRole.ADMIN, UserRole.TEACHER), studentController.findAll);

// ADMIN and TEACHER can view any student; STUDENT can view only their own profile
router.get('/:id', requireRoles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT), studentController.findOne);

// Only ADMIN can update students
router.patch('/:id', requireRoles(UserRole.ADMIN), updateStudentValidation, validateMiddleware, studentController.update);

// Only ADMIN can delete students
router.delete('/:id', requireRoles(UserRole.ADMIN), studentController.remove);

export default router;