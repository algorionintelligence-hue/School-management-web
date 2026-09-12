// src/modules/academic/subject/teacher-subject.controller.js

import { StatusCodes } from 'http-status-codes';
import { teacherSubjectService } from './teacher-subject.service.js';
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

export class TeacherSubjectController {
  /**
   * POST /api/v1/teacher-subjects
   * Admin only — assign a teacher to a subject.
   */
  async assign(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const assignment = await teacherSubjectService.assign(schoolId, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/teacher-subjects
   * Admin & Teacher — list assignments.
   * Supports ?teacherId, ?subjectId, ?academicSession, ?role
   */
  async findAll(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const filters = {
        teacherId:       req.query.teacherId,
        subjectId:       req.query.subjectId,
        academicSession: req.query.academicSession,
        role:            req.query.role,
      };

      const assignments = await teacherSubjectService.findAll(schoolId, filters);

      res.status(StatusCodes.OK).json({
        status: 'success',
        count: assignments.length,
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/teacher-subjects/:id
   * Admin & Teacher — get a single assignment.
   */
  async findOne(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const assignment = await teacherSubjectService.findOne(schoolId, req.params.id);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/teacher-subjects/:id
   * Admin only — unassign a teacher from a subject.
   */
  async unassign(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      await teacherSubjectService.unassign(schoolId, req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const teacherSubjectController = new TeacherSubjectController();
