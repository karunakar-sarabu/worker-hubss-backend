const express = require("express");
const bcrypt = require("bcryptjs");

const Worker = require("../models/worker"0;
const Employer = require("../models/Employer");

const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    try {

        const { phone, password } = req.body;

        let user = await Worker.findOne({ phone });
        let role = "worker";

        if (!user) {
            user = await Employer.findOne({ phone });
            role = "employer";
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        const token = jwt.sign(
            {
                id: user._id,
                role: role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // res.status(200).json({
        //     message: "Login successful",
        //     role
        // });
        // res.status(200).json({
        //     message: "Login successful",
        //     role,
        //     token
        // });
        res.status(200).json({
            message: "Login successful",
            role,
            token,
            phone: user.phone
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;