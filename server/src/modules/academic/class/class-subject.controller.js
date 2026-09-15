import { StatusCodes } from 'http-status-codes';
import { classSubjectService } from './class-subject.service.js';
import { User } from '../../user/user.schema.js';
import { UnauthorizedException } from '../../../common/errors/HttpException.js';

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

export class ClassSubjectController {
  async assignSubjectToClass(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const mapping = await classSubjectService.assignSubjectToClass(schoolId, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: mapping,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const filters = {
        classId: req.query.classId,
        subjectId: req.query.subjectId,
        teacherId: req.query.teacherId,
        academicSession: req.query.academicSession,
        status: req.query.status,
      };

      const mappings = await classSubjectService.findAll(schoolId, filters);

      res.status(StatusCodes.OK).json({
        status: 'success',
        count: mappings.length,
        data: mappings,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const mapping = await classSubjectService.findOne(schoolId, req.params.id);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: mapping,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const mapping = await classSubjectService.update(schoolId, req.params.id, req.body);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: mapping,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      await classSubjectService.remove(schoolId, req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const classSubjectController = new ClassSubjectController();
