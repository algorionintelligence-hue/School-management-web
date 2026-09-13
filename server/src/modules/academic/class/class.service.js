// src/modules/academic/class/class.service.js

import mongoose from 'mongoose';
import { Class } from './class.schema.js';
import { ConflictException, NotFoundException } from '../../../common/errors/HttpException.js';

export class ClassService {
  /**
   * Create a new class for a school.
   * Prevents duplicate (schoolId + academicSession + name + section) combos.
   */
  async create(schoolId, createClassDto) {
    const { ObjectId } = mongoose.Types;

    // Check for duplicate class (matches the unique compound index in the schema)
    const existing = await Class.findOne({
      schoolId: new ObjectId(schoolId),
      academicSession: createClassDto.academicSession,
      level: createClassDto.level,
      streamId: new ObjectId(createClassDto.streamId),
      section: createClassDto.section,
    });

    if (existing) {
      throw new ConflictException(
        'A class with this level, stream, and section already exists for the given academic session'
      );
    }

    const newClass = await Class.create({
      ...createClassDto,
      schoolId: new ObjectId(schoolId),
    });

    return newClass.toObject();
  }

  /**
   * Get all classes for a school.
   * Optionally filter by academicSession query param.
   */
  async findAll(schoolId, filters = {}) {
    const { ObjectId } = mongoose.Types;

    const query = { schoolId: new ObjectId(schoolId) };

    if (filters.academicSession) {
      query.academicSession = filters.academicSession;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const classes = await Class.find(query)
      .populate('classTeacherId', 'firstName lastName email')
      .sort({ level: 1, section: 1 });

    return classes.map((c) => c.toObject());
  }

  /**
   * Get a single class by id, scoped to schoolId.
   */
  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const classDoc = await Class.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    }).populate('classTeacherId', 'firstName lastName email');

    if (!classDoc) {
      throw new NotFoundException('Class not found');
    }

    return classDoc.toObject();
  }

  /**
   * Update a class by id, scoped to schoolId.
   */
  async update(schoolId, id, updateClassDto) {
    const { ObjectId } = mongoose.Types;

    const updatedClass = await Class.findOneAndUpdate(
      { _id: id, schoolId: new ObjectId(schoolId) },
      { $set: updateClassDto },
      { new: true, runValidators: true }
    ).populate('classTeacherId', 'firstName lastName email');

    if (!updatedClass) {
      throw new NotFoundException('Class not found');
    }

    return updatedClass.toObject();
  }

  /**
   * Hard-delete a class by id, scoped to schoolId.
   */
  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const deleted = await Class.findOneAndDelete({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!deleted) {
      throw new NotFoundException('Class not found');
    }
  }
}

export const classService = new ClassService();
