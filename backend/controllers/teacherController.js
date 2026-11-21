const Teacher = require("../models/Teacher");
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
// DELETE FILE SAFELY
// =====================================================

const deleteTeacherImage = async (imagePath) => {

    console.log("\n=================================");
    console.log("IMAGE DELETE PROCESS");
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
            "Image renamed temporarily:"
        );

        console.log(
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



// =====================================================
// ADD TEACHER
// =====================================================

const addTeacher = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            subject,
            qualification
        } = req.body;


        const image = req.file
            ? `/uploads/teachers/${req.file.filename}`
            : null;


        const teacher = await Teacher.create({

            name,
            email,
            phone,
            subject,
            qualification,
            ProfileImage: image

        });


        return res.status(201).json({

            success: true,

            message:
                "Teacher added successfully",

            teacher

        });


    } catch (error) {

        console.error(
            "ADD TEACHER ERROR:",
            error
        );


        // If teacher creation failed but
        // Multer already uploaded an image,
        // clean that image.

        if (req.file) {

            const uploadedImagePath =
                path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "teachers",
                    req.file.filename
                );


            try {

                await fs.promises.rm(
                    uploadedImagePath,
                    {
                        force: true,
                        maxRetries: 5,
                        retryDelay: 500
                    }
                );

                console.log(
                    "Unused uploaded image cleaned."
                );

            } catch (cleanupError) {

                console.error(
                    "Uploaded image cleanup failed:",
                    cleanupError.message
                );
            }
        }


        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "Email already exists"

            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to add teacher",

            error: error.message

        });
    }
};



// =====================================================
// GET ALL TEACHERS
// =====================================================

const getTeachers = async (req, res) => {

    try {

        const teachers =
            await Teacher.find()
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count: teachers.length,

            teachers

        });


    } catch (error) {

        console.error(
            "GET TEACHERS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get teachers",

            error: error.message

        });
    }
};



// =====================================================
// GET SINGLE TEACHER
// =====================================================

const getTeacher = async (req, res) => {

    try {

        const teacher =
            await Teacher.findById(
                req.params.id
            );


        if (!teacher) {

            return res.status(404).json({

                success: false,

                message:
                    "Teacher not found"

            });
        }


        return res.status(200).json({

            success: true,

            teacher

        });


    } catch (error) {

        console.error(
            "GET TEACHER ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get teacher",

            error: error.message

        });
    }
};



// =====================================================
// UPDATE TEACHER
// =====================================================

const updateTeacher = async (req, res) => {

    let newImagePath = null;


    try {

        const {
            name,
            email,
            phone,
            subject,
            qualification
        } = req.body;


        const teacher =
            await Teacher.findById(
                req.params.id
            );


        if (!teacher) {

            // Remove newly uploaded image
            // because teacher doesn't exist.

            if (req.file) {

                newImagePath =
                    path.join(
                        __dirname,
                        "..",
                        "uploads",
                        "teachers",
                        req.file.filename
                    );


                await deleteTeacherImage(
                    newImagePath
                );
            }


            return res.status(404).json({

                success: false,

                message:
                    "Teacher not found"

            });
        }


        // -------------------------------------------------
        // Save old values
        // -------------------------------------------------

        const oldProfileImage =
            teacher.ProfileImage;


        const oldTeacherData = {

            name: teacher.name,

            email: teacher.email,

            phone: teacher.phone,

            subject: teacher.subject,

            qualification:
                teacher.qualification,

            ProfileImage:
                teacher.ProfileImage
        };


        // -------------------------------------------------
        // New uploaded image
        // -------------------------------------------------

        if (req.file) {

            newImagePath =
                path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "teachers",
                    req.file.filename
                );


            teacher.ProfileImage =
                `/uploads/teachers/${req.file.filename}`;
        }


        teacher.name = name;

        teacher.email = email;

        teacher.phone = phone;

        teacher.subject = subject;

        teacher.qualification =
            qualification;


        // -------------------------------------------------
        // Save database
        // -------------------------------------------------

        await teacher.save();


        console.log(
            "Teacher updated successfully."
        );


        // -------------------------------------------------
        // Delete old image AFTER successful DB update
        // -------------------------------------------------

        if (
            req.file &&
            oldProfileImage
        ) {

            const oldFileName =
                path.basename(
                    oldProfileImage
                );


            const oldImagePath =
                path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "teachers",
                    oldFileName
                );


            const deleted =
                await deleteTeacherImage(
                    oldImagePath
                );


            if (!deleted) {

                console.log(
                    "WARNING: Old image could not be deleted."
                );

                console.log(
                    "New teacher data remains saved."
                );
            }
        }


        return res.status(200).json({

            success: true,

            message:
                "Teacher updated successfully",

            teacher

        });


    } catch (error) {

        console.error(
            "UPDATE TEACHER ERROR:",
            error
        );


        // -------------------------------------------------
        // If new image was uploaded but update failed,
        // remove the unused new image.
        // -------------------------------------------------

        if (newImagePath) {

            try {

                if (
                    fs.existsSync(
                        newImagePath
                    )
                ) {

                    await deleteTeacherImage(
                        newImagePath
                    );
                }

            } catch (cleanupError) {

                console.error(
                    "New image cleanup failed:",
                    cleanupError.message
                );
            }
        }


        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "Email already exists"

            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to update teacher",

            error: error.message

        });
    }
};



// =====================================================
// UPDATE TEACHER IMAGE ONLY
// =====================================================

