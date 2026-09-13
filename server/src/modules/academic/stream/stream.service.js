// src/modules/academic/stream/stream.service.js

import mongoose from 'mongoose';
import { Stream } from './stream.schema.js';
import { Subject } from '../subject/subject.schema.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../../common/errors/HttpException.js';

export class StreamService {
  /**
   * Create a new stream for a school.
   * Prevents duplicate (schoolId + code) combos.
   */
  async create(schoolId, createStreamDto) {
    const { ObjectId } = mongoose.Types;

    const existing = await Stream.findOne({
      schoolId: new ObjectId(schoolId),
      code: createStreamDto.code.toUpperCase(),
    });

    if (existing) {
      throw new ConflictException(
        `A stream with code "${createStreamDto.code.toUpperCase()}" already exists for this school`
      );
    }

    const stream = await Stream.create({
      ...createStreamDto,
      schoolId: new ObjectId(schoolId),
    });

    return stream.toObject();
  }

  /**
   * Get all streams for a school.
   * Optionally filter by status.
   */
  async findAll(schoolId, filters = {}) {
    const { ObjectId } = mongoose.Types;

    const query = { schoolId: new ObjectId(schoolId) };

    if (filters.status) {
      query.status = filters.status;
    }

    const streams = await Stream.find(query).sort({ name: 1 });

    return streams.map((s) => s.toObject());
  }

  async getDropdown(schoolId) {
    const { ObjectId } = mongoose.Types;

    const streams = await Stream.find({ 
      schoolId: new ObjectId(schoolId),
      status: 'active'
    })
      .select('_id name')
      .sort({ name: 1 });

    return streams.map((s) => s.toObject());
  }

  /**
   * Get a single stream by id, scoped to schoolId.
   */
  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const stream = await Stream.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    return stream.toObject();
  }

  /**
   * Update a stream by id, scoped to schoolId.
   * The `code` field is immutable after creation.
   */
  async update(schoolId, id, updateStreamDto) {
    const { ObjectId } = mongoose.Types;

    if (updateStreamDto.code) {
      throw new BadRequestException(
        'Stream code cannot be changed after creation'
      );
    }

    const updatedStream = await Stream.findOneAndUpdate(
      { _id: id, schoolId: new ObjectId(schoolId) },
      { $set: updateStreamDto },
      { new: true, runValidators: true }
    );

    if (!updatedStream) {
      throw new NotFoundException('Stream not found');
    }

    return updatedStream.toObject();
  }

  /**
   * Hard-delete a stream by id, scoped to schoolId.
   * Guards: refuses deletion if subjects still reference this stream.
   */
  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const stream = await Stream.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    const subjectCount = await Subject.countDocuments({
      streamId: new ObjectId(id),
      schoolId: new ObjectId(schoolId),
    });

    if (subjectCount > 0) {
      throw new ConflictException(
        `Cannot delete this stream — ${subjectCount} subject(s) still belong to it. ` +
          'Remove or reassign those subjects first.'
      );
    }

    await Stream.deleteOne({ _id: id });
  }
}

export const streamService = new StreamService();
