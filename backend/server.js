const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/database");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const path = require("path");
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
// Student API
app.use("/api/students", studentRoutes);


// Teacher API
app.use("/api/teachers", teacherRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running"
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});