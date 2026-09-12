// src/modules/academic/subject/subject.routes.js

import { Router } from 'express';
import { subjectController } from './subject.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import {
  createSubjectValidation,
  updateSubjectValidation,
  listSubjectQueryValidation,
} from './dtos/subject.dto.js';
import { UserRole } from '../../../common/constants.js';

const router = Router();

// All subject routes require authentication
router.use(authMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Only ADMIN can create a subject
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createSubjectValidation,
  validateMiddleware,
  subjectController.create
);

// All authenticated users can list subjects (?streamId, ?status, ?category, ?type)
router.get(
  '/',
  listSubjectQueryValidation,
  validateMiddleware,
  subjectController.findAll
);

// All authenticated users can view a single subject
router.get('/:id', subjectController.findOne);

// Only ADMIN can update a subject
router.patch(
  '/:id',
  requireRoles(UserRole.ADMIN),
  updateSubjectValidation,
  validateMiddleware,
  subjectController.update
);

// Only ADMIN can delete a subject
router.delete('/:id', requireRoles(UserRole.ADMIN), subjectController.remove);

export default router;
