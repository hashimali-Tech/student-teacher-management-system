const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        qualification: {
            type: String,
            required: true,
            trim: true
        },

        ProfileImage: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Teacher = mongoose.model(
    "Teacher",
    teacherSchema
);

module.exports = Teacher;