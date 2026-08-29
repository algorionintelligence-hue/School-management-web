// models/StudentProfile.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

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
    gradeLevel: { type: String, trim: true },
    section: { type: String, trim: true },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    guardianEmail: { type: String, lowercase: true, trim: true },
    admissionDate: { type: Date },
    bloodGroup: { type: String, trim: true },
    medicalNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentProfileSchema);