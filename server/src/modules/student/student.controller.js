import { StatusCodes } from 'http-status-codes';
import { studentService } from './student.service.js';
import { User } from '../user/user.schema.js';
import { UserRole } from '../../common/constants.js';
import { UnauthorizedException, ForbiddenException } from '../../common/errors/HttpException.js';

const getSchoolId = async (req) => {
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }
  // 1. Direct schoolId from JWT payload
  if (req.user.schoolId) {
    return req.user.schoolId;
  }

  // 2. Fallback: Fetch user document using userId or id from token
  const userId = req.user.userId || req.user.id || req.user._id;
  if (userId) {
    const user = await User.findById(userId);
    if (user && user.schoolId) {
      return user.schoolId;
    }
  }

  throw new UnauthorizedException('School ID not found for authenticated user');
};

export class StudentController {
  async create(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const domain = req.user.email ? req.user.email.split('@')[1] : '';
      const student = await studentService.create(schoolId, domain, req.body);

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
      const schoolId = await getSchoolId(req);
      const students = await studentService.findAll(schoolId);

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
      const schoolId = await getSchoolId(req);
      const student = await studentService.findOne(schoolId, req.params.id);

      // Authorization: Students are allowed to view only their own profile
      if (req.user.role === UserRole.STUDENT) {
        const profileUserId = student.userId?._id ? student.userId._id.toString() : student.userId.toString();
        const currentUserId = (req.user.userId || req.user.id || req.user._id).toString();

        if (profileUserId !== currentUserId) {
          throw new ForbiddenException('Students are allowed to view only their own profile');
        }
      }

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
      const schoolId = await getSchoolId(req);
      const student = await studentService.update(schoolId, req.params.id, req.body);

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
      const schoolId = await getSchoolId(req);
      await studentService.remove(schoolId, req.params.id);

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