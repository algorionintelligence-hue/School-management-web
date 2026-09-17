import { StatusCodes } from 'http-status-codes';
import { schoolService } from './school.service.js';

export class SchoolController {
  async create(req, res, next) {
    try {
      const userId = req.user?.sub || req.user?.userId;
      const school = await schoolService.create(req.body, userId);
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const schools = await schoolService.findAll();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: schools.length,
        data: schools,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const school = await schoolService.findOne(req.params.id);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOneByDomain(req, res, next) {
    try {
      const school = await schoolService.findOneByDomain(req.params.domain);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const school = await schoolService.update(req.params.id, req.body);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await schoolService.remove(req.params.id);
      res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        message: 'School deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const schoolController = new SchoolController();