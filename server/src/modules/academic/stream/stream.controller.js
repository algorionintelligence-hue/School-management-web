// src/modules/academic/stream/stream.controller.js

import { StatusCodes } from 'http-status-codes';
import { streamService } from './stream.service.js';
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

export class StreamController {
  /**
   * POST /api/v1/streams
   * Admin only — create a new stream.
   */
  async create(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const stream = await streamService.create(schoolId, req.body);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: stream,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/streams
   * All authenticated users — list streams for their school.
   * Supports ?status=active query filter.
   */
  async findAll(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const filters = { status: req.query.status };

      const streams = await streamService.findAll(schoolId, filters);

      res.status(StatusCodes.OK).json({
        status: 'success',
        count: streams.length,
        data: streams,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/streams/:id
   * All authenticated users — view a single stream.
   */
  async findOne(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const stream = await streamService.findOne(schoolId, req.params.id);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: stream,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/streams/:id
   * Admin only — update a stream.
   */
  async update(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      const stream = await streamService.update(schoolId, req.params.id, req.body);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: stream,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/streams/:id
   * Admin only — delete a stream (blocked if subjects exist).
   */
  async remove(req, res, next) {
    try {
      const schoolId = await getSchoolId(req);
      await streamService.remove(schoolId, req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const streamController = new StreamController();
