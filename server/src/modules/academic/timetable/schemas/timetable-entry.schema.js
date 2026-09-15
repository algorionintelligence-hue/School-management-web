import mongoose from 'mongoose';
import { TimetableDay, Status } from '../../../../common/constants.js';

const timetableEntrySchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    academicSession: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    classSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSubject',
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: Object.values(TimetableDay),
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid lookup and conflict detection
timetableEntrySchema.index({ schoolId: 1, academicSession: 1, classId: 1, dayOfWeek: 1 });
timetableEntrySchema.index({ schoolId: 1, academicSession: 1, teacherId: 1, dayOfWeek: 1 });
timetableEntrySchema.index({ schoolId: 1, academicSession: 1, room: 1, dayOfWeek: 1 });

export const TimetableEntry = mongoose.model('TimetableEntry', timetableEntrySchema);
