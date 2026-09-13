// src/modules/academic/subject/dtos/teacher-subject.dto.js
// express-validator rules for TeacherSubject assign and query requests.

import { body, query } from 'express-validator';


// ─── Assign Validation ────────────────────────────────────────────────────────

export const assignTeacherValidation = [
  body('teacherId')
    .trim()
    .notEmpty()
    .withMessage('teacherId is required')
    .isMongoId()
    .withMessage('teacherId must be a valid MongoDB ObjectId'),

  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subjectId is required')
    .isMongoId()
    .withMessage('subjectId must be a valid MongoDB ObjectId'),

  body('academicSession')
    .trim()
    .notEmpty()
    .withMessage('academicSession is required')
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage(
      'academicSession must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'
    )
];

// ─── List Query Validation ────────────────────────────────────────────────────

export const listTeacherSubjectQueryValidation = [
  query('teacherId')
    .optional()
    .isMongoId()
    .withMessage('teacherId must be a valid MongoDB ObjectId'),

  query('subjectId')
    .optional()
    .isMongoId()
    .withMessage('subjectId must be a valid MongoDB ObjectId'),

  query('academicSession')
    .optional()
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage(
      'academicSession must be in the format YYYY-YY or YYYY-YYYY (e.g. 2024-25)'
    )
];
