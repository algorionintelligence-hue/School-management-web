// src/modules/academic/subject/subject.controller.js

import { StatusCodes } from 'http-status-codes';
import { subjectService } from './subject.service.js';
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

export class SubjectController {
  /**
   * POST /api/v1/subjects
   * Admin only — create a new subject.
   */
  async create(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const subject = await subjectService.create(schoolId, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/subjects
   * All authenticated users — list subjects for their school.
   * Supports ?streamId, ?status, ?category, ?type query filters.
   */
  async findAll(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const filters = {
        streamId: req.query.streamId,
        status:   req.query.status,
        category: req.query.category,
        type:     req.query.type,
      };

      const subjects = await subjectService.findAll(schoolId, filters);

      res.status(StatusCodes.OK).json({
        status: 'success',
        count: subjects.length,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/subjects/:id
   * All authenticated users — view a single subject.
   */
  async findOne(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const subject = await subjectService.findOne(schoolId, req.params.id);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/subjects/:id
   * Admin only — update a subject.
   */
  async update(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const subject = await subjectService.update(schoolId, req.params.id, req.body);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/subjects/:id
   * Admin only — delete a subject (blocked if teacher assignments exist).
   */
  async remove(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      await subjectService.remove(schoolId, req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController();
