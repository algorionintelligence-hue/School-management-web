import mongoose from 'mongoose';
import { Status } from '../../../../common/constants.js';

const syllabusSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    classSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSubject',
      required: true,
      index: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
    },
    completedHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 0,
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

// Unique constraint: One syllabus per class + class subject + academic year in a school
syllabusSchema.index(
  {
    schoolId: 1,
    academicYear: 1,
    classId: 1,
    classSubjectId: 1,
  },
  {
    unique: true,
  }
);

export const Syllabus = mongoose.model('Syllabus', syllabusSchema);
