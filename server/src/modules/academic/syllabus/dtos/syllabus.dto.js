import { body, query } from 'express-validator';
import { Status } from '../../../../common/constants.js';

const statusValues = Object.values(Status);

export const createSyllabusValidation = [
  body('academicYear')
    .trim()
    .notEmpty()
    .withMessage('academicYear is required')
    .isLength({ max: 20 })
    .withMessage('academicYear must not exceed 20 characters'),

  body('classId')
    .notEmpty()
    .withMessage('classId is required')
    .isMongoId()
    .withMessage('classId must be a valid MongoDB ObjectId'),

  body('classSubjectId')
    .notEmpty()
    .withMessage('classSubjectId is required')
    .isMongoId()
    .withMessage('classSubjectId must be a valid MongoDB ObjectId'),

  body('hours')
    .notEmpty()
    .withMessage('hours is required')
    .isNumeric()
    .withMessage('hours must be a number')
    .custom((val) => val >= 0)
    .withMessage('hours cannot be negative'),

  body('totalUnits')
    .notEmpty()
    .withMessage('totalUnits is required')
    .isInt({ min: 0 })
    .withMessage('totalUnits must be a non-negative integer'),

  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`status must be one of: ${statusValues.join(', ')}`),
];

export const updateSyllabusValidation = [
  body('academicYear')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('academicYear must not exceed 20 characters'),

  body('hours')
    .optional()
    .isNumeric()
    .withMessage('hours must be a number')
    .custom((val) => val >= 0)
    .withMessage('hours cannot be negative'),

  body('completedHours')
    .optional()
    .isNumeric()
    .withMessage('completedHours must be a number')
    .custom((val) => val >= 0)
    .withMessage('completedHours cannot be negative'),

  body('totalUnits')
    .optional()
    .isInt({ min: 0 })
    .withMessage('totalUnits must be a non-negative integer'),

  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`status must be one of: ${statusValues.join(', ')}`),
];

export const getSyllabusQueryValidation = [
  query('academicYear')
    .optional()
    .trim(),

  query('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`status must be one of: ${statusValues.join(', ')}`),
];
