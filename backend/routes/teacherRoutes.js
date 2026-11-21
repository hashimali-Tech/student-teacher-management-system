const express = require("express");

const router = express.Router();

const uploadImage =
    require("../middleware/uploadMiddleware");

const {
    addTeacher,
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher,
    updateTeacherImage
} = require("../controllers/teacherController");


// ========================================
// GET ALL TEACHERS
// GET /api/teachers
// ========================================

router.get(
    "/",
    getTeachers
);


// ========================================
// GET SINGLE TEACHER
// GET /api/teachers/:id
// ========================================

router.get(
    "/:id",
    getTeacher
);


// ========================================
// ADD TEACHER
// POST /api/teachers
// ========================================

router.post(
    "/",
    uploadImage("teachers").single("ProfileImage"),
    addTeacher
);


// ========================================
// UPDATE TEACHER
// PUT /api/teachers/:id
// ========================================

router.put(
    "/:id",
    uploadImage("teachers").single("ProfileImage"),
    updateTeacher
);


// ========================================
// UPDATE TEACHER IMAGE ONLY
// PUT /api/teachers/:id/image
// ========================================

router.put(
    "/:id/image",
    uploadImage("teachers").single("ProfileImage"),
    updateTeacherImage
);


// ========================================
// DELETE TEACHER
// DELETE /api/teachers/:id
// ========================================

router.delete(
    "/:id",
    deleteTeacher
);


module.exports = router;