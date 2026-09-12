// src/modules/academic/subject/dtos/subject.dto.js
// express-validator rules for Subject create and update requests.

import { body, query } from 'express-validator';
import { SubjectCategory, SubjectType, Status } from '../../../../common/constants.js';

const categoryValues = Object.values(SubjectCategory);
const typeValues     = Object.values(SubjectType);
const statusValues   = Object.values(Status);

// ─── Create Validation ────────────────────────────────────────────────────────

export const createSubjectValidation = [
  body('streamId')
    .trim()
    .notEmpty()
    .withMessage('streamId is required')
    .isMongoId()
    .withMessage('streamId must be a valid MongoDB ObjectId'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Subject name is required')
    .isLength({ max: 100 })
    .withMessage('Subject name must not exceed 100 characters'),

  body('fullName')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Full name must not exceed 150 characters'),

  body('code')
    .optional({ nullable: true })
    .trim()
    .toUpperCase()
    .isLength({ max: 50 })
    .withMessage('Subject code must not exceed 50 characters')
    .matches(/^[A-Z0-9\-]+$/)
    .withMessage('Subject code may only contain uppercase letters, digits, and hyphens'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(categoryValues)
    .withMessage(`Category must be one of: ${categoryValues.join(', ')}`),

  body('type')
    .optional()
    .isIn(typeValues)
    .withMessage(`Type must be one of: ${typeValues.join(', ')}`),

  body('applicableLevels')
    .isArray({ min: 1 })
    .withMessage('applicableLevels must be a non-empty array'),

  body('applicableLevels.*')
    .isInt({ min: 0, max: 12 })
    .withMessage('Each applicable level must be an integer between 0 and 12'),

  body('maxMarks')
    .notEmpty()
    .withMessage('maxMarks is required')
    .isInt({ min: 1, max: 200 })
    .withMessage('maxMarks must be between 1 and 200'),

  body('passingMarks')
    .notEmpty()
    .withMessage('passingMarks is required')
    .isInt({ min: 0, max: 200 })
    .withMessage('passingMarks must be between 0 and 200'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
];

// ─── Update Validation ────────────────────────────────────────────────────────

export const updateSubjectValidation = [
  // code and streamId are intentionally excluded — they are immutable

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subject name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Subject name must not exceed 100 characters'),

  body('fullName')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Full name must not exceed 150 characters'),

  body('category')
    .optional()
    .isIn(categoryValues)
    .withMessage(`Category must be one of: ${categoryValues.join(', ')}`),

  body('type')
    .optional()
    .isIn(typeValues)
    .withMessage(`Type must be one of: ${typeValues.join(', ')}`),

  body('applicableLevels')
    .optional()
    .isArray({ min: 1 })
    .withMessage('applicableLevels must be a non-empty array'),

  body('applicableLevels.*')
    .optional()
    .isInt({ min: 0, max: 12 })
    .withMessage('Each applicable level must be an integer between 0 and 12'),

  body('maxMarks')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('maxMarks must be between 1 and 200'),

  body('passingMarks')
    .optional()
    .isInt({ min: 0, max: 200 })
    .withMessage('passingMarks must be between 0 and 200'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
];

// ─── Query Validation (list endpoint) ────────────────────────────────────────

export const listSubjectQueryValidation = [
  query('streamId')
    .optional()
    .isMongoId()
    .withMessage('streamId must be a valid MongoDB ObjectId'),

  query('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),

  query('category')
    .optional()
    .isIn(categoryValues)
    .withMessage(`Category must be one of: ${categoryValues.join(', ')}`),

  query('type')
    .optional()
    .isIn(typeValues)
    .withMessage(`Type must be one of: ${typeValues.join(', ')}`),
];
