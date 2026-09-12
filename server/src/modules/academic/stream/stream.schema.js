import mongoose from "mongoose";
import { Status, StreamCode } from "../../../common/constants.js";

const streamSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: StreamCode,
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

streamSchema.index(
  {
    schoolId: 1,
    code: 1,
  },
  {
    unique: true,
  }
);

export const Stream = mongoose.model(
  "Stream",
  streamSchema
);