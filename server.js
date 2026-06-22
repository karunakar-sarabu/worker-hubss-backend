const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const result = dotenv.config();

console.log(result);
console.log("KEY =", process.env.GEMINI_API_KEY);

const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

connectDB();

const workerRoutes = require("./routes/workerRoutes");

const employerRoutes = require("./routes/EmployerRoutes");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes =require("./routes/profileRoutes");
const otpRoutes = require("./routes/otpRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatbotRoutes =
    require("./routes/chatbotRoutes");

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
app.use("/api/workers", workerRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use( "/api/applications",  applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/ai", aiRoutes);
app.use( "/api/chatbot",chatbotRoutes);

app.get("/", (req, res) => {
    res.send("Daily Wage Connect API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});