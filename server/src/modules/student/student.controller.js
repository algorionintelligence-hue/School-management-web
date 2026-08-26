import { StatusCodes } from 'http-status-codes';
import { studentService } from './student.service.js';

export class StudentController {
  async create(req, res, next) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const domain = req.user.email.split('@')[1];
      const student = await studentService.create(req.user.schoolId, domain, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: student,
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

      const students = await studentService.findAll(req.user.schoolId);
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: students.length,
        data: students,
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

      const student = await studentService.findOne(req.user.schoolId, req.params.id);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: student,
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

      const student = await studentService.update(req.user.schoolId, req.params.id, req.body);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: student,
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

      await studentService.remove(req.user.schoolId, req.params.id);
      res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        message: 'Student deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();