const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

router.get("/worker-stats/:phone", async (req, res) => {
    try {

        const Worker = require("../models/worker");

        const worker =
            await Worker.findOne({
                phone: req.params.phone
            });

        const totalApplications =
            await Application.countDocuments({
                workerPhone: req.params.phone
            });

        const acceptedJobs =
            await Application.countDocuments({
                workerPhone: req.params.phone,
                status: "Accepted"
            });

        const completedJobs =
            await Application.countDocuments({
                workerPhone: req.params.phone,
                isCompleted: true
            });

        res.json({
            totalApplications,
            acceptedJobs,
            completedJobs,
            rating: worker?.rating || 0
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

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

router.get("/count/:phone", async (req, res) => {
    try {

        const count =
            await Application.countDocuments({
                workerPhone: req.params.phone,
            });

        res.json({ count });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
});
router.get("/:employerphone", async (req, res) => {
    try {


        const Worker = require("../models/worker");

        const Application =
            require("../models/Application");

        const Job =
            require("../models/Job");

        const employerPhone = req.params.employerPhone;

        const jobs = await Job.find({
            employerPhone: employerPhone
        });

        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({
            jobId: { $in: jobIds }
        }).sort({ createdAt: -1 });

        const result = [];



        for (let app of applications) {

            console.log("Application:", app);

            const job = await Job.findById(app.jobId);

            console.log("Job:", job);

            if (!job) continue;

            const worker = await Worker.findOne({
                phone: app.workerPhone
            });

            console.log("Worker:", worker);


            result.push({
                _id: app._id,
                workerPhone: app.workerPhone,
                workerName: worker?.name || "Unknown",
                skill: worker?.skill || "Not Added",
                location: worker?.location || "Not Added",
                experience: worker?.experience || 0,
                rating: worker?.rating || 0,

                isMobileVerified:
                    worker?.isMobileVerified || false,

                isAadhaarVerified:
                    worker?.isAadhaarVerified || false,

                jobTitle: job.title,
                status: app.status,
                isCompleted: app.isCompleted,
                isRated: app.isRated
            });
        }
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.log("ERROR:");
        console.log(error);

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

            if (!job) continue;

            result.push({
                _id: app._id,
                jobTitle: job.title,
                status: app.status,
                isCompleted: app.isCompleted,
                isEmployerRated: app.isEmployerRated
            });
        }


        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.get("/employer/count/:phone", async (req, res) => {
    try {

        const Job = require("../models/Job");

        const jobs = await Job.find({
            employerPhone: req.params.phone,
        });

        const jobIds = jobs.map(job => job._id);

        const count =
            await Application.countDocuments({
                jobId: { $in: jobIds }
            });

        res.json({ count });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// router.get("/employer/count/:phone", async (req, res) => {
//    ...
// });


// ADD HERE 👇

router.get("/employer-stats/:phone", async (req, res) => {
    try {

        const Job = require("../models/Job");

        const jobs = await Job.find({
            employerPhone: req.params.phone
        });

        const jobIds = jobs.map(job => job._id.toString());

        const completedJobs =
            await Application.countDocuments({
                jobId: { $in: jobIds },
                isCompleted: true
            });

        res.json({
            completedJobs
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// EXISTING CODE 👇

// router.put("/complete/:id", async (req, res) => {

router.put("/complete/:id", async (req, res) => {
    try {

        const application =
            await Application.findByIdAndUpdate(
                req.params.id,
                { isCompleted: true },
                { new: true }
            );

        res.status(200).json({
            message: "Job marked as completed",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});
router.get("/reviews/:workerPhone", async (req, res) => {

    try {

        const reviews =
            await Application.find({
                workerPhone: req.params.workerPhone,
                review: { $ne: "" }
            })
                .sort({ createdAt: -1 });

        res.status(200).json(reviews);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
router.put("/rate/:id", async (req, res) => {
    try {

        const { rating, review } = req.body;
        console.log(req.body);
        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const Worker =
            require("../models/worker");

        console.log("Application:", application);
        console.log("Worker Phone:", application.workerPhone);

        const workers = await Worker.find();

        console.log("All Workers:");
        console.log(workers);

        const worker =
            await Worker.findOne({
                phone: String(application.workerPhone).trim()
            });

        console.log("Worker Found:", worker);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        const totalScore =
            (worker.rating * worker.totalRatings) +
            rating;

        worker.totalRatings += 1;

        worker.rating =
            totalScore / worker.totalRatings;

        await worker.save();

        application.employerRating = rating;
        application.isRated = true;

        application.review = review;
        console.log(application);
        await application.save();

        res.status(200).json({
            message: "Worker rated successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

router.put("/rate-employer/:id", async (req, res) => {

    try {

        const { rating, review } = req.body;

        const application =
            await Application.findById(req.params.id);

        if (!application) {

            return res.status(404).json({
                message: "Application not found"
            });

        }

        const Job =
            require("../models/Job");

        const Employer =
            require("../models/Employer");

        const job =
            await Job.findById(application.jobId);

        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        const employer =
            await Employer.findOne({
                phone: job.employerPhone
            });

        if (!employer) {

            return res.status(404).json({
                message: "Employer not found"
            });

        }

        const totalScore =
            (employer.rating * employer.totalRatings)
            + rating;

        employer.totalRatings += 1;

        employer.rating =
            totalScore / employer.totalRatings;

        await employer.save();

        // application.workerRating = rating;
        // application.workerReview = review;
        // application.isEmployerRated = true;

        // await application.save();
        application.workerRating = rating;
        application.workerReview = review;
        application.isEmployerRated = true;

        console.log("Before Save:");
        console.log(application);

        await application.save();

        console.log("After Save:");
        console.log(application);

        res.status(200).json({
            message: "Employer rated successfully"
        });
        // res.status(200).json({
        //     message: "Employer rated successfully"
        // });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;