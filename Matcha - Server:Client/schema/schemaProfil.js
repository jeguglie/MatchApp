const mongoose = require("mongoose");
const config = require("../config/config");

const profilSchema = mongoose.Schema(
    {
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
        gender: {
            type: String,
            trim: true
        },
        interested: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }
);

module.exports = mongoose.model("Profil", profilSchema);

