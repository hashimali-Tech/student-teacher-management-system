const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const util = require("util");

const execFileAsync = util.promisify(execFile);


// =====================================================
// VERIFY FILE IS ACTUALLY DELETED
// =====================================================

const verifyFileDeleted = async (imagePath, methodName) => {

    // Windows lazy delete karta hai, thoda wait zaroori hai
    await new Promise(resolve => setTimeout(resolve, 300));

    if (fs.existsSync(imagePath)) {

        console.log(
            `VERIFY FAILED: File still exists after ${methodName}`
        );

        console.log(`   Path: ${imagePath}`);

        return false;
    }

    console.log(
        `VERIFY SUCCESS: File deleted by ${methodName}`
    );

    return true;
};


// =====================================================
// CONVERT DB IMAGE PATH TO PHYSICAL PATH
// =====================================================

const getPhysicalImagePath = (dbImagePath) => {

    if (!dbImagePath) return null;

    // /uploads/students/photo.jpg  ->  students/photo.jpg
    const relativePath =
        dbImagePath.replace(
            /^[\/\\]?uploads[\/\\]/,
            ""
        );

    return path.join(
        __dirname,
        "..",
        "uploads",
        relativePath
    );
};


// =====================================================
// DELETE STUDENT IMAGE SAFELY
// =====================================================

const deleteStudentImage = async (imagePath) => {

    console.log("\n=================================");
    console.log("STUDENT IMAGE DELETE PROCESS");
    console.log("=================================");
    console.log("Image path:", imagePath);


    // File already doesn't exist
    if (!fs.existsSync(imagePath)) {

        console.log("Image does not exist.");

        return true;
    }


    // -------------------------------------------------
    // METHOD 1: Node.js fs.rm()
    // -------------------------------------------------

    try {

        console.log("Trying Node.js fs.rm()...");

        await fs.promises.rm(imagePath, {
            force: true,
            maxRetries: 10,
            retryDelay: 500
        });


        // VERIFY
        if (await verifyFileDeleted(imagePath, "fs.rm()")) {

            return true;
        }

    } catch (error) {

        console.error(
            "fs.rm() failed:",
            error.code,
            error.message
        );
    }


    // -------------------------------------------------
    // METHOD 2: Windows PowerShell
    // -------------------------------------------------

    if (process.platform === "win32") {

        try {

            console.log(
                "Trying Windows PowerShell deletion..."
            );


            const escapedPath =
                imagePath.replace(/'/g, "''");


            await execFileAsync(
                "powershell.exe",
                [
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    `Remove-Item -LiteralPath '${escapedPath}' -Force -ErrorAction Stop`
                ]
            );


            // VERIFY
            if (await verifyFileDeleted(imagePath, "PowerShell")) {

                return true;
            }

        } catch (error) {

            console.error(
                "PowerShell deletion failed:"
            );

            console.error(
                error.stderr || error.message
            );
        }
    }


    // -------------------------------------------------
    // METHOD 3: Rename + Delete
    // -------------------------------------------------

    try {

        console.log(
            "Trying rename + delete method..."
        );


        const directory =
            path.dirname(imagePath);


        const extension =
            path.extname(imagePath);


        const temporaryName =
            `.deleted-${Date.now()}-${Math.random()
                .toString(16)
                .slice(2)}${extension}`;


        const temporaryPath =
            path.join(
                directory,
                temporaryName
            );


        await fs.promises.rename(
            imagePath,
            temporaryPath
        );


        console.log(
            "Image renamed temporarily:",
            temporaryPath
        );


        await fs.promises.rm(
            temporaryPath,
            {
                force: true,
                maxRetries: 10,
                retryDelay: 1000
            }
        );


        // VERIFY (original path check)
        if (!fs.existsSync(imagePath)) {

            console.log(
                "VERIFY SUCCESS: File deleted by rename method"
            );

            return true;
        }


        console.log(
            "VERIFY FAILED: Original file still exists!"
        );

        return false;


    } catch (error) {

        console.error(
            "Rename + delete failed:"
        );

        console.error(
            error.code,
            error.message
        );


        return false;
    }
};


// ======================================================
// ADD STUDENT
// ======================================================

const addStudent = async (req, res) => {

    try {

        console.log("\n========== ADD STUDENT ==========");

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);


        const {
            name,
            email,
            phone,
            course,
            semester
        } = req.body;


        // Create image path
        const image = req.file
            ? `/uploads/students/${req.file.filename}`
            : null;


        console.log("New Image Path:", image);


        // Create student
        const student = await Student.create({

            name,
            email,
            phone,
            course,
            semester,
            ProfileImage: image

        });


        console.log("Student Created:", student._id);


        res.status(201).json({

            success: true,

            message: "Student added successfully",

            student

        });


    } catch (error) {

        console.error("\nADD STUDENT ERROR:");
        console.error(error);


        // Duplicate email
        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message: "Email already exists"

            });

        }


        // Delete uploaded image if database creation fails
        if (req.file) {

            console.log(
                "Deleting uploaded image because student creation failed:",
                req.file.path
            );

            await deleteStudentImage(req.file.path);
        }


        res.status(500).json({

            success: false,

            message: "Failed to add student",

            error: error.message

        });

    }

};



