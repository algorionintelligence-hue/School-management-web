import mongoose from 'mongoose';
import { ClassSubject } from './schemas/class-subject.schema.js';
import { Class } from './schemas/class.schema.js';
import { Subject } from '../subject/schemas/subject.schema.js';
import { User } from '../../user/user.schema.js';
import { UserRole } from '../../../common/constants.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../../common/errors/HttpException.js';

export class ClassSubjectService {
  async assignSubjectToClass(schoolId, assignDto) {
    const { ObjectId } = mongoose.Types;
    const schoolObjId = new ObjectId(schoolId);

    // Validate Class
    const classDoc = await Class.findOne({
      _id: new ObjectId(assignDto.classId),
      schoolId: schoolObjId,
    });
    if (!classDoc) {
      throw new NotFoundException('Class not found in this school');
    }
    if (classDoc.academicSession !== assignDto.academicSession) {
      throw new BadRequestException('Class academicSession does not match the assignment session');
    }

    // Validate Subject
    const subject = await Subject.findOne({
      _id: new ObjectId(assignDto.subjectId),
      schoolId: schoolObjId,
    });
    if (!subject) {
      throw new NotFoundException('Subject not found in this school');
    }

    // Validate Teacher if provided
    if (assignDto.teacherId) {
      const teacher = await User.findOne({
        _id: new ObjectId(assignDto.teacherId),
        schoolId: schoolObjId,
        role: UserRole.TEACHER,
        isActive: true,
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found or is inactive');
      }
    }

    // Check for duplicate class-subject mapping
    const duplicate = await ClassSubject.findOne({
      schoolId: schoolObjId,
      academicSession: assignDto.academicSession,
      classId: new ObjectId(assignDto.classId),
      subjectId: new ObjectId(assignDto.subjectId),
    });

    if (duplicate) {
      throw new ConflictException('This subject is already assigned to this class for the given academic session');
    }

    const mapping = await ClassSubject.create({
      schoolId: schoolObjId,
      academicSession: assignDto.academicSession,
      classId: new ObjectId(assignDto.classId),
      subjectId: new ObjectId(assignDto.subjectId),
      teacherId: assignDto.teacherId ? new ObjectId(assignDto.teacherId) : null,
      periodsPerWeek: assignDto.periodsPerWeek,
      room: assignDto.room,
      status: assignDto.status,
    });

    return mapping.toObject();
  }

  async findAll(schoolId, filters = {}) {
    const { ObjectId } = mongoose.Types;
    const query = { schoolId: new ObjectId(schoolId) };

    if (filters.classId) query.classId = new ObjectId(filters.classId);
    if (filters.subjectId) query.subjectId = new ObjectId(filters.subjectId);
    if (filters.teacherId) query.teacherId = new ObjectId(filters.teacherId);
    if (filters.academicSession) query.academicSession = filters.academicSession;
    if (filters.status) query.status = filters.status;

    const assignments = await ClassSubject.find(query)
      .populate('classId', 'name level section academicSession')
      .populate('subjectId', 'name code category defaultType maxMarks passingMarks')
      .populate('teacherId', 'firstName middleName lastName email')
      .sort({ createdAt: -1 });

    return assignments.map((a) => a.toObject());
  }

  async findOne(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const mapping = await ClassSubject.findOne({
      _id: id,
      schoolId: new ObjectId(schoolId),
    })
      .populate('classId', 'name level section academicSession')
      .populate('subjectId', 'name code category defaultType maxMarks passingMarks')
      .populate('teacherId', 'firstName middleName lastName email');

    if (!mapping) {
      throw new NotFoundException('Class-Subject assignment not found');
    }

    return mapping.toObject();
  }

  async update(schoolId, id, updateDto) {
    const { ObjectId } = mongoose.Types;
    const schoolObjId = new ObjectId(schoolId);

    // Validate Teacher if updated
    if (updateDto.teacherId) {
      const teacher = await User.findOne({
        _id: new ObjectId(updateDto.teacherId),
        schoolId: schoolObjId,
        role: UserRole.TEACHER,
        isActive: true,
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found or is inactive');
      }
    }

    const mapping = await ClassSubject.findOneAndUpdate(
      { _id: id, schoolId: schoolObjId },
      { $set: updateDto },
      { new: true, runValidators: true }
    )
      .populate('classId', 'name level section academicSession')
      .populate('subjectId', 'name code category defaultType maxMarks passingMarks')
      .populate('teacherId', 'firstName middleName lastName email');

    if (!mapping) {
      throw new NotFoundException('Class-Subject assignment not found');
    }

    return mapping.toObject();
  }

  async remove(schoolId, id) {
    const { ObjectId } = mongoose.Types;
    const mapping = await ClassSubject.findOneAndDelete({
      _id: id,
      schoolId: new ObjectId(schoolId),
    });

    if (!mapping) {
      throw new NotFoundException('Class-Subject assignment not found');
    }
  }
}

export const classSubjectService = new ClassSubjectService();
