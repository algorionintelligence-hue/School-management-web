// src/modules/academic/class/class.controller.js

import { StatusCodes } from 'http-status-codes';
import { classService } from './class.service.js';
import { User } from '../../user/user.schema.js';
import { UnauthorizedException, BadRequestException } from '../../../common/errors/HttpException.js';

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
   * GET /api/v1/classes/dropdown
   * All authenticated users — get _id and name of active classes for dropdown lists.
   */
  async getDropdown(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const classes = await classService.getDropdown(schoolId);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes/class-section-dropdown?academicSession=2024-25
   * All authenticated users — get formatted dropdown list with label ("Class 10-A") and unique classId.
   */
  async getClassSectionDropdown(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const classes = await classService.getClassSectionDropdown(schoolId, req.query.academicSession);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes/lookup?name=Grade 10&section=A&academicSession=2024-25
   * All authenticated users — lookup unique class _id by name and section.
   */
  async lookupByNameAndSection(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const { name, section, academicSession } = req.query;

      if (!name || !section) {
        throw new BadRequestException('Both name and section query parameters are required');
      }

      const classDoc = await classService.findByNameAndSection(schoolId, {
        name,
        section,
        academicSession,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: classDoc,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes/names?academicSession=2024-25
   * All authenticated users — get list of unique class names.
   */
  async getClassNames(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const names = await classService.getClassNames(schoolId, req.query.academicSession);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: names,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/classes/sections?name=Grade 10&academicSession=2024-25
   * All authenticated users — get available sections and classIds for a class name.
   */
  async getSectionsByName(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const { name, academicSession } = req.query;

      if (!name) {
        throw new BadRequestException('Class name query parameter is required');
      }

      const sections = await classService.getSectionsByName(schoolId, {
        name,
        academicSession,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: sections,
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
