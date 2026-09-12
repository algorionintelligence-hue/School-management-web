// src/modules/academic/class/class.routes.js

import { Router } from 'express';
import { classController } from './class.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import { createClassValidation, updateClassValidation } from './dtos/class.dto.js';
import { UserRole } from '../../../common/constants.js';

const router = Router();

// All class routes require authentication
router.use(authMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Only ADMIN can create a class
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createClassValidation,
  validateMiddleware,
  classController.create
);

// All authenticated users can view the list of classes
router.get('/', classController.findAll);

// All authenticated users can view a single class
router.get('/:id', classController.findOne);

// Only ADMIN can update a class
router.patch(
  '/:id',
  requireRoles(UserRole.ADMIN),
  updateClassValidation,
  validateMiddleware,
  classController.update
);

// Only ADMIN can delete a class
router.delete('/:id', requireRoles(UserRole.ADMIN), classController.remove);

export default router;
