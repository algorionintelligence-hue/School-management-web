import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
    {
        businessId: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
            trim: true,
            index: true,
        },

        domain: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const School = mongoose.model("School", schoolSchema);

module.exports = School;