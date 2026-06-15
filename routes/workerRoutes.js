const express = require("express");
const Worker = require("../models/worker");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, phone, skill, location, wage, password } = req.body;

    const workerExists = await Worker.findOne({ phone });

    if (workerExists) {
      return res.status(400).json({
        message: "Worker already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      name,
      phone,
      skill,
      location,
      wage,
      password:hashedPassword
    });

    res.status(201).json({
      message: "Worker registered successfully",
      worker,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;