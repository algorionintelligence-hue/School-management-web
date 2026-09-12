import { StatusCodes } from 'http-status-codes';
import { teacherService } from './teacher.service.js';
import { User } from '../user/user.schema.js';
import { UserRole } from '../../common/constants.js';
import { UnauthorizedException, ForbiddenException } from '../../common/errors/HttpException.js';

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

export class TeacherController {
  async create(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const domain = req.user.email ? req.user.email.split('@')[1] : '';
      const teacher = await teacherService.create(schoolId, domain, req.body);

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
      const schoolId = await getSchoolId(req);
      const teachers = await teacherService.findAll(schoolId);

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
      const schoolId = await getSchoolId(req);
      const teacher = await teacherService.findOne(schoolId, req.params.id);

      // Authorization: Teachers can only view their own profile
      if (req.user.role === UserRole.TEACHER) {
        const profileUserId = teacher.userId?._id ? teacher.userId._id.toString() : teacher.userId.toString();
        const currentUserId = (req.user.userId || req.user.id || req.user._id).toString();

        if (profileUserId !== currentUserId) {
          throw new ForbiddenException('Teachers are only allowed to view their own profile');
        }
      }

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
      const schoolId = await getSchoolId(req);

      // Authorization: Teachers can only update their own profile
      if (req.user.role === UserRole.TEACHER) {
        const existingTeacher = await teacherService.findOne(schoolId, req.params.id);
        const profileUserId = existingTeacher.userId?._id ? existingTeacher.userId._id.toString() : existingTeacher.userId.toString();
        const currentUserId = (req.user.userId || req.user.id || req.user._id).toString();

        if (profileUserId !== currentUserId) {
          throw new ForbiddenException('Teachers are only allowed to update their own profile');
        }
      }

      const teacher = await teacherService.update(schoolId, req.params.id, req.body);
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
      const schoolId = await getSchoolId(req);
      await teacherService.remove(schoolId, req.params.id);

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