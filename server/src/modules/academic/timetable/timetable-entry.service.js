import mongoose from 'mongoose';
import { TimetableEntry } from './schemas/timetable-entry.schema.js';
import { Class } from '../class/schemas/class.schema.js';
import { ClassSubject } from '../class/schemas/class-subject.schema.js';
import { TeacherSubject } from '../subject/schemas/teacher-subject.schema.js';
import { User } from '../../user/user.schema.js';
import { UserRole, Status } from '../../../common/constants.js';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '../../../common/errors/HttpException.js';

const { ObjectId } = mongoose.Types;

class TimetableEntryService {
  /**
   * Helper method to check for schedule overlaps (Class, Teacher, Room)
   */
  async checkConflicts({
    schoolId,
    academicSession,
    classId,
    teacherId,
    room,
    dayOfWeek,
    startTime,
    endTime,
    excludeEntryId = null,
  }) {
    const schoolObjId = new ObjectId(schoolId);
    const classObjId = new ObjectId(classId);
    const teacherObjId = new ObjectId(teacherId);

    const baseQuery = {
      schoolId: schoolObjId,
      academicSession,
      dayOfWeek,
      status: Status.ACTIVE,
      // Time overlap condition: existing.startTime < new.endTime AND existing.endTime > new.startTime
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    if (excludeEntryId) {
      baseQuery._id = { $ne: new ObjectId(excludeEntryId) };
    }

    // 1. Check Class Conflict
    const classConflict = await TimetableEntry.findOne({
      ...baseQuery,
      classId: classObjId,
    });
    if (classConflict) {
      throw new ConflictException(
        `Class is already scheduled for another period on ${dayOfWeek} between ${classConflict.startTime} and ${classConflict.endTime}`
      );
    }

    // 2. Check Teacher Conflict
    const teacherConflict = await TimetableEntry.findOne({
      ...baseQuery,
      teacherId: teacherObjId,
    });
    if (teacherConflict) {
      throw new ConflictException(
        `Teacher is already scheduled to teach another class on ${dayOfWeek} between ${teacherConflict.startTime} and ${teacherConflict.endTime}`
      );
    }

    // 3. Check Room Conflict (if room is assigned)
    if (room && room.trim() !== '') {
      const roomConflict = await TimetableEntry.findOne({
        ...baseQuery,
        room: room.trim(),
      });
      if (roomConflict) {
        throw new ConflictException(
          `Room '${room}' is already occupied on ${dayOfWeek} between ${roomConflict.startTime} and ${roomConflict.endTime}`
        );
      }
    }
  }

  /**
   * Create a new TimetableEntry
   */
  async createTimetableEntry(schoolId, dto) {
    const schoolObjId = new ObjectId(schoolId);
    const classObjId = new ObjectId(dto.classId);
    const classSubjectObjId = new ObjectId(dto.classSubjectId);
    const teacherObjId = new ObjectId(dto.teacherId);

    // 1. Validate Class
    const classObj = await Class.findOne({ _id: classObjId, schoolId: schoolObjId });
    if (!classObj) {
      throw new NotFoundException('Class not found in this school');
    }

    // 2. Validate ClassSubject
    const classSubjectObj = await ClassSubject.findOne({
      _id: classSubjectObjId,
      schoolId: schoolObjId,
    });
    if (!classSubjectObj) {
      throw new NotFoundException('ClassSubject not found in this school');
    }

    // Check that classSubject belongs to the provided class
    if (classSubjectObj.classId.toString() !== classObjId.toString()) {
      throw new BadRequestException('The specified ClassSubject does not belong to this Class');
    }

    // 3. Validate Teacher
    const teacherObj = await User.findOne({
      _id: teacherObjId,
      schoolId: schoolObjId,
      role: UserRole.TEACHER,
    });
    if (!teacherObj) {
      throw new NotFoundException('Teacher not found in this school');
    }

    // 4. Validate TeacherSubject mapping (Teacher is qualified to teach this subject in this session)
    const teacherSubjectObj = await TeacherSubject.findOne({
      schoolId: schoolObjId,
      teacherId: teacherObjId,
      subjectId: classSubjectObj.subjectId,
      academicSession: dto.academicSession,
    });

    if (!teacherSubjectObj) {
      throw new BadRequestException(
        'Teacher is not assigned to teach this subject in TeacherSubject for this academic session'
      );
    }

    // 5. Check Timetable Conflicts
    await this.checkConflicts({
      schoolId,
      academicSession: dto.academicSession,
      classId: dto.classId,
      teacherId: dto.teacherId,
      room: dto.room,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    // 6. Create TimetableEntry
    const newEntry = await TimetableEntry.create({
      schoolId: schoolObjId,
      academicSession: dto.academicSession,
      classId: classObjId,
      classSubjectId: classSubjectObjId,
      teacherId: teacherObjId,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      room: dto.room || null,
      status: dto.status || Status.ACTIVE,
    });

    return this.getTimetableEntryById(schoolId, newEntry._id);
  }

  /**
   * Update an existing TimetableEntry
   */
  async updateTimetableEntry(schoolId, entryId, dto) {
    const schoolObjId = new ObjectId(schoolId);
    const entryObjId = new ObjectId(entryId);

    const existingEntry = await TimetableEntry.findOne({
      _id: entryObjId,
      schoolId: schoolObjId,
    });
    if (!existingEntry) {
      throw new NotFoundException('Timetable entry not found');
    }

    const mergedSession = dto.academicSession || existingEntry.academicSession;
    const mergedClassId = dto.classId ? new ObjectId(dto.classId) : existingEntry.classId;
    const mergedClassSubjectId = dto.classSubjectId
      ? new ObjectId(dto.classSubjectId)
      : existingEntry.classSubjectId;
    const mergedTeacherId = dto.teacherId
      ? new ObjectId(dto.teacherId)
      : existingEntry.teacherId;
    const mergedDayOfWeek = dto.dayOfWeek || existingEntry.dayOfWeek;
    const mergedStartTime = dto.startTime || existingEntry.startTime;
    const mergedEndTime = dto.endTime || existingEntry.endTime;
    const mergedRoom = dto.room !== undefined ? dto.room : existingEntry.room;

    if (mergedStartTime >= mergedEndTime) {
      throw new BadRequestException('endTime must be later than startTime');
    }

    // 1. Validate Class
    const classObj = await Class.findOne({ _id: mergedClassId, schoolId: schoolObjId });
    if (!classObj) {
      throw new NotFoundException('Class not found in this school');
    }

    // 2. Validate ClassSubject
    const classSubjectObj = await ClassSubject.findOne({
      _id: mergedClassSubjectId,
      schoolId: schoolObjId,
    });
    if (!classSubjectObj) {
      throw new NotFoundException('ClassSubject not found in this school');
    }

    if (classSubjectObj.classId.toString() !== mergedClassId.toString()) {
      throw new BadRequestException('The specified ClassSubject does not belong to this Class');
    }

    // 3. Validate Teacher
    const teacherObj = await User.findOne({
      _id: mergedTeacherId,
      schoolId: schoolObjId,
      role: UserRole.TEACHER,
    });
    if (!teacherObj) {
      throw new NotFoundException('Teacher not found in this school');
    }

    // 4. Validate TeacherSubject mapping
    const teacherSubjectObj = await TeacherSubject.findOne({
      schoolId: schoolObjId,
      teacherId: mergedTeacherId,
      subjectId: classSubjectObj.subjectId,
      academicSession: mergedSession,
    });

    if (!teacherSubjectObj) {
      throw new BadRequestException(
        'Teacher is not assigned to teach this subject in TeacherSubject for this academic session'
      );
    }

    // 5. Check Timetable Conflicts excluding current entry
    await this.checkConflicts({
      schoolId,
      academicSession: mergedSession,
      classId: mergedClassId,
      teacherId: mergedTeacherId,
      room: mergedRoom,
      dayOfWeek: mergedDayOfWeek,
      startTime: mergedStartTime,
      endTime: mergedEndTime,
      excludeEntryId: entryId,
    });

    // Apply updates
    existingEntry.academicSession = mergedSession;
    existingEntry.classId = mergedClassId;
    existingEntry.classSubjectId = mergedClassSubjectId;
    existingEntry.teacherId = mergedTeacherId;
    existingEntry.dayOfWeek = mergedDayOfWeek;
    existingEntry.startTime = mergedStartTime;
    existingEntry.endTime = mergedEndTime;
    existingEntry.room = mergedRoom || null;
    if (dto.status) existingEntry.status = dto.status;

    await existingEntry.save();

    return this.getTimetableEntryById(schoolId, existingEntry._id);
  }

  /**
   * Get Timetable by Class
   */
  async getTimetableByClass(schoolId, classId, filters = {}) {
    const schoolObjId = new ObjectId(schoolId);
    const classObjId = new ObjectId(classId);

    const query = {
      schoolId: schoolObjId,
      classId: classObjId,
    };

    if (filters.academicSession) query.academicSession = filters.academicSession;
    if (filters.dayOfWeek) query.dayOfWeek = filters.dayOfWeek;
    if (filters.status) query.status = filters.status;
    else query.status = Status.ACTIVE;

    const entries = await TimetableEntry.find(query)
      .populate('classId', 'gradeLevel section streamId')
      .populate({
        path: 'classSubjectId',
        populate: { path: 'subjectId', select: 'name code subjectType category' },
      })
      .populate('teacherId', 'firstName lastName email designation department')
      .sort({ dayOfWeek: 1, startTime: 1 });

    return entries;
  }

  /**
   * Get Timetable by Teacher
   */
  async getTimetableByTeacher(schoolId, teacherId, filters = {}) {
    const schoolObjId = new ObjectId(schoolId);
    const teacherObjId = new ObjectId(teacherId);

    const query = {
      schoolId: schoolObjId,
      teacherId: teacherObjId,
    };

    if (filters.academicSession) query.academicSession = filters.academicSession;
    if (filters.dayOfWeek) query.dayOfWeek = filters.dayOfWeek;
    if (filters.status) query.status = filters.status;
    else query.status = Status.ACTIVE;

    const entries = await TimetableEntry.find(query)
      .populate('classId', 'gradeLevel section streamId')
      .populate({
        path: 'classSubjectId',
        populate: { path: 'subjectId', select: 'name code subjectType category' },
      })
      .populate('teacherId', 'firstName lastName email designation department')
      .sort({ dayOfWeek: 1, startTime: 1 });

    return entries;
  }

  /**
   * Get single TimetableEntry by ID
   */
  async getTimetableEntryById(schoolId, entryId) {
    const schoolObjId = new ObjectId(schoolId);
    const entryObjId = new ObjectId(entryId);

    const entry = await TimetableEntry.findOne({
      _id: entryObjId,
      schoolId: schoolObjId,
    })
      .populate('classId', 'gradeLevel section streamId')
      .populate({
        path: 'classSubjectId',
        populate: { path: 'subjectId', select: 'name code subjectType category' },
      })
      .populate('teacherId', 'firstName lastName email designation department');

    if (!entry) {
      throw new NotFoundException('Timetable entry not found');
    }

    return entry;
  }

  /**
   * Delete TimetableEntry
   */
  async deleteTimetableEntry(schoolId, entryId) {
    const schoolObjId = new ObjectId(schoolId);
    const entryObjId = new ObjectId(entryId);

    const deleted = await TimetableEntry.findOneAndDelete({
      _id: entryObjId,
      schoolId: schoolObjId,
    });

    if (!deleted) {
      throw new NotFoundException('Timetable entry not found');
    }

    return { message: 'Timetable entry deleted successfully' };
  }
}

export const timetableEntryService = new TimetableEntryService();
