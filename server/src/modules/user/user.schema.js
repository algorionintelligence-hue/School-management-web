// models/User.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { Gender, UserRole } from '../../common/constants.js';


const userSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: Gender},
    phone: { type: String, trim: true },
    profilePictureUrl: { type: String, trim: true },
    employeeId: { type: String, trim: true },
    studentId: { type: String, trim: true },
    enrollmentYear: { type: Number, min: 2000, max: 2100 },
    hireDate: { type: Date },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Unique constraints per school
userSchema.index({ schoolId: 1, email: 1 }, { unique: true });
userSchema.index({ schoolId: 1, studentId: 1 }, { unique: true, sparse: true });
userSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true, sparse: true });

// Fast login lookup
userSchema.index({ domain: 1, email: 1 });

// Common query patterns
userSchema.index({ schoolId: 1, role: 1, isActive: 1 });

export const User = mongoose.model('User', userSchema);