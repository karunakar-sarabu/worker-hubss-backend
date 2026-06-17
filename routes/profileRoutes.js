const express = require("express");
const router = express.Router();

const Worker = require("../models/worker");
const Employer = require("../models/Employer");
const upload = require("../middleware/upload");
const multer = require("multer");

router.get("/:role/:phone", async (req, res) => {

    try {

        const { role, phone } = req.params;

        if (role === "worker") {

            const worker =
                await Worker.findOne({
                    phone
                });

            return res.json(worker);

        }

        if (role === "employer") {

            const employer =
                await Employer.findOne({
                    phone
                });

            return res.json(employer);

        }

        res.status(400).json({
            message: "Invalid role"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.post(
    "/aadhaar-upload/:phone",
    upload.single("aadhaar"),
    async (req, res) => {

        try {

            const worker =
                await Worker.findOneAndUpdate(
                    { phone: req.params.phone },
                    {
                        aadhaarFile: req.file.filename,
                        aadhaarStatus: "pending"
                    },
                    { new: true }
                );

            res.json({
                message: "Aadhaar uploaded successfully",
                worker
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

router.put("/aadhaar-approve/:phone", async (req, res) => {

    try {
        console.log("aadhar approve invoked")
        const worker =
            await Worker.findOneAndUpdate(
                { phone: req.params.phone },
                {
                    isAadhaarVerified: true,
                    aadhaarStatus: "approved"
                },
                { new: true }
            );
         console.log("aadhar approved")   
        res.json({
            message: "Aadhaar Approved",
            worker
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.put("/:role/:phone", async (req, res) => {

    try {

        const { role, phone } = req.params;

        if (role === "worker") {

            const worker =
                await Worker.findOneAndUpdate(
                    { phone },
                    req.body,
                    { new: true }
                );

            return res.status(200).json({
                message: "Profile updated successfully",
                worker
            });

        }

        if (role === "employer") {

            const employer =
                await Employer.findOneAndUpdate(
                    { phone },
                    req.body,
                    { new: true }
                );

            return res.status(200).json({
                message: "Profile updated successfully",
                employer
            });

        }

        res.status(400).json({
            message: "Invalid role"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});



router.post(
    "/upload/:phone",
    upload.single("profilePhoto"),
    async (req, res) => {
        try {

            const worker =
                await Worker.findOneAndUpdate(
                    {
                        phone: req.params.phone
                    },
                    {
                        profilePhoto:
                            req.file.filename
                    },
                    {
                        new: true
                    }
                );

            res.status(200).json({
                message: "Photo uploaded successfully",
                worker
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
    }
);
module.exports = router;