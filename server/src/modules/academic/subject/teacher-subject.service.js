// src/modules/academic/subject/teacher-subject.service.js

import mongoose from 'mongoose';
import { TeacherSubject } from './schemas/teacher-subject.schema.js';
import { Subject } from './schemas/subject.schema.js';
import { User } from '../../user/user.schema.js';
import { TeacherSubjectRole, UserRole } from '../../../common/constants.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../../common/errors/HttpException.js';

export class TeacherSubjectService {
  /**
   * Assign a teacher to a subject for a given academic session.
   *
   * Validations:
   *  - teacherId must be a User with role=teacher in this school
   *  - subjectId must belong to this school
   *  - No duplicate (schoolId, academicSession, teacherId, subjectId, role)
   */
  async assign(schoolId, assignDto) {
    const { ObjectId } = mongoose.Types;
    const schoolObjId = new ObjectId(schoolId);

    // 1. Validate teacher
    const teacher = await User.findOne({
      _id: assignDto.teacherId,
      schoolId: schoolObjId,
      role: UserRole.TEACHER,
    });

    if (!teacher) {
      throw new NotFoundException(
        'Teacher not found or does not belong to this school'
      );
    }

    // 2. Validate subject
    const subject = await Subject.findOne({
      _id: assignDto.subjectId,
      schoolId: schoolObjId,
    });

    if (!subject) {
      throw new NotFoundException(
        'Subject not found or does not belong to this school'
      );
    }

    // 3. Guard: teacher must not already hold the same role for this subject in this session
    const duplicate = await TeacherSubject.findOne({
      schoolId: schoolObjId,
      academicSession: assignDto.academicSession,
      teacherId: new ObjectId(assignDto.teacherId),
      subjectId: new ObjectId(assignDto.subjectId)
    });

    if (duplicate) {
      throw new ConflictException(
        'This teacher is already assigned to this subject with the same role for this academic session'
      );
    }

    const assignment = await TeacherSubject.create({
      schoolId: schoolObjId,
      academicSession: assignDto.academicSession,
      teacherId: new ObjectId(assignDto.teacherId),
      subjectId: new ObjectId(assignDto.subjectId),
    });

    return (
      await TeacherSubject.findById(assignment._id)
        .populate('teacherId', 'firstName lastName email')
        .populate('subjectId', 'name code category')
    ).toObject();
  }

  /**
   * List all assignments for a school.
   * Filterable by:
   *  - subjectId  — all teachers for a given subject
   *  - teacherId  — all subjects for a given teacher
   *  - academicSession
   *  - role
   */
  async findAll(schoolId, filters = {}) {
    const { ObjectId } = mongoose.Types;

    const query = { schoolId: new ObjectId(schoolId) };

    if (filters.subjectId)       query.subjectId = new ObjectId(filters.subjectId);
    if (filters.teacherId)       query.teacherId = new ObjectId(filters.teacherId);
    if (filters.academicSession) query.academicSession = filters.academicSession;

    const assignments = await TeacherSubject.find(query)
      .populate('teacherId', 'firstName lastName email')
      .populate('subjectId', 'name code category streamId')
      .sort({ academicSession: -1 });

    return assignments.map((a) => a.toObject());
  }

  /**
   * Get a single assignment by its _id.
   */
  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const assignment = await TeacherSubject.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    })
      .populate('teacherId', 'firstName lastName email')
      .populate('subjectId', 'name code category streamId');

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment.toObject();
  }

  /**
   * Remove a specific teacher-subject assignment by its _id.
   */
  async unassign(schoolId, id) {
    const { ObjectId } = mongoose.Types;

    const deleted = await TeacherSubject.findOneAndDelete({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!deleted) {
      throw new NotFoundException('Assignment not found');
    }
  }

  /**
   * Remove ALL assignments for a teacher in a given school (+ optional session filter).
   * Useful when a teacher leaves the school.
   */
  async unassignAllForTeacher(schoolId, teacherId, academicSession) {
    const { ObjectId } = mongoose.Types;

    const query = {
      schoolId: new ObjectId(schoolId),
      teacherId: new ObjectId(teacherId),
    };

    if (academicSession) query.academicSession = academicSession;

    const result = await TeacherSubject.deleteMany(query);
    return { deletedCount: result.deletedCount };
  }
}

export const teacherSubjectService = new TeacherSubjectService();
