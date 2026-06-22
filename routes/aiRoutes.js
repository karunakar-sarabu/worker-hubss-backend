const express = require("express");
const router = express.Router();
const {
    generateJobDescription,
    generateWorkerProfile,
    skillGapAdvisor
} = require("../controllers/aiController");

router.post("/generate-job-description", generateJobDescription);
router.post(
    "/skill-gap-advisor",
    skillGapAdvisor
);
router.post(
    "/generate-worker-profile",
    generateWorkerProfile
);

module.exports = router;