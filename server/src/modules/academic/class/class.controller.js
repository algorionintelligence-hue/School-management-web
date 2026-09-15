// src/modules/academic/class/class.controller.js

import { StatusCodes } from 'http-status-codes';
import { classService } from './class.service.js';
import { User } from '../../user/user.schema.js';
import { UnauthorizedException } from '../../../common/errors/HttpException.js';

/**
 * Extract schoolId from the authenticated user's JWT payload.
 * Falls back to a DB lookup when schoolId is not embedded in the token.
 */
const getSchoolId = async (req) => {
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }

  if (req.user.schoolId) {
    return req.user.schoolId;
  }

  const userId = req.user.userId || req.user.id || req.user._id;
  if (userId) {
    const user = await User.findById(userId);
    if (user && user.schoolId) {
      return user.schoolId;
    }
  }

  throw new UnauthorizedException('School ID not found for authenticated user');
};

export class ClassController {
  /**
   * POST /api/v1/classes
   * Admin only — create a new class.
   */
  async create(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const classDoc = await classService.create(schoolId, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: classDoc,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes
   * All authenticated users — list classes for their school.
   * Supports ?academicSession=2024-25 and ?status=active query filters.
   */
  async findAll(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const filters = {
        academicSession: req.query.academicSession,
        status: req.query.status,
      };

      const classes = await classService.findAll(schoolId, filters);

      res.status(StatusCodes.OK).json({
        status: 'success',
        count: classes.length,
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes/:id
   * All authenticated users — view a single class.
   */
  async findOne(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const classDoc = await classService.findOne(schoolId, req.params.id);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: classDoc,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/classes/:id
   * Admin only — update a class.
   */
  async update(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const classDoc = await classService.update(schoolId, req.params.id, req.body);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: classDoc,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/classes/:id
   * Admin only — delete a class.
   */
  async remove(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      await classService.remove(schoolId, req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const classController = new ClassController();
