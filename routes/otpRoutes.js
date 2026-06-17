const express = require("express");
const router = express.Router();

const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Send OTP
router.post("/send", async (req, res) => {
    try {

        const { phone } = req.body;

        const verification =
            await client.verify.v2
                .services(
                    process.env.TWILIO_VERIFY_SERVICE_SID
                )
                .verifications.create({
                    to: `+91${phone}`,
                    channel: "sms"
                });

        res.status(200).json({
            message: "OTP sent successfully",
            status: verification.status
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// Verify OTP
router.post("/verify", async (req, res) => {
    try {

        const { phone, otp } = req.body;

        const verificationCheck =
            await client.verify.v2
                .services(
                    process.env.TWILIO_VERIFY_SERVICE_SID
                )
                .verificationChecks.create({
                    to: `+91${phone}`,
                    code: otp
                });

        if (verificationCheck.status === "approved") {

            const Worker = require("../models/worker");

            const updatedWorker =
                await Worker.findOneAndUpdate(
                    { phone },
                    { isMobileVerified: true },
                    { new: true }
                );

            console.log("Worker Verified:");
            console.log(updatedWorker);

            return res.status(200).json({
                message: "OTP Verified"
            });

        }

        res.status(400).json({
            message: "Invalid OTP"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;