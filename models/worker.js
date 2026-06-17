const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    skill: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    wage: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    about: {
      type: String,
      default: "",
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    isAadhaarVerified: {
      type: Boolean,
      default: false,
    },

    aadhaarStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    aadhaarStatus: {
      type: String,
      default: "pending"
    },

    aadhaarFile: {
      type: String,
      default: ""
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);