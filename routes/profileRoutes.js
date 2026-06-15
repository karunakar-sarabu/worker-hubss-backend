const express = require("express");
const router = express.Router();

const Worker = require("../models/Worker");
const Employer = require("../models/Employer");

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

module.exports = router;