// src/modules/academic/stream/dtos/stream.dto.js
// express-validator rules for Stream create and update requests.

import { body } from 'express-validator';
import { Status, StreamCode } from '../../../../common/constants.js';

const streamCodeValues = Object.values(StreamCode);
const statusValues = Object.values(Status);

// ─── Create Validation ────────────────────────────────────────────────────────

export const createStreamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Stream name is required')
    .isLength({ max: 100 })
    .withMessage('Stream name must not exceed 100 characters'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('Stream code is required')
    .toUpperCase()
    .isIn(streamCodeValues)
    .withMessage(`Stream code must be one of: ${streamCodeValues.join(', ')}`),

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

export const updateStreamValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Stream name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Stream name must not exceed 100 characters'),

  // code is intentionally excluded — it is immutable

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
