const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: ["ADMIN", "TEACHER", "STUDENT"],
            required: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Email only needs to be unique inside a school.
 *
 * Therefore:
 *
 * School A -> teacher@gmail.com
 * School B -> teacher@gmail.com
 *
 * are both valid.
 */
userSchema.index(
    {
        schoolId: 1,
        email: 1,
    },
    {
        unique: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;  