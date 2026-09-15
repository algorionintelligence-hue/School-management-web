import { Router } from 'express';
import { timetableEntryController } from './timetable-entry.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import { UserRole } from '../../../common/constants.js';
import {
  createTimetableEntryValidation,
  updateTimetableEntryValidation,
  getTimetableQueryValidation,
} from './dtos/timetable-entry.dto.js';

const router = Router();

// Protect all timetable endpoints with authentication
router.use(authMiddleware);

// Create Timetable Entry (Admin only)
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createTimetableEntryValidation,
  validateMiddleware,
  timetableEntryController.createTimetableEntry
);

// Update Timetable Entry (Admin only)
router.put(
  '/:id',
  requireRoles(UserRole.ADMIN),
  updateTimetableEntryValidation,
  validateMiddleware,
  timetableEntryController.updateTimetableEntry
);

// Delete Timetable Entry (Admin only)
router.delete(
  '/:id',
  requireRoles(UserRole.ADMIN),
  timetableEntryController.deleteTimetableEntry
);

// Get Timetable by Class (Admin, Teacher, Student)
router.get(
  '/class/:classId',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  getTimetableQueryValidation,
  validateMiddleware,
  timetableEntryController.getTimetableByClass
);

// Get Timetable by Teacher (Admin, Teacher)
router.get(
  '/teacher/:teacherId',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER),
  getTimetableQueryValidation,
  validateMiddleware,
  timetableEntryController.getTimetableByTeacher
);

// Get single Timetable Entry by ID (Admin, Teacher, Student)
router.get(
  '/:id',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  timetableEntryController.getTimetableEntryById
);

export default router;
