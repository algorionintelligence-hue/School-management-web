// src/modules/academic/class/class.service.js

import mongoose from 'mongoose';
import { Class } from './schemas/class.schema.js';
import { ConflictException, NotFoundException } from '../../../common/errors/HttpException.js';

export class ClassService {
  /**
   * Create a new class for a school.
   * Prevents duplicate (schoolId + academicSession + name + section) combos.
   */
  async create(schoolId, createClassDto) {
    const { ObjectId } = mongoose.Types;

    // Check for duplicate class in the same school + session + name + section
    const existing = await Class.findOne({
      schoolId: new ObjectId(schoolId),
      academicSession: createClassDto.academicSession,
      name: createClassDto.name,
      section: createClassDto.section ?? null,
    });

    if (existing) {
      throw new ConflictException(
        'A class with this name and section already exists for the given academic session'
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
   * Get only _id and name (plus level, section, academicSession) of active classes for dropdowns.
   */
  async getDropdown(schoolId) {
    const { ObjectId } = mongoose.Types;

    const classes = await Class.find({
      schoolId: new ObjectId(schoolId),
      status: 'active',
    })
      .select('_id name level section academicSession')
      .sort({ level: 1, section: 1 });

    return classes.map((c) => c.toObject());
  }

  /**
   * Get class-section combined dropdown list (label: "Class 10-A", classId: "_id") for single select dropdowns.
   */
  async getClassSectionDropdown(schoolId, academicSession = null) {
    const { ObjectId } = mongoose.Types;

    const query = {
      schoolId: new ObjectId(schoolId),
      status: 'active',
    };
    if (academicSession) {
      query.academicSession = academicSession.trim();
    }

    const classes = await Class.find(query)
      .select('_id name level section academicSession')
      .sort({ level: 1, section: 1 });

    return classes.map((c) => {
      const label = c.section ? `${c.name}-${c.section}` : c.name;
      return {
        classId: c._id,
        _id: c._id,
        label,
        name: c.name,
        section: c.section,
        level: c.level,
        academicSession: c.academicSession,
      };
    });
  }

  /**
   * Get distinct class names for a school.
   */
  async getClassNames(schoolId, academicSession) {
    const { ObjectId } = mongoose.Types;
    const query = { schoolId: new ObjectId(schoolId), status: 'active' };
    if (academicSession) query.academicSession = academicSession.trim();

    const names = await Class.distinct('name', query);
    return names.sort();
  }

  /**
   * Get available sections and their classIds for a specific class name.
   */
  async getSectionsByName(schoolId, { name, academicSession }) {
    const { ObjectId } = mongoose.Types;
    const query = {
      schoolId: new ObjectId(schoolId),
      name: name.trim(),
      status: 'active',
    };
    if (academicSession) query.academicSession = academicSession.trim();

    const classes = await Class.find(query)
      .select('_id section level academicSession')
      .sort({ section: 1 });

    return classes.map((c) => ({
      classId: c._id,
      _id: c._id,
      section: c.section,
      level: c.level,
      academicSession: c.academicSession,
    }));
  }

  /**
   * Find a unique class by name, section, and optional academicSession.
   */
  async findByNameAndSection(schoolId, { name, section, academicSession }) {
    const { ObjectId } = mongoose.Types;
    const query = {
      schoolId: new ObjectId(schoolId),
      name: name.trim(),
      section: section.trim().toUpperCase(),
    };
    if (academicSession) {
      query.academicSession = academicSession.trim();
    }

    const classDoc = await Class.findOne(query).select('_id name level section academicSession');
    if (!classDoc) {
      throw new NotFoundException(`Class '${name}' with Section '${section}' not found`);
    }

    const obj = classDoc.toObject();
    return {
      classId: obj._id,
      ...obj,
    };
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
