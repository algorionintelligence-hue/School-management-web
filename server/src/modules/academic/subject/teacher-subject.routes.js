// src/modules/academic/subject/teacher-subject.routes.js

import { Router } from 'express';
import { teacherSubjectController } from './teacher-subject.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import {
  assignTeacherValidation,
  listTeacherSubjectQueryValidation,
} from './dtos/teacher-subject.dto.js';
import { UserRole } from '../../../common/constants.js';

const router = Router();

// All teacher-subject routes require authentication
router.use(authMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Only ADMIN can assign a teacher to a subject
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  assignTeacherValidation,
  validateMiddleware,
  teacherSubjectController.assign
);

// ADMIN and TEACHER can list assignments (?teacherId, ?subjectId, ?academicSession, ?role)
router.get(
  '/',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER),
  listTeacherSubjectQueryValidation,
  validateMiddleware,
  teacherSubjectController.findAll
);

// ADMIN and TEACHER can view a single assignment
router.get(
  '/:id',
  requireRoles(UserRole.ADMIN, UserRole.TEACHER),
  teacherSubjectController.findOne
);

// Only ADMIN can unassign (delete) an assignment
router.delete(
  '/:id',
  requireRoles(UserRole.ADMIN),
  teacherSubjectController.unassign
);

export default router;
