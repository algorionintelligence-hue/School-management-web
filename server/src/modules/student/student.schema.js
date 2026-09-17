import mongoose, { Schema } from 'mongoose';
import { GradeLevel, Section, BloodGroup, Religion } from '../../common/constants.js';

const studentProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gradeLevel: { type: String, enum: Object.values(GradeLevel), trim: true },
    section: { type: String, enum: Object.values(Section), trim: true },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    guardianEmail: { type: String, lowercase: true, trim: true },
    guardianRelation: { type: String, trim: true },
    admissionDate: { type: Date },
    bloodGroup: { type: String, enum: Object.values(BloodGroup), trim: true },
    medicalNotes: { type: String, trim: true },
    hasTc: { type: Boolean, default: false },
    nationality: { type: String, trim: true },
    religion: { type: String, enum: Object.values(Religion), trim: true },
    academicSession: { type: String, trim: true },
    emergencyContactName: { type: String, trim: true },
    emergencyContactPhone: { type: String, trim: true },
    previousSchool: { type: String, trim: true },
    isAlumni: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentProfileSchema.index({ schoolId: 1, rollNumber: 1 }, { unique: true });

export const Student = mongoose.model('Student', studentProfileSchema);