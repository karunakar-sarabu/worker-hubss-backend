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

    status: {
      type: String,
      default: "Pending",
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