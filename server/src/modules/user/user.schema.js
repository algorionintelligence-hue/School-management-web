// models/User.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { Gender, UserRole } from '../../common/constants.js';


const userSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: false,
      default: null,
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
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: Gender},
    phone: { type: String, trim: true },
    profilePictureUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Unique constraints per school
userSchema.index({ schoolId: 1, email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);