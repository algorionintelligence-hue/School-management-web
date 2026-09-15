// src/modules/academic/subject/teacher-subject.schema.js

import mongoose from "mongoose";
import { TeacherSubjectRole } from "../../../../common/constants.js";

const teacherSubjectSchema = new mongoose.Schema(
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

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same teacher being assigned to the same subject twice in the same session with the same role
teacherSubjectSchema.index(
  {
    schoolId: 1,
    academicSession: 1,
    teacherId: 1,
    subjectId: 1,
    role: 1,
  },
  {
    unique: true,
  }
);

export const TeacherSubject = mongoose.model(
  "TeacherSubject",
  teacherSubjectSchema
);