// ======================================================
// GET ALL STUDENTS
// ======================================================

const getStudents = async (req, res) => {

    try {

        console.log("\n========== GET STUDENTS ==========");


        const students =
            await Student
                .find()
                .sort({ createdAt: -1 });


        console.log(
            "Students Found:",
            students.length
        );


        res.status(200).json({

            success: true,

            count: students.length,

            students

        });


    } catch (error) {

        console.error("\nGET STUDENTS ERROR:");
        console.error(error);


        res.status(500).json({

            success: false,

            message: "Failed to get students",

            error: error.message

        });

    }

};



// ======================================================
// GET SINGLE STUDENT
// ======================================================

const getStudent = async (req, res) => {

    try {

        console.log("\n========== GET SINGLE STUDENT ==========");

        console.log(
            "Student ID:",
            req.params.id
        );


        const student =
            await Student.findById(
                req.params.id
            );


        if (!student) {

            console.log("Student not found");


            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }


        console.log(
            "Student Found:",
            student.name
        );


        res.status(200).json({

            success: true,

            student

        });


    } catch (error) {

        console.error("\nGET SINGLE STUDENT ERROR:");
        console.error(error);


        res.status(500).json({

            success: false,

            message: "Failed to get student",

            error: error.message

        });

    }

};



// ======================================================
// UPDATE STUDENT
// ======================================================

