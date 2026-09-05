import mongoose from 'mongoose'
import { SchoolRange, SchoolShift, SchoolBoard } from '../../common/constants.js';
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

        legalName: {
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

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            country: {
                type: String,
                required: true,
                trim: true,
            },

            postalCode: {
                type: String,
                required: true,
                trim: true,
            },
        },

        logo: {
            type: String,
            default: null,
            trim: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
            index: true,
        },

        establishedYear: {
            type: Number,
            required: true,
            min: 1800,
            max: new Date().getFullYear(),
        },

        schoolRange: {
            type: String,
            enum: Object.values(SchoolRange),
            required: true,
        },

        shift: {
            type: String,
            enum: Object.values(SchoolShift),
            required: true,
        },

        numberOfCampus: {
            type: Number,
            required: true,
            min: 1,
        },

        selectedBoard: {
            type: String,
            enum: Object.values(SchoolBoard),
            required: true,
        },

        timezone: {
            type: String,
            required: true,
            default: "Asia/Karachi",
            trim: true,
        },
        locale: {
            type: String,
            required: true,
            default: "en-PK",
            trim: true,
        },
        startTime: {
            type: String,
            required: true,
            trim: true,
        },
        endTime: {
            type: String,
            required: true,
            trim: true, 
        },
        academicSession: {
            currentYear: {
                type: String,
                required: true,
                trim: true,
            },
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        },
        //optional metadata
        description: {
        type: String,
        trim: true,
        maxlength: 1000,
        },

        tagline: {
        type: String,
        trim: true,
        maxlength: 150,
        },
        isHeadCampus: {
        type: Boolean,
        default: true,
        index: true,
        },
        parentSchoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        default: null,
        index: true,
        },
        banner: {
        type: String,
        trim: true,
        default: null,
        },
    },
    {
        timestamps: true,
    }
);

schoolSchema.index({ domain: 1, isActive: 1 });
schoolSchema.index({ businessId: 1, isActive: 1 });
export const School = mongoose.model("School", schoolSchema);