import { Router } from 'express';
import { schoolController } from './school.controller.js';
import { validateMiddleware } from '../../common/middleware/validation.middleware.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { body } from 'express-validator';
import { SchoolRange, SchoolBoard, SchoolShift } from '../../common/constants.js';

const router = Router();

const createSchoolValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isString(),
  body('legalName').trim().notEmpty().withMessage('Legal name is required').isString(),
  body('domain').trim().notEmpty().withMessage('Domain is required').isString(),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('phone').trim().notEmpty().withMessage('Phone is required').isString(),

  // Address
  body('address')
    .notEmpty().withMessage('Address information is required')
    .isObject().withMessage('Address must be an object'),
  body('address.city').trim().notEmpty().withMessage('Address city is required').isString(),
  body('address.state').trim().notEmpty().withMessage('Address state is required').isString(),
  body('address.country').trim().notEmpty().withMessage('Address country is required').isString(),
  body('address.postalCode').trim().notEmpty().withMessage('Address postal code is required').isString(),

  // Metrics & Settings
  body('establishedYear')
    .notEmpty().withMessage('Established year is required')
    .isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Invalid established year'),
  body('schoolRange')
    .notEmpty().withMessage('School range is required')
    .isString().isIn(Object.values(SchoolRange)).withMessage('Invalid school range'),
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isString().isIn(Object.values(SchoolShift)).withMessage('Invalid school shift'),
  body('numberOfCampus')
    .notEmpty().withMessage('Number of campuses is required')
    .isInt({ min: 1 }).withMessage('Number of campuses must be at least 1'),
  body('selectedBoard')
    .notEmpty().withMessage('Selected board is required')
    .isString().isIn(Object.values(SchoolBoard)).withMessage('Invalid school board'),

  // Timings & Academic Session
  body('startTime').trim().notEmpty().withMessage('Start time is required').isString(),
  body('endTime').trim().notEmpty().withMessage('End time is required').isString(),
  body('academicSession')
    .notEmpty().withMessage('Academic session is required')
    .isObject().withMessage('Academic session must be an object'),
  body('academicSession.currentYear').trim().notEmpty().withMessage('Academic session current year is required').isString(),
  body('academicSession.startDate').notEmpty().withMessage('Academic session start date is required').isISO8601().withMessage('Invalid start date format'),
  body('academicSession.endDate').notEmpty().withMessage('Academic session end date is required').isISO8601().withMessage('Invalid end date format'),

  // Optionals
  body('logo').optional().trim().isString(),
  body('logoUrl').optional().trim().isString(),
  body('timezone').optional().trim().isString(),
  body('locale').optional().trim().isString(),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('tagline').optional().trim().isLength({ max: 150 }).withMessage('Tagline cannot exceed 150 characters'),
  body('isHeadCampus').optional().isBoolean().withMessage('isHeadCampus must be a boolean'),
  body('parentSchoolId').optional().isMongoId().withMessage('Invalid parent school ID'),
  body('banner').optional().trim().isString(),
];

router.post('/', authMiddleware, createSchoolValidation, validateMiddleware, schoolController.create);
router.post('/register', authMiddleware, createSchoolValidation, validateMiddleware, schoolController.create);
router.get('/', schoolController.findAll);
router.get('/:id', schoolController.findOne);
router.get('/domain/:domain', schoolController.findOneByDomain);
router.patch('/:id', schoolController.update);
router.delete('/:id', schoolController.remove);

export default router;