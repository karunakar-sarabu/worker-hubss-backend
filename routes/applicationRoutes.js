const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

router.post("/", async (req, res) => {
    try {

        const { workerPhone, jobId } = req.body;

        const existingApplication =
            await Application.findOne({
                workerPhone,
                jobId
            });

        if (existingApplication) {
            return res.status(400).json({
                message: "Already applied for this job"
            });
        }

        const application =
            await Application.create({
                workerPhone,
                jobId
            });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// router.get("/", async (req, res) => {
//   try {

//     const applications =
//       await Application.find()
//       .sort({ createdAt: -1 });

//     res.status(200).json(applications);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }
// });

router.get("/", async (req, res) => {
    try {

        const Application =
            require("../models/Application");

        const Job =
            require("../models/Job");

        const applications =
            await Application.find()
                .sort({ createdAt: -1 });

        const result = [];

        for (let app of applications) {

            const job =
                await Job.findById(app.jobId);

            result.push({
                _id: app._id,
                workerPhone: app.workerPhone,
                jobTitle: job ? job.title : "Job Deleted",
                status: app.status
            });
        }

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.put("/:id", async (req, res) => {
    try {

        const { status } = req.body;

        const application =
            await Application.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

        res.status(200).json({
            message: "Status updated successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.get("/worker/:phone", async (req, res) => {
  try {

    const Job = require("../models/Job");

    const applications =
      await Application.find({
        workerPhone: req.params.phone
      });

    const result = [];

    for (let app of applications) {

      const job =
        await Job.findById(app.jobId);

      result.push({
        _id: app._id,
        jobTitle: job ? job.title : "Job Deleted",
        status: app.status
      });
    }

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;