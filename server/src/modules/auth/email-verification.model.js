import mongoose from "mongoose";

const emailVerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB automatically removes expired documents.
emailVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const EmailVerificationToken = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);