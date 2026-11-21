
const API_URL = "http://localhost:3000/api/students";

const SERVER_URL = "http://localhost:3000";


// =========================
// Get HTML Elements
// =========================

const studentDetails =
    document.getElementById("studentDetails");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");


// =========================
// Get Student ID From URL
// =========================

const urlParams =
    new URLSearchParams(window.location.search);

const studentId =
    urlParams.get("id");


// =========================
// Run When Page Loads
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // Check ID
    if (!studentId) {

        showError("Student ID is missing.");

        return;
    }


    // Get student
    getStudent();

});


// =========================
// Get Single Student
// =========================

async function getStudent() {

    try {

        // Show loading
        loading.style.display = "block";

        // Hide error
        errorMessage.style.display = "none";


        // API request
        const response = await fetch(
            `${API_URL}/${studentId}`
        );


        // Convert response to JSON
        const data =
            await response.json();


        console.log(
            "Student Details Response:",
            data
        );


        // Check response
        if (!response.ok) {

            throw new Error(
                data.message ||
                "Student not found"
            );

        }


        // Hide loading
        loading.style.display = "none";


        // Display student
        displayStudent(data.student);


    } catch (error) {

        console.error(
            "Error loading student:",
            error
        );


        loading.style.display = "none";


        showError(
            error.message ||
            "Unable to load student."
        );

    }

}


// =========================
// Display Student
// =========================

function displayStudent(student) {

    studentDetails.style.display = "block";


    // ==================================
    // Profile Image
    // ==================================

    let profileImageHTML = "";


    // IMPORTANT:
    // MongoDB field = ProfileImage

    if (student.ProfileImage) {

        const imageURL =
            student.ProfileImage.startsWith("http")
                ? student.ProfileImage
                : `${SERVER_URL}${student.ProfileImage}`;


        profileImageHTML = `

            <img
                src="${imageURL}"
                alt="${escapeHTML(student.name)}"
                class="details-profile-image"
                onerror="handleDetailsImageError(this)"
            >

            <div
                class="details-default-avatar"
                style="display: none;"
            >
                ${getInitials(student.name)}
            </div>

        `;

    } else {

        // No profile image
        profileImageHTML = `

            <div class="details-default-avatar">

                ${getInitials(student.name)}

            </div>

        `;

    }


    // ==================================
    // Complete Student HTML
    // ==================================

    studentDetails.innerHTML = `

        <!-- =========================
             DETAILS HEADER
        ========================== -->

        <div class="details-header">


            <!-- Profile Picture -->

            <div class="details-profile-wrapper">

                <div class="details-avatar">

                    ${profileImageHTML}

                </div>

            </div>


            <!-- Student Title -->

            <div class="student-title">

                <h2>
                    ${escapeHTML(student.name)}
                </h2>

                <p>
                    Student ID:
                    ${escapeHTML(student._id)}
                </p>

            </div>

        </div>


        <!-- =========================
             DETAILS BODY
        ========================== -->

        <div class="details-body">


            <!-- Full Name -->

            <div class="detail-item">

                <span class="detail-label">
                    Full Name
                </span>

                <span class="detail-value">
                    ${escapeHTML(student.name)}
                </span>

            </div>


            <!-- Email -->

            <div class="detail-item">

                <span class="detail-label">
                    Email
                </span>

                <span class="detail-value">
                    ${escapeHTML(student.email)}
                </span>

            </div>


            <!-- Phone -->

            <div class="detail-item">

                <span class="detail-label">
                    Phone
                </span>

                <span class="detail-value">
                    ${escapeHTML(student.phone)}
                </span>

            </div>


            <!-- Course -->

            <div class="detail-item">

                <span class="detail-label">
                    Course
                </span>

                <span class="detail-value">
                    ${escapeHTML(student.course)}
                </span>

            </div>


            <!-- Semester -->

            <div class="detail-item">

                <span class="detail-label">
                    Semester
                </span>

                <span class="detail-value">
                    Semester ${escapeHTML(student.semester)}
                </span>

            </div>


            <!-- Created At -->

            <div class="detail-item">

                <span class="detail-label">
                    Created At
                </span>

                <span class="detail-value">
                    ${formatDate(student.createdAt)}
                </span>

            </div>

        </div>


        <!-- =========================
             DETAILS FOOTER
        ========================== -->

        <div class="details-footer">


            <!-- Back -->

            <a
                href="students.html"
                class="details-btn"
            >
                ← Back to Students
            </a>


            <!-- Edit -->

            <a
                href="edit-student.html?id=${encodeURIComponent(student._id)}"
                class="details-btn edit-btn"
            >
                Edit Student
            </a>


            <!-- Delete -->

            <button
                type="button"
                class="details-btn delete-btn"
                onclick="deleteStudent('${student._id}')"
            >
                Delete Student
            </button>

        </div>

    `;

}


// =========================
// Image Error Handler
// =========================

function handleDetailsImageError(image) {

    // Hide broken image
    image.style.display = "none";


    // Find default avatar
    const defaultAvatar =
        image.parentElement.querySelector(
            ".details-default-avatar"
        );


    // Show initials
    if (defaultAvatar) {

        defaultAvatar.style.display = "flex";

    }

}


// =========================
// Get Initials
// =========================

function getInitials(name) {

    if (!name) {

        return "ST";

    }


    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// =========================
// Format Date
// =========================

function formatDate(date) {

    if (!date) {

        return "N/A";

    }


    return new Date(date).toLocaleDateString(
        "en-PK",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


// =========================
// Show Error
// =========================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

    studentDetails.style.display =
        "none";

}


// =========================
// Prevent HTML Injection
// =========================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


// =========================
// Delete Student
// =========================

async function deleteStudent(id) {

    // Confirmation
    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;

    }


    try {

        // DELETE request
        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        // Convert response
        const data =
            await response.json();


        // Check response
        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete student"
            );

        }


        // Success
        alert(
            "Student deleted successfully."
        );


        // Go back
        window.location.href ="students.html";


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete student."
        );

    }

}
