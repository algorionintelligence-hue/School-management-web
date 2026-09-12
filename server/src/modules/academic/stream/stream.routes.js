// src/modules/academic/stream/stream.routes.js

import { Router } from 'express';
import { streamController } from './stream.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import { createStreamValidation, updateStreamValidation } from './dtos/stream.dto.js';
import { UserRole } from '../../../common/constants.js';

const router = Router();

// All stream routes require authentication
router.use(authMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Only ADMIN can create a stream
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createStreamValidation,
  validateMiddleware,
  streamController.create
);

// All authenticated users can list streams
router.get('/', streamController.findAll);

// All authenticated users can view a single stream
router.get('/:id', streamController.findOne);

// Only ADMIN can update a stream
router.patch(
  '/:id',
  requireRoles(UserRole.ADMIN),
  updateStreamValidation,
  validateMiddleware,
  streamController.update
);

// Only ADMIN can delete a stream
router.delete('/:id', requireRoles(UserRole.ADMIN), streamController.remove);

export default router;
