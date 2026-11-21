const express = require("express");

const router = express.Router();


// ========================================
// MIDDLEWARE
// ========================================

const uploadImage =
    require("../middleware/uploadMiddleware");


// ========================================
// CONTROLLERS
// ========================================

const {
    addStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    updateStudentImage
} = require("../controllers/studentController");


// ========================================
// CREATE STUDENT
// POST /api/students
// ========================================

router.post(
    "/",
    uploadImage("students").single("image"),
    addStudent
);


// ========================================
// GET ALL STUDENTS
// GET /api/students
// ========================================

router.get(
    "/",
    getStudents
);


// ========================================
// GET SINGLE STUDENT
// GET /api/students/:id
// ========================================

router.get(
    "/:id",
    getStudent
);


// ========================================
// UPDATE STUDENT INFORMATION
// PUT /api/students/:id
// ========================================

router.put(
    "/:id",
    uploadImage("students").single("ProfileImage"),
    updateStudent
);


// ========================================
// CHANGE STUDENT PROFILE IMAGE
// PUT /api/students/:id/image
// ========================================

router.put(
    "/:id/image",
    uploadImage("students").single("image"),
    updateStudentImage
);

// ========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ========================================

router.delete(
    "/:id",
    deleteStudent
);


module.exports = router;