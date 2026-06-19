const express = require("express");
const bcrypt = require("bcryptjs");

const Worker = require("../models/worker");
const Employer = require("../models/Employer");

const router = express.Router();
const jwt = require("jsonwebtoken");


router.put("/reset-password", async (req, res) => {
    try {
        console.log("reset password called")
        const { phone, password } = req.body;
        console.log("Phone:", phone);
        const hashedPassword =
            await bcrypt.hash(password, 10);
         console.log("Password hashed");
        let user =
            await Worker.findOne({ phone });

        if (!user) {
           console.log("Searching employer");
            user =
                await Employer.findOne({ phone });
        }
        
        if (!user) {
            console.log("user not found")
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.password = hashedPassword;

        await user.save();
        console.log("Password saved");

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        });

    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("login route invoked")
        const { phone, password } = req.body;

        let user = await Worker.findOne({ phone });
        let role = "worker";

        if (!user) {
            console.log("login failed")
            user = await Employer.findOne({ phone });
            role = "employer";
        }

        if (!user) {
            console.log("login user not found")
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
            console.log("invvalid credentials")
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

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