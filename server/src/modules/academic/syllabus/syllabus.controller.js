import { StatusCodes } from 'http-status-codes';
import { syllabusService } from './syllabus.service.js';
import { UnauthorizedException } from '../../../common/errors/HttpException.js';

class SyllabusController {
  async createSyllabus(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const syllabus = await syllabusService.createSyllabus(schoolId, req.body);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Syllabus created successfully',
        data: syllabus,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSyllabus(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const updated = await syllabusService.updateSyllabus(schoolId, req.params.id, req.body);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Syllabus updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSyllabusesByClass(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const syllabuses = await syllabusService.getSyllabusesByClass(
        schoolId,
        req.params.classId,
        req.query
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        count: syllabuses.length,
        data: syllabuses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSyllabusById(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const syllabus = await syllabusService.getSyllabusById(schoolId, req.params.id);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: syllabus,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSyllabus(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const result = await syllabusService.deleteSyllabus(schoolId, req.params.id);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const syllabusController = new SyllabusController();
