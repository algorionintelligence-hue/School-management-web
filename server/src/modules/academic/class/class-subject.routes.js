import { Router } from 'express';
import { classSubjectController } from './class-subject.controller.js';
import { authMiddleware } from '../../../common/middleware/auth.middleware.js';
import { requireRoles } from '../../../common/middleware/role.middleware.js';
import { validateMiddleware } from '../../../common/middleware/validation.middleware.js';
import { UserRole } from '../../../common/constants.js';
import {
  createClassSubjectValidation,
  updateClassSubjectValidation,
} from './dtos/class-subject.dto.js';

const router = Router();

router.use(authMiddleware);

// Only ADMIN can assign a subject to a class
router.post(
  '/',
  requireRoles(UserRole.ADMIN),
  createClassSubjectValidation,
  validateMiddleware,
  classSubjectController.assignSubjectToClass
);

// All authenticated users can list assignments
router.get('/', classSubjectController.findAll);

// All authenticated users can view a single assignment
router.get('/:id', classSubjectController.findOne);

// Only ADMIN can update the assignment (e.g. change teacher, room)
router.patch(
  '/:id',
  requireRoles(UserRole.ADMIN),
  updateClassSubjectValidation,
  validateMiddleware,
  classSubjectController.update
);

// Only ADMIN can remove the assignment entirely
router.delete('/:id', requireRoles(UserRole.ADMIN), classSubjectController.remove);

export default router;
