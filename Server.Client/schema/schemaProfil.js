const mongoose = require("mongoose");

const profilSchema = mongoose.Schema(
    {
        profileImg: {
            type: Array,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            required: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        interested: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            trim: true
        },
        interests: {
            type: Array,
            trim: true
        },
        country: {
            type: String,
            trim: true
        },
        birthday: {
            type: Date
        },
        complete: {
            type: Number,
            default: 0
        }
    }
);

module.exports = mongoose.model("Profil", profilSchema);