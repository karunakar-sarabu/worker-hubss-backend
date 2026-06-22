const express = require("express");
const {
    careerAssistant
} = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", careerAssistant);

module.exports = router;