
const API_URL =
    "http://localhost:3000/api/teachers";


// ========================================
// GET HTML ELEMENTS
// ========================================

const form =
    document.getElementById(
        "editTeacherForm"
    );

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const submitBtn =
    document.getElementById("submitBtn");

const profileImage =
    document.getElementById("profileImage");

const profilePreview =
    document.getElementById("profilePreview");

const profilePlaceholder =
    document.getElementById(
        "profilePlaceholder"
    );


// ========================================
// GET TEACHER ID FROM URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const teacherId =
    params.get("id");


// ========================================
// CHECK TEACHER ID
// ========================================

if (teacherId) {

    loadTeacher();

} else {

    loading.style.display = "none";

    showMessage(
        "Teacher ID is missing.",
        "error"
    );

}


// ========================================
// LOAD TEACHER
// ========================================

async function loadTeacher() {

    try {

        const response =
            await fetch(
                `${API_URL}/${teacherId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Teacher not found"
            );

        }


        const teacher =
            data.teacher;


        // ========================================
        // LOAD TEXT DATA
        // ========================================

        document.getElementById(
            "name"
        ).value =
            teacher.name || "";


        document.getElementById(
            "email"
        ).value =
            teacher.email || "";


        document.getElementById(
            "phone"
        ).value =
            teacher.phone || "";


        document.getElementById(
            "subject"
        ).value =
            teacher.subject || "";


        document.getElementById(
            "qualification"
        ).value =
            teacher.qualification || "";


        // ========================================
        // LOAD EXISTING PROFILE IMAGE
        // ========================================

        if (teacher.ProfileImage) {

            const imageUrl =
                getTeacherImageUrl(
                    teacher.ProfileImage
                );


            profilePreview.src =
                imageUrl;

            profilePreview.style.display =
                "block";

            profilePlaceholder.style.display =
                "none";


            console.log(
                "Current teacher image:",
                imageUrl
            );

        } else {

            showImagePlaceholder();

        }


        // ========================================
        // SHOW FORM
        // ========================================

        loading.style.display =
            "none";

        form.style.display =
            "block";


    } catch (error) {

        console.error(
            "Load teacher error:",
            error
        );


        loading.style.display =
            "none";


        showMessage(
            error.message ||
            "Unable to load teacher.",
            "error"
        );

    }

}


// ========================================
// IMAGE PREVIEW WHEN NEW IMAGE SELECTED
// ========================================

profileImage.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        // No file selected
        if (!file) {

            return;

        }


        // ========================================
        // CHECK IMAGE TYPE
        // ========================================

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Only JPG, PNG and WEBP images are allowed.",
                "error"
            );


            profileImage.value = "";

            return;

        }


        // ========================================
        // CHECK IMAGE SIZE
        // ========================================

        const maxSize =
            2 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            showMessage(
                "Image size must be less than 2MB.",
                "error"
            );


            profileImage.value = "";

            return;

        }


        // ========================================
        // CREATE PREVIEW
        // ========================================

        const imageUrl =
            URL.createObjectURL(file);


        profilePreview.src =
            imageUrl;

        profilePreview.style.display =
            "block";

        profilePlaceholder.style.display =
            "none";


        // Clear previous message
        message.textContent = "";

        message.className = "";


    }
);


// ========================================
// UPDATE TEACHER
// ========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ========================================
        // GET FORM VALUES
        // ========================================

        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const subject =
            document.getElementById(
                "subject"
            ).value.trim();


        const qualification =
            document.getElementById(
                "qualification"
            ).value.trim();


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !name ||
            !email ||
            !phone ||
            !subject ||
            !qualification
        ) {

            showMessage(
                "Please fill all fields.",
                "error"
            );

            return;

        }


        // ========================================
        // DISABLE BUTTON
        // ========================================

        submitBtn.disabled =
            true;

        submitBtn.textContent =
            "Updating...";


        try {

            // ========================================
            // CREATE FORMDATA
            // ========================================

            const formData =
                new FormData();


            // ========================================
            // ADD TEXT FIELDS
            // ========================================

            formData.append(
                "name",
                name
            );


            formData.append(
                "email",
                email
            );


            formData.append(
                "phone",
                phone
            );


            formData.append(
                "subject",
                subject
            );


            formData.append(
                "qualification",
                qualification
            );


            // ========================================
            // ADD PROFILE IMAGE
            // ONLY IF NEW IMAGE SELECTED
            // ========================================

            if (
                profileImage.files &&
                profileImage.files.length > 0
            ) {

                formData.append(
                    "ProfileImage",
                    profileImage.files[0]
                );


                console.log(
                    "New ProfileImage selected:",
                    profileImage.files[0].name
                );

            } else {

                console.log(
                    "No new image selected."
                );

            }


            // ========================================
            // DEBUG FORMDATA
            // ========================================

            console.log(
                "================================"
            );

            console.log(
                "UPDATING TEACHER"
            );

            console.log(
                "================================"
            );


            for (
                const [key, value]
                of formData.entries()
            ) {

                console.log(
                    key,
                    value
                );

            }


            // ========================================
            // SEND PUT REQUEST
            // ========================================

            const response =
                await fetch(
                    `${API_URL}/${teacherId}`,
                    {
                        method: "PUT",

                        body: formData
                    }
                );


            // ========================================
            // GET RESPONSE
            // ========================================

            const data =
                await response.json();


            console.log(
                "Update response:",
                data
            );


            // ========================================
            // CHECK RESPONSE
            // ========================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update teacher"
                );

            }


            // ========================================
            // SUCCESS
            // ========================================

            showMessage(
                "Teacher updated successfully!",
                "success"
            );


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                window.location.href =
                    `teacher-details.html?id=${teacherId}`;

            }, 0);


        } catch (error) {

            console.error(
                "Update teacher error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to update teacher.",
                "error"
            );


            // Enable button again

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Update Teacher";

        }

    }
);


// ========================================
// GET TEACHER IMAGE URL
// ========================================

function getTeacherImageUrl(
    imagePath
) {

    // No image

    if (!imagePath) {

        return null;

    }


    // Already full URL

    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {

        return imagePath;

    }


    // Backend image path

    return `http://localhost:3000${imagePath}`;

}


// ========================================
// SHOW IMAGE PLACEHOLDER
// ========================================

function showImagePlaceholder() {

    profilePreview.src = "";

    profilePreview.style.display =
        "none";

    profilePlaceholder.style.display =
        "flex";

}


// ========================================
// IMAGE LOAD ERROR
// ========================================

profilePreview.addEventListener(
    "error",
    function () {

        console.error(
            "Teacher profile image could not be loaded."
        );

        showImagePlaceholder();

    }
);


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        type;

}