const updateStudent = async (req, res) => {

    try {

        console.log("\n========== UPDATE STUDENT ==========");

        console.log(
            "Student ID:",
            req.params.id
        );

        console.log(
            "Request Body:",
            req.body
        );

        console.log(
            "New Uploaded File:",
            req.file
        );


        // ==================================================
        // GET FORM DATA
        // ==================================================

        const {
            name,
            email,
            phone,
            course,
            semester
        } = req.body;


        // ==================================================
        // FIND STUDENT
        // ==================================================

        const student =
            await Student.findById(
                req.params.id
            );


        if (!student) {

            console.log(
                "Student not found"
            );


            // Delete newly uploaded image
            if (req.file) {

                console.log(
                    "Deleting new image because student was not found:",
                    req.file.path
                );

                await deleteStudentImage(req.file.path);

            }


            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }


        // ==================================================
        // OLD IMAGE
        // ==================================================

        const oldImage =
            student.ProfileImage;


        console.log(
            "Old Image From Database:",
            oldImage
        );


        // ==================================================
        // UPDATE STUDENT DATA
        // ==================================================

        student.name =
            name;

        student.email =
            email;

        student.phone =
            phone;

        student.course =
            course;

        student.semester =
            semester;


        // ==================================================
        // UPDATE PROFILE IMAGE IF NEW IMAGE EXISTS
        // ==================================================

        if (req.file) {

            const newImage =
                `/uploads/students/${req.file.filename}`;


            console.log(
                "New Image Path:",
                newImage
            );


            student.ProfileImage =
                newImage;

        }


        // ==================================================
        // SAVE STUDENT
        // ==================================================

        console.log(
            "Saving student to MongoDB..."
        );


        await student.save();


        console.log(
            "Student saved successfully"
        );


        // ==================================================
        // DELETE OLD IMAGE
        // ==================================================

        if (
            req.file &&
            oldImage
        ) {

            console.log(
                "Old image needs to be deleted"
            );


            const oldFilePath =
                getPhysicalImagePath(oldImage);


            console.log(
                "Old Image Full Path:",
                oldFilePath
            );


            const deleted =
                await deleteStudentImage(
                    oldFilePath
                );


            if (!deleted) {

                console.log(
                    "WARNING: Old image could not be deleted."
                );
            }

        } else {

            console.log(
                "No old image deletion required"
            );

        }


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Student updated successfully",

            student

        });


    } catch (error) {

        console.error(
            "\nUPDATE STUDENT ERROR:"
        );

        console.error(error);


        // ==================================================
        // DELETE NEW IMAGE IF DATABASE UPDATE FAILED
        // ==================================================

        if (req.file) {

            console.log(
                "Deleting new image because database update failed:",
                req.file.path
            );


            await deleteStudentImage(req.file.path);

        }


        // ==================================================
        // DUPLICATE EMAIL
        // ==================================================

        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "Email already exists"

            });

        }


        // ==================================================
        // SERVER ERROR
        // ==================================================

        res.status(500).json({

            success: false,

            message:
                "Failed to update student",

            error:
                error.message

        });

    }

};



// ======================================================
// DELETE STUDENT — SAFE VERSION (DB FIRST, IMAGE LATER)
// ======================================================

const deleteStudent = async (req, res) => {

    try {

        console.log("\n========== DELETE STUDENT ==========");

        console.log(
            "Student ID:",
            req.params.id
        );


        // ==================================================
        // FIND STUDENT FIRST
        // ==================================================

        const student =
            await Student.findById(
                req.params.id
            );


        // ==================================================
        // CHECK STUDENT
        // ==================================================

        if (!student) {

            console.log(
                "Student not found"
            );


            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }


        // ==================================================
        // GET IMAGE PATH FROM DATABASE
        // ==================================================

        const studentImage =
            student.ProfileImage;


        console.log(
            "Student Image From Database:",
            studentImage
        );


        // ==================================================
        // BUILD PHYSICAL IMAGE PATH
        // ==================================================

        let imagePath = null;


        if (studentImage) {

            imagePath =
                getPhysicalImagePath(studentImage);


            console.log(
                "Physical Image Path:",
                imagePath
            );

        }


        // ==================================================
        // STEP 1: DELETE STUDENT FROM MONGODB FIRST
        // ==================================================

        try {

            const deletedStudent =
                await Student.findByIdAndDelete(
                    req.params.id
                );


            if (!deletedStudent) {

                console.log(
                    "Student record was not found during final deletion."
                );


                return res.status(404).json({

                    success: false,

                    message:
                        "Student could not be deleted because the record no longer exists."

                });

            }


            console.log(
                "Student deleted from MongoDB successfully."
            );


        } catch (databaseError) {

            console.error(
                "DATABASE DELETE FAILED:"
            );

            console.error(
                databaseError
            );


            return res.status(500).json({

                success: false,

                message:
                    "Student database deletion failed. Record was NOT deleted.",

                databaseError:
                    databaseError.message

            });
        }


        // ==================================================
        // STEP 2: DELETE IMAGE AFTER DB DELETION
        // ==================================================

        if (imagePath) {

            console.log(
                "\nTrying to delete student image..."
            );


            const imageDeleted =
                await deleteStudentImage(
                    imagePath
                );


            if (!imageDeleted) {

                console.log(
                    "\nWARNING: Image could not be deleted."
                );


                console.log(
                    "Student record IS deleted. Image is orphaned."
                );


                return res.status(200).json({

                    success: true,

                    message:
                        "Student deleted successfully, but profile image could not be removed (file locked). It will be cleaned up later.",

                    imageOrphaned: true

                });
            }


            console.log(
                "Student image deleted successfully."
            );
        }


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        console.log(
            "Student deletion completed successfully."
        );


        res.status(200).json({

            success: true,

            message:
                "Student and profile image deleted successfully."

        });


    } catch (error) {

        console.error(
            "\nDELETE STUDENT ERROR:"
        );

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to delete student",

            error:
                error.message

        });

    }

};



