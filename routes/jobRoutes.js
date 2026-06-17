const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// router.get("/", async (req, res) => {
//     try {

//         const jobs = await Job.find().sort({
//             createdAt: -1
//         });

//         res.status(200).json(jobs);

//     } catch (error) {

//         res.status(500).json({
//             message: error.message
//         });

//     }
// });
router.get("/", async (req, res) => {
    try {

        const Employer =
            require("../models/Employer");

        const jobs =
            await Job.find().sort({
                createdAt: -1
            });

        const result = [];

        for (let job of jobs) {

            const employer =
                await Employer.findOne({
                    phone: job.employerPhone
                });

            result.push({
                ...job._doc,

                employerRating:
                    employer?.rating || 0,

                employerTotalRatings:
                    employer?.totalRatings || 0
            });

        }

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.get("/count/:phone", async (req, res) => {
    try {
        const jobs = await Job.find({
            employerPhone: req.params.phone,
        });

        res.json({
            count: jobs.length,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {

        const {
            title,
            description,
            location,
            wage,
            employerPhone
        } = req.body;

        const job = await Job.create({
            title,
            description,
            location,
            wage,
            employerPhone
        });

        res.status(201).json({
            message: "Job posted successfully",
            job
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


router.get("/employer/:phone", async (req, res) => {
    try {

        const jobs = await Job.find({
            employerPhone: req.params.phone
        }).sort({
            createdAt: -1
        });


        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.delete("/:id", async (req, res) => {
    try {

        await Job.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.put("/:id", async (req, res) => {
    try {

        const updatedJob =
            await Job.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.status(200).json({
            message: "Job updated successfully",
            updatedJob
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;