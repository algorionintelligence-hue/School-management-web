// src/modules/classes/class.model.js

import mongoose from "mongoose";
import { Section, Status } from "../../../../common/constants.js";

const classSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    academicSession: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    level: {
      type: Number,
      required: true,
      min: 0,
      max: 12,
    },

    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: Section,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 200,
    },

    enrolledStudentCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 200,
    },

    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: Status,
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

classSchema.index(
  {
    schoolId: 1,
    academicSession: 1,
    level: 1,
    streamId: 1,
    section: 1,
  },
  {
    unique: true,
  }
);

export const Class = mongoose.model(
  "Class",
  classSchema
);