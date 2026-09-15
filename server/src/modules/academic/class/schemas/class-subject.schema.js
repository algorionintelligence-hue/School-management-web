import mongoose from 'mongoose';
import { Status } from '../../../../common/constants.js';
const classSubjectSchema = new mongoose.Schema(
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
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    periodsPerWeek: {
      type: Number,
      min: 1,
      max: 50,
      default: null,
    },
    room: {
      type: String,
      trim: true,
      maxlength: 100,
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

classSubjectSchema.index(
  {
    schoolId: 1,
    academicSession: 1,
    classId: 1,
    subjectId: 1,
  },
  {
    unique: true,
  }
);

export const ClassSubject = mongoose.model('ClassSubject', classSubjectSchema);
