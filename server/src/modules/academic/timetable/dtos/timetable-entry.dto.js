import { body, query } from 'express-validator';
import { TimetableDay, Status } from '../../../../common/constants.js';

const days = Object.values(TimetableDay);
const statuses = Object.values(Status);
const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const createTimetableEntryValidation = [
  body('academicSession')
    .trim()
    .notEmpty()
    .withMessage('academicSession is required')
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage('academicSession must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'),

  body('classId')
    .notEmpty()
    .withMessage('classId is required')
    .isMongoId()
    .withMessage('Invalid classId format'),

  body('classSubjectId')
    .notEmpty()
    .withMessage('classSubjectId is required')
    .isMongoId()
    .withMessage('Invalid classSubjectId format'),

  body('teacherId')
    .notEmpty()
    .withMessage('teacherId is required')
    .isMongoId()
    .withMessage('Invalid teacherId format'),

  body('dayOfWeek')
    .notEmpty()
    .withMessage('dayOfWeek is required')
    .isIn(days)
    .withMessage(`dayOfWeek must be one of: ${days.join(', ')}`),

  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('startTime is required')
    .matches(timeRegex)
    .withMessage('startTime must be in 24-hour HH:mm format (e.g. 09:00)'),

  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('endTime is required')
    .matches(timeRegex)
    .withMessage('endTime must be in 24-hour HH:mm format (e.g. 10:00)')
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime <= req.body.startTime) {
        throw new Error('endTime must be later than startTime');
      }
      return true;
    }),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('room must be a string'),

  body('status')
    .optional()
    .isIn(statuses)
    .withMessage(`status must be one of: ${statuses.join(', ')}`),
];

export const updateTimetableEntryValidation = [
  body('academicSession')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage('academicSession must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'),

  body('classId')
    .optional()
    .isMongoId()
    .withMessage('Invalid classId format'),

  body('classSubjectId')
    .optional()
    .isMongoId()
    .withMessage('Invalid classSubjectId format'),

  body('teacherId')
    .optional()
    .isMongoId()
    .withMessage('Invalid teacherId format'),

  body('dayOfWeek')
    .optional()
    .isIn(days)
    .withMessage(`dayOfWeek must be one of: ${days.join(', ')}`),

  body('startTime')
    .optional()
    .trim()
    .matches(timeRegex)
    .withMessage('startTime must be in 24-hour HH:mm format (e.g. 09:00)'),

  body('endTime')
    .optional()
    .trim()
    .matches(timeRegex)
    .withMessage('endTime must be in 24-hour HH:mm format (e.g. 10:00)')
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime <= req.body.startTime) {
        throw new Error('endTime must be later than startTime');
      }
      return true;
    }),

  body('room')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('room must be a string'),

  body('status')
    .optional()
    .isIn(statuses)
    .withMessage(`status must be one of: ${statuses.join(', ')}`),
];

export const getTimetableQueryValidation = [
  query('academicSession')
    .optional()
    .trim(),

  query('dayOfWeek')
    .optional()
    .isIn(days)
    .withMessage(`dayOfWeek must be one of: ${days.join(', ')}`),
];
