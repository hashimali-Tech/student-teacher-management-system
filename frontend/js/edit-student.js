const API_URL = "http://localhost:3000/api/students";
const SERVER_URL = "http://localhost:3000";


// =========================
// Get HTML Elements
// =========================

const form =
    document.getElementById("editStudentForm");

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
    document.getElementById("profilePlaceholder");


// =========================
// Get Student ID
// =========================

const urlParams =
    new URLSearchParams(window.location.search);

const studentId =
    urlParams.get("id");


// =========================
// Check Student ID
// =========================

if (!studentId) {

    showMessage(
        "Student ID is missing.",
        "error"
    );

} else {

    loadStudent();

}


// =========================
// Load Student
// =========================

async function loadStudent() {

    try {

        const response = await fetch(
            `${API_URL}/${studentId}`
        );

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Student not found"
            );

        }


        const student =
            data.student;


        // =========================
        // Fill Form Fields
        // =========================

        document.getElementById("name").value =
            student.name || "";

        document.getElementById("email").value =
            student.email || "";

        document.getElementById("phone").value =
            student.phone || "";

        document.getElementById("course").value =
            student.course || "";

        document.getElementById("semester").value =
            student.semester || "";


        // =========================
        // Show Existing Profile Image
        // =========================

        if (student.ProfileImage) {

            const imageURL =
                student.ProfileImage.startsWith("http")
                    ? student.ProfileImage
                    : `${SERVER_URL}/${student.ProfileImage.replace(/^\/+/, "")}`;


            profilePreview.src =
                imageURL;

            profilePreview.style.display =
                "block";

            profilePlaceholder.style.display =
                "none";

        } else {

            profilePreview.style.display =
                "none";

            profilePlaceholder.style.display =
                "flex";

        }


        // =========================
        // Hide Loading
        // =========================

        loading.style.display =
            "none";


        // =========================
        // Show Form
        // =========================

        form.style.display =
            "block";


    } catch (error) {

        console.error(error);

        loading.style.display =
            "none";

        showMessage(
            error.message ||
            "Unable to load student.",
            "error"
        );

    }

}


// =========================
// Preview New Image
// =========================

profileImage.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {
            return;
        }


        // Check image type

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            showMessage(
                "Only JPG, PNG and WEBP images are allowed.",
                "error"
            );

            this.value = "";

            return;
        }


        // Show preview

        const imageURL =
            URL.createObjectURL(file);

        profilePreview.src =
            imageURL;

        profilePreview.style.display =
            "block";

        profilePlaceholder.style.display =
            "none";

    }
);


// =========================
// Submit Updated Student
// =========================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // =========================
        // Get Values
        // =========================

        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const phone =
            document.getElementById("phone")
                .value
                .trim();

        const course =
            document.getElementById("course")
                .value
                .trim();

        const semester =
            document.getElementById("semester")
                .value;


        // =========================
        // Validate
        // =========================

        if (
            !name ||
            !email ||
            !phone ||
            !course ||
            !semester
        ) {

            showMessage(
                "Please fill all fields.",
                "error"
            );

            return;
        }


        // =========================
        // Disable Button
        // =========================

        submitBtn.disabled =
            true;

        submitBtn.textContent =
            "Updating...";


        // =========================
        // Create FormData
        // =========================

        const formData =
            new FormData();


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
            "course",
            course
        );

        formData.append(
            "semester",
            Number(semester)
        );


        // =========================
        // Add New Profile Image
        // =========================

        if (profileImage.files[0]) {

            formData.append(
                "ProfileImage",
                profileImage.files[0]
            );

        }


        try {

            // =========================
            // PUT Request
            // =========================

            const response =
                await fetch(
                    `${API_URL}/${studentId}`,
                    {
                        method: "PUT",

                        body: formData
                    }
                );


            const data =
                await response.json();


            // =========================
            // Check Response
            // =========================

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Failed to update student.",
                    "error"
                );


                submitBtn.disabled =
                    false;

                submitBtn.textContent =
                    "Update Student";

                return;
            }


            // =========================
            // Success
            // =========================

            showMessage(
                "Student updated successfully!",
                "success"
            );


            // =========================
            // Redirect
            // =========================

            // =========================
// Redirect to Students Page
// =========================

window.location.href = "students.html";


        } catch (error) {

            console.error(error);


            showMessage(
                "Unable to connect to server.",
                "error"
            );


            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Update Student";

        }

    }
);


// =========================
// Show Message
// =========================

function showMessage(text, type) {

    message.textContent =
        text;

    message.className =
        type;

}