const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0
    },

    totalRatings: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employer", employerSchema);