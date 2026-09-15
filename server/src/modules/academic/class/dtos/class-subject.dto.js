import { body, query } from 'express-validator';
import { Status } from '../../../../common/constants.js';

const classStatusValues = Object.values(Status);

export const createClassSubjectValidation = [
  body('academicSession')
    .trim()
    .notEmpty()
    .withMessage('academicSession is required')
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage('academicSession must be in the format YYYY-YY or YYYY-YYYY'),

  body('classId')
    .notEmpty()
    .withMessage('classId is required')
    .isMongoId()
    .withMessage('classId must be a valid MongoDB ObjectId'),

  body('subjectId')
    .notEmpty()
    .withMessage('subjectId is required')
    .isMongoId()
    .withMessage('subjectId must be a valid MongoDB ObjectId'),

  body('teacherId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('teacherId must be a valid MongoDB ObjectId'),

  body('periodsPerWeek')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 50 })
    .withMessage('periodsPerWeek must be a number between 1 and 50'),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('room must not exceed 100 characters'),

  body('status')
    .optional()
    .isIn(classStatusValues)
    .withMessage(`status must be one of: ${classStatusValues.join(', ')}`),
];

export const updateClassSubjectValidation = [
  body('teacherId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('teacherId must be a valid MongoDB ObjectId'),

  body('periodsPerWeek')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 50 })
    .withMessage('periodsPerWeek must be a number between 1 and 50'),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('room must not exceed 100 characters'),

  body('status')
    .optional()
    .isIn(classStatusValues)
    .withMessage(`status must be one of: ${classStatusValues.join(', ')}`),
];
