import { Router } from 'express';
import { syllabusController } from './syllabus.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import { UserRole } from '../../../common/constants.js';
import {
  createSyllabusValidation,
  updateSyllabusValidation,
  getSyllabusQueryValidation,
} from './dtos/syllabus.dto.js';

const router = Router();

// Protect all syllabus endpoints with authentication
router.use(authMiddleware);

// Create Syllabus (Admin only)
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createSyllabusValidation,
  validateMiddleware,
  syllabusController.createSyllabus
);

// Update Syllabus (Admin, Teacher) - Teachers can update completedHours / progress
router.put(
  '/:id',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER),
  updateSyllabusValidation,
  validateMiddleware,
  syllabusController.updateSyllabus
);

// Delete Syllabus (Admin only)
router.delete(
  '/:id',
  requireRoles(UserRole.ADMIN),
  syllabusController.deleteSyllabus
);

// Get Syllabuses by Class (Admin, Teacher, Student)
router.get(
  '/class/:classId',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  getSyllabusQueryValidation,
  validateMiddleware,
  syllabusController.getSyllabusesByClass
);

// Get single Syllabus by ID (Admin, Teacher, Student)
router.get(
  '/:id',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  syllabusController.getSyllabusById
);

export default router;
