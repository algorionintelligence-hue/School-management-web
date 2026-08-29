import { StatusCodes } from 'http-status-codes';
import { teacherService } from './teacher.service.js';

export class TeacherController {
  async create(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const domain = req.user.email.split('@')[1];
      const teacher = await teacherService.create(req.user.schoolId, domain, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const teachers = await teacherService.findAll(req.user.schoolId);
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: teachers.length,
        data: teachers,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const teacher = await teacherService.findOne(req.user.schoolId, req.params.id);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const teacher = await teacherService.update(req.user.schoolId, req.params.id, req.body);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      await teacherService.remove(req.user.schoolId, req.params.id);
      res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        message: 'Teacher deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const teacherController = new TeacherController();