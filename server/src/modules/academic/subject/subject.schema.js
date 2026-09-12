// src/modules/subjects/subject.model.js

import mongoose from "mongoose";
import { SubjectCategory, SubjectType, Status } from "../../../common/constants.js";

const subjectSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },

    category: {
      type: String,
      required: true,
      enum: SubjectCategory,
    },

    type: {
      type: String,
      required: true,
      enum: SubjectType,
      default: SubjectType.COMPULSORY,
    },

    applicableLevels: {
      type: [
        {
          type: Number,
          min: 0,
          max: 12,
        },
      ],
      required: true,
      validate: {
        validator(levels) {
          return (
            Array.isArray(levels) &&
            levels.length > 0 &&
            new Set(levels).size === levels.length
          );
        },
        message:
          "At least one unique applicable level is required",
      },
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
      max: 200,
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
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

subjectSchema.index(
  {
    schoolId: 1,
    code: 1,
  },
  {
    unique: true,
  }
);

export const Subject = mongoose.model(
  "Subject",
  subjectSchema
);