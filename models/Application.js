const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    workerPhone: {
      type: String,
      required: true,
    },

    jobId: {
      type: String,
      required: true,
    },
    employerRating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      default: ""
    },
    isRated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    workerRating: {
      type: Number,
      default: 0
    },

    workerReview: {
      type: String,
      default: ""
    },

    isEmployerRated: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);