// ======================================================
// UPDATE STUDENT IMAGE ONLY
// ======================================================

const updateStudentImage = async (req, res) => {

    try {

        console.log(
            "\n========== UPDATE STUDENT IMAGE =========="
        );


        console.log(
            "Student ID:",
            req.params.id
        );


        console.log(
            "Uploaded File:",
            req.file
        );


        // ==================================================
        // CHECK NEW IMAGE
        // ==================================================

        if (!req.file) {

            console.log(
                "No image was uploaded"
            );


            return res.status(400).json({

                success: false,

                message:
                    "Please select an image."

            });

        }


        // ==================================================
        // FIND STUDENT
        // ==================================================

        const student =
            await Student.findById(
                req.params.id
            );


        if (!student) {

            console.log(
                "Student not found"
            );


            console.log(
                "Deleting newly uploaded image:",
                req.file.path
            );


            await deleteStudentImage(req.file.path);


            return res.status(404).json({

                success: false,

                message:
                    "Student not found."

            });

        }


        console.log(
            "Student found:",
            student.name
        );


        // ==================================================
        // GET OLD IMAGE
        // ==================================================

        const oldImage =
            student.ProfileImage;


        console.log(
            "OLD IMAGE FROM DATABASE:",
            oldImage
        );


        console.log(
            "CONTROLLER DIRECTORY:",
            __dirname
        );


        // ==================================================
        // CREATE NEW IMAGE PATH
        // ==================================================

        const newImage =
            `/uploads/students/${req.file.filename}`;


        console.log(
            "NEW IMAGE PATH:",
            newImage
        );


        // ==================================================
        // UPDATE DATABASE VALUE
        // ==================================================

        student.ProfileImage =
            newImage;


        console.log(
            "Saving new image path to MongoDB..."
        );


        await student.save();


        console.log(
            "New image path saved successfully"
        );


        // ==================================================
        // DELETE OLD IMAGE
        // ==================================================

        if (oldImage) {

            console.log(
                "Old image exists. Preparing to delete..."
            );


            const oldFilePath =
                getPhysicalImagePath(oldImage);


            console.log(
                "OLD IMAGE FULL PATH:",
                oldFilePath
            );


            const deleted =
                await deleteStudentImage(
                    oldFilePath
                );


            if (!deleted) {

                console.log(
                    "WARNING: OLD IMAGE COULD NOT BE DELETED."
                );
            }

        } else {

            console.log(
                "No old image exists."
            );

        }


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Profile picture updated successfully.",

            student

        });


    } catch (error) {

        console.error(
            "\nUPDATE STUDENT IMAGE ERROR:"
        );

        console.error(error);


        // ==================================================
        // DELETE NEW IMAGE IF DATABASE UPDATE FAILED
        // ==================================================

        if (req.file) {

            console.log(
                "Deleting new image because database update failed:",
                req.file.path
            );


            await deleteStudentImage(req.file.path);

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to update profile picture.",

            error:
                error.message

        });

    }

};



// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {

    addStudent,

    getStudents,

    getStudent,

    updateStudent,

    deleteStudent,

    updateStudentImage

};