// models/TeacherProfile.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

const teacherProfileSchema = new Schema(
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
    department: { type: String, trim: true },
    specialization: { type: String, trim: true },
    qualifications: [{ type: String, trim: true }],
    joiningDate: { type: Date },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model('Teacher', teacherProfileSchema);