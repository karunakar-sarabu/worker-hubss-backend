// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Daily Wage Connect API Running...");
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

connectDB();

const workerRoutes = require("./routes/workerRoutes");

const employerRoutes = require("./routes/employerRoutes");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes =require("./routes/profileRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/workers", workerRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use( "/api/applications",  applicationRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("Daily Wage Connect API Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});