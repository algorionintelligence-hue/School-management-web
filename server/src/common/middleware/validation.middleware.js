import { validationResult } from 'express-validator';
import { BadRequestException } from '../errors/HttpException.js';

export const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestException(errors.array().map((err) => err.msg).join(', '));
  }
  next();
};