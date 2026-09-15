import { StatusCodes } from 'http-status-codes';
import { timetableEntryService } from './timetable-entry.service.js';
import { UnauthorizedException } from '../../../common/errors/HttpException.js';

class TimetableEntryController {
  async createTimetableEntry(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const entry = await timetableEntryService.createTimetableEntry(schoolId, req.body);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Timetable entry created successfully',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTimetableEntry(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const updated = await timetableEntryService.updateTimetableEntry(
        schoolId,
        req.params.id,
        req.body
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Timetable entry updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTimetableByClass(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const entries = await timetableEntryService.getTimetableByClass(
        schoolId,
        req.params.classId,
        req.query
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        data: entries,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTimetableByTeacher(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const entries = await timetableEntryService.getTimetableByTeacher(
        schoolId,
        req.params.teacherId,
        req.query
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        data: entries,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTimetableEntryById(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const entry = await timetableEntryService.getTimetableEntryById(schoolId, req.params.id);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTimetableEntry(req, res, next) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        throw new UnauthorizedException('School ID missing from request');
      }

      const result = await timetableEntryService.deleteTimetableEntry(schoolId, req.params.id);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const timetableEntryController = new TimetableEntryController();
