const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const uploadImage = (folder) => {

    const uploadDir = path.join(
        __dirname,
        `../uploads/${folder}`
    );

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true
        });
    }

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },

        filename: (req, file, cb) => {

            const uniqueName =
                Date.now() +
                "-" +
                crypto.randomBytes(6).toString("hex") +
                path.extname(file.originalname).toLowerCase();

            cb(null, uniqueName);
        }

    });

    const fileFilter = (req, file, cb) => {

        console.log("================================");
        console.log("IMAGE UPLOAD");
        console.log("Folder:", folder);
        console.log("Original Name:", file.originalname);
        console.log("MIME Type:", file.mimetype);
        console.log("================================");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            console.log("Image accepted");

            cb(null, true);

        } else {

            console.log("Image rejected");

            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                )
            );
        }
    };

    return multer({

        storage,

        fileFilter,

        limits: {
            fileSize: 2 * 1024 * 1024
        }

    });
};

module.exports = uploadImage;