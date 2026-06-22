const express = require("express");
const Worker = require("../models/worker");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/debug/:phone", async (req, res) => {
  const worker = await Worker.findOne({
    phone: req.params.phone,
  });

  res.json(worker);
});

router.post("/register", async (req, res) => {
  try {

    const { name, phone, skill, skills, location, wage, password } = req.body;
    const workerExists = await Worker.findOne({ phone });

    if (workerExists) {
      console.log("worker already exists")
      return res.status(400).json({
        message: "Worker already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      name,
      phone,

      // old field (for backward compatibility)
      skill: skill || (skills && skills.length > 0 ? skills[0] : ""),

      // new field
      skills: skills || (skill ? [skill] : []),

      location,
      wage,
      password: hashedPassword
    });

    console.log("worker registered ok")
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

router.get("/", async (req, res) => {

  try {

    const workers = await Worker.find()
      .select("-password");

    res.status(200).json(workers);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.get("/:id", async (req, res) => {

  try {

    const worker =
      await Worker.findById(req.params.id)
        .select("-password");

    res.status(200).json(worker);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
module.exports = router;