const express = require("express");
const Employer = require("../models/Employer");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {

    const { companyName, phone, location, password } = req.body;

    const employerExists = await Employer.findOne({ phone });

    if (employerExists) {
      return res.status(400).json({
        message: "Employer already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = await Employer.create({
      companyName,
      phone,
      location,
      password: hashedPassword
    });
    console.log("emp registered at backend")
    res.status(201).json({
      message: "Employer registered successfully",
      employer
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


router.get("/:phone", async (req, res) => {
  try {

    const employer = await Employer.findOne({
      phone: req.params.phone
    });

    if (!employer) {
      return res.status(404).json({
        message: "Employer not found"
      });
    }

    res.status(200).json(employer);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;