const updateTeacherImage = async (req, res) => {

    let newImagePath = null;


    try {

        const teacher =
            await Teacher.findById(
                req.params.id
            );


        if (!teacher) {

            if (req.file) {

                newImagePath =
                    path.join(
                        __dirname,
                        "..",
                        "uploads",
                        "teachers",
                        req.file.filename
                    );


                await deleteTeacherImage(
                    newImagePath
                );
            }


            return res.status(404).json({

                success: false,

                message:
                    "Teacher not found"

            });
        }


        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select an image"

            });
        }


        // -------------------------------------------------
        // Save old image
        // -------------------------------------------------

        const oldProfileImage =
            teacher.ProfileImage;


        // -------------------------------------------------
        // New image
        // -------------------------------------------------

        newImagePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                "teachers",
                req.file.filename
            );


        teacher.ProfileImage =
            `/uploads/teachers/${req.file.filename}`;


        // -------------------------------------------------
        // Save DB first
        // -------------------------------------------------

        await teacher.save();


        console.log(
            "New teacher image saved."
        );


        // -------------------------------------------------
        // Delete old image
        // -------------------------------------------------

        if (oldProfileImage) {

            const oldFileName =
                path.basename(
                    oldProfileImage
                );


            const oldImagePath =
                path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "teachers",
                    oldFileName
                );


            const deleted =
                await deleteTeacherImage(
                    oldImagePath
                );


            if (!deleted) {

                console.log(
                    "WARNING: Old teacher image could not be deleted."
                );
            }
        }


        return res.status(200).json({

            success: true,

            message:
                "Teacher image updated successfully",

            teacher

        });


    } catch (error) {

        console.error(
            "UPDATE TEACHER IMAGE ERROR:",
            error
        );


        // -------------------------------------------------
        // Remove new image if DB update failed
        // -------------------------------------------------

        if (newImagePath) {

            try {

                if (
                    fs.existsSync(
                        newImagePath
                    )
                ) {

                    await deleteTeacherImage(
                        newImagePath
                    );
                }

            } catch (cleanupError) {

                console.error(
                    "New image cleanup failed:",
                    cleanupError.message
                );
            }
        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to update teacher image",

            error: error.message

        });
    }
};



// =====================================================
// DELETE TEACHER — SAFE VERSION (DB FIRST, IMAGE LATER)
// =====================================================

const deleteTeacher = async (req, res) => {

    try {

        console.log("\n=================================");
        console.log("SAFE DELETE TEACHER");
        console.log("=================================");


        console.log(
            "Teacher ID:",
            req.params.id
        );


        // -------------------------------------------------
        // STEP 1: Find teacher
        // -------------------------------------------------

        const teacher =
            await Teacher.findById(
                req.params.id
            );


        if (!teacher) {

            return res.status(404).json({

                success: false,

                message:
                    "Teacher not found"

            });
        }


        console.log(
            "Teacher found:",
            teacher.name
        );


        console.log(
            "ProfileImage:",
            teacher.ProfileImage
        );


        // -------------------------------------------------
        // STEP 2: Build image path
        // -------------------------------------------------

        let imagePath = null;


        if (teacher.ProfileImage) {

            const fileName =
                path.basename(
                    teacher.ProfileImage
                );


            imagePath =
                path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "teachers",
                    fileName
                );


            console.log(
                "Physical image path:",
                imagePath
            );
        }


        // -------------------------------------------------
        // STEP 3: Delete DATABASE record FIRST
        // -------------------------------------------------

        try {

            const deletedTeacher =
                await Teacher.findByIdAndDelete(
                    req.params.id
                );


            if (!deletedTeacher) {

                console.log(
                    "Teacher record was not found during final deletion."
                );


                return res.status(404).json({

                    success: false,

                    message:
                        "Teacher could not be deleted because the record no longer exists."

                });
            }


            console.log(
                "Teacher database record deleted successfully."
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
                    "Teacher database deletion failed. Record was NOT deleted.",

                databaseError:
                    databaseError.message

            });
        }


        // -------------------------------------------------
        // STEP 4: Delete image AFTER DB deletion
        // -------------------------------------------------

        if (imagePath) {

            console.log(
                "\nTrying to delete teacher image..."
            );


            const imageDeleted =
                await deleteTeacherImage(
                    imagePath
                );


            if (!imageDeleted) {

                console.log(
                    "\nWARNING: Image could not be deleted."
                );


                console.log(
                    "Teacher record IS deleted. Image is orphaned."
                );


                // Teacher is deleted — we don't fail the request.
                // Just inform the client.

                return res.status(200).json({

                    success: true,

                    message:
                        "Teacher deleted successfully, but profile image could not be removed (file locked). It will be cleaned up later.",

                    imageOrphaned: true

                });
            }


            console.log(
                "Teacher image deleted successfully."
            );
        }


        // -------------------------------------------------
        // FINAL SUCCESS
        // -------------------------------------------------

        console.log(
            "Teacher deletion completed successfully."
        );


        return res.status(200).json({

            success: true,

            message:
                "Teacher and profile image deleted successfully"

        });


    } catch (error) {

        console.error(
            "\nSAFE DELETE TEACHER ERROR:"
        );

        console.error(
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete teacher",

            error:
                error.message

        });
    }
};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    addTeacher,

    getTeachers,

    getTeacher,

    updateTeacher,

    updateTeacherImage,

    deleteTeacher

};