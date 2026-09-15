// src/modules/academic/subject/subject.service.js

import mongoose from 'mongoose';
import { Subject } from './schemas/subject.schema.js';
import { Stream } from '../stream/stream.schema.js';
import { TeacherSubject } from './schemas/teacher-subject.schema.js';
import { createSubjectCodePrefix } from '../../../common/utils/subjectCode.util.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../../common/errors/HttpException.js';

/**
 * Generates a guaranteed-unique subject code within a school.
 * Format: <STREAM_CODE>-<SUBJECT_NAME>-<LEVEL_2DIGIT>-<4HEX>
 * e.g.  SCI-MATHEMATICS-10-A3F1
 */
async function generateUniqueCode(schoolId, { streamCode, subjectName, level }) {
  const prefix = createSubjectCodePrefix({ streamCode, subjectName, level });

  // Try up to 10 times to find a non-colliding suffix
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0');

    const candidate = `${prefix}-${suffix}`;

    const exists = await Subject.exists({
      schoolId,
      code: candidate,
    });

    if (!exists) return candidate;
  }

  throw new ConflictException(
    'Could not generate a unique subject code. Please supply one manually.'
  );
}

export class SubjectService {
  /**
   * Create a new subject for a school.
   *
   * Rules:
   *  - streamId must exist and belong to the same school
   *  - If code is NOT provided, auto-generate one
   *  - (schoolId, code) must be unique — enforced by DB index + pre-check
   */
  async create(schoolId, createSubjectDto) {
    const { ObjectId } = mongoose.Types;
    const schoolObjId = new ObjectId(schoolId);

    // 1. Validate that the stream exists for this school
    const stream = await Stream.findOne({
      _id: createSubjectDto.streamId,
      schoolId: schoolObjId,
    });

    if (!stream) {
      throw new NotFoundException(
        'Stream not found or does not belong to this school'
      );
    }

    // 2. Determine subject code
    let code = createSubjectDto.code
      ? createSubjectDto.code.trim().toUpperCase()
      : null;

    if (!code) {
      // Use the first applicable level for code generation
      const level = createSubjectDto.applicableLevels[0];
      code = await generateUniqueCode(schoolObjId, {
        streamCode: stream.code,
        subjectName: createSubjectDto.name,
        level,
      });
    } else {
      // Caller supplied a code — verify it's not already taken
      const codeExists = await Subject.exists({
        schoolId: schoolObjId,
        code,
      });

      if (codeExists) {
        throw new ConflictException(
          `Subject code "${code}" is already in use at this school`
        );
      }
    }

    // 3. Validate passing marks <= max marks
    if (createSubjectDto.passingMarks > createSubjectDto.maxMarks) {
      throw new BadRequestException(
        'Passing marks cannot exceed max marks'
      );
    }

    const subject = await Subject.create({
      ...createSubjectDto,
      code,
      schoolId: schoolObjId,
    });

    return subject.toObject();
  }

  /**
   * Get all subjects for a school.
   * Optional filters: streamId, status, category, type
   */
  async findAll(schoolId, filters = {}) {
    const { ObjectId } = mongoose.Types;

    const query = { schoolId: new ObjectId(schoolId) };

    if (filters.streamId) query.streamId = new ObjectId(filters.streamId);
    if (filters.status)   query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.type)     query.type = filters.type;

    const subjects = await Subject.find(query)
      .populate('streamId', 'name code')
      .sort({ name: 1, code: 1 });

    return subjects.map((s) => s.toObject());
  }

  /**
   * Get a single subject by id, scoped to schoolId.
   */
  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const subject = await Subject.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    }).populate('streamId', 'name code description');

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject.toObject();
  }

  /**
   * Update a subject by id, scoped to schoolId.
   * `code` and `streamId` are immutable.
   */
  async update(schoolId, id, updateSubjectDto) {
    const { ObjectId } = mongoose.Types;

    if (updateSubjectDto.code) {
      throw new BadRequestException(
        'Subject code cannot be changed after creation'
      );
    }

    if (updateSubjectDto.streamId) {
      throw new BadRequestException(
        'Subject stream cannot be changed after creation'
      );
    }

    // If marks are being updated, re-validate them against each other
    if (
      updateSubjectDto.passingMarks !== undefined ||
      updateSubjectDto.maxMarks !== undefined
    ) {
      const existing = await Subject.findOne({
        _id: id,
        schoolId: new ObjectId(schoolId),
      });

      if (!existing) throw new NotFoundException('Subject not found');

      const maxMarks =
        updateSubjectDto.maxMarks ?? existing.maxMarks;
      const passingMarks =
        updateSubjectDto.passingMarks ?? existing.passingMarks;

      if (passingMarks > maxMarks) {
        throw new BadRequestException('Passing marks cannot exceed max marks');
      }
    }

    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: id, schoolId: new ObjectId(schoolId) },
      { $set: updateSubjectDto },
      { new: true, runValidators: true }
    ).populate('streamId', 'name code');

    if (!updatedSubject) {
      throw new NotFoundException('Subject not found');
    }

    return updatedSubject.toObject();
  }

  /**
   * Hard-delete a subject by id, scoped to schoolId.
   * Guards: refuses deletion if TeacherSubject records still reference it.
   */
  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const subject = await Subject.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const assignmentCount = await TeacherSubject.countDocuments({
      subjectId: new ObjectId(id),
    });

    if (assignmentCount > 0) {
      throw new ConflictException(
        `Cannot delete this subject — ${assignmentCount} teacher assignment(s) still reference it. ` +
          'Remove those assignments first.'
      );
    }

    await Subject.deleteOne({ _id: id });
  }
}

export const subjectService = new SubjectService();
