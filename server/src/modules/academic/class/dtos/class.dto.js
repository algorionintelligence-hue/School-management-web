// src/modules/academic/class/dtos/class.dto.js
// Express-validator rules for Class create and update requests.

import { body } from 'express-validator';
import { ClassStream, Section } from '../../../../common/constants.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const classStreamValues = Object.values(ClassStream);
const sectionValues = Object.values(Section);
const classStatusValues = ['active', 'inactive', 'archived'];

// ─── Create Validation ────────────────────────────────────────────────────────

export const createClassValidation = [
  body('academicSession')
    .trim()
    .notEmpty()
    .withMessage('Academic session is required')
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage('Academic session must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ max: 100 })
    .withMessage('Class name must not exceed 100 characters'),

  body('level')
    .notEmpty()
    .withMessage('Level is required')
    .isInt({ min: 0, max: 12 })
    .withMessage('Level must be a number between 0 and 12'),

  body('stream')
    .optional({ nullable: true })
    .isIn(classStreamValues)
    .withMessage(`Stream must be one of: ${classStreamValues.join(', ')}`),

  body('section')
    .optional({ nullable: true })
    .isIn(sectionValues)
    .withMessage(`Section must be one of: ${sectionValues.join(', ')}`),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 200 })
    .withMessage('Capacity must be a number between 1 and 200'),

  body('classTeacherId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('classTeacherId must be a valid MongoDB ObjectId'),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Room must not exceed 100 characters'),

  body('status')
    .optional()
    .isIn(classStatusValues)
    .withMessage(`Status must be one of: ${classStatusValues.join(', ')}`),

  body('sortOrder')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

// ─── Update Validation ────────────────────────────────────────────────────────

export const updateClassValidation = [
  body('academicSession')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage('Academic session must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Class name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Class name must not exceed 100 characters'),

  body('level')
    .optional()
    .isInt({ min: 0, max: 12 })
    .withMessage('Level must be a number between 0 and 12'),

  body('stream')
    .optional({ nullable: true })
    .isIn(classStreamValues)
    .withMessage(`Stream must be one of: ${classStreamValues.join(', ')}`),

  body('section')
    .optional({ nullable: true })
    .isIn(sectionValues)
    .withMessage(`Section must be one of: ${sectionValues.join(', ')}`),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Capacity must be a number between 1 and 200'),

  body('enrolledCount')
    .optional()
    .isInt({ min: 0, max: 200 })
    .withMessage('Enrolled count must be between 0 and 200'),

  body('classTeacherId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('classTeacherId must be a valid MongoDB ObjectId'),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Room must not exceed 100 characters'),

  body('status')
    .optional()
    .isIn(classStatusValues)
    .withMessage(`Status must be one of: ${classStatusValues.join(', ')}`),

  body('sortOrder')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];
