
const API_URL = "http://localhost:3000/api/teachers";


// =========================
// Get HTML Elements
// =========================

const teachersContainer =
    document.getElementById("teachersContainer");

const teacherCount =
    document.getElementById("teacherCount");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const noTeachers =
    document.getElementById("noTeachers");


// =========================
// Load Teachers When Page Opens
// =========================

document.addEventListener("DOMContentLoaded", () => {

    getTeachers();

});


// =========================
// Get All Teachers
// =========================

async function getTeachers() {

    try {

        // Show loading
        loading.style.display = "block";

        // Hide previous error
        errorMessage.textContent = "";
        errorMessage.style.display = "none";


        // Send GET request
        const response =
            await fetch(API_URL);


        // Convert response to JSON
        const data =
            await response.json();


        console.log(
            "Teachers API Response:",
            data
        );


        // Check response
        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load teachers"
            );

        }


        // Update teacher count
        teacherCount.textContent =
            data.count;


        // Hide loading
        loading.style.display = "none";


        // Check if teachers exist
        if (
            !data.teachers ||
            data.teachers.length === 0
        ) {

            noTeachers.style.display =
                "block";

            teachersContainer.innerHTML =
                "";

            return;
        }


        // Hide no teachers message
        noTeachers.style.display =
            "none";


        // Display teachers
        displayTeachers(
            data.teachers
        );


    } catch (error) {

        console.error(
            "Error loading teachers:",
            error
        );


        // Hide loading
        loading.style.display =
            "none";


        // Show error
        errorMessage.textContent =
            "Unable to load teachers. Make sure the backend server is running.";

        errorMessage.style.display =
            "block";

    }

}


// =========================
// Display Teacher Cards
// =========================

function displayTeachers(teachers) {

    // Clear old cards
    teachersContainer.innerHTML =
        "";


    // Create card for every teacher
    teachers.forEach(teacher => {

        // Create card
        const card =
            document.createElement("div");

        card.className =
            "teacher-card";


        // =========================
        // Get Profile Image
        // =========================

        const profileImage =
            teacher.ProfileImage
                ? `http://localhost:3000${teacher.ProfileImage}`
                : "";


        // Get initials
        const initials =
            getInitials(
                teacher.name
            );


        // =========================
        // Create Card HTML
        // =========================

        card.innerHTML = `

            <!-- =========================
                 CARD HEADER
            ========================== -->

            <div class="teacher-card-header">


                <!-- Profile Image -->

                <div class="teacher-avatar">

                    ${
                        profileImage
                            ? `
                                <img
                                    src="${profileImage}"
                                    alt="${escapeHTML(teacher.name)}"
                                    class="teacher-profile-image"
                                    onerror="handleImageError(this)"
                                >
                            `
                            : ""
                    }


                    <!-- Default Initials -->

                    <div
                        class="default-avatar"
                        style="
                            display: ${
                                profileImage
                                    ? "none"
                                    : "flex"
                            };
                        "
                    >
                        ${initials}
                    </div>

                </div>


                <!-- Teacher Name -->

                <div class="teacher-name-section">

                    <h2>
                        ${escapeHTML(teacher.name)}
                    </h2>

                    <span>
                        Teacher
                    </span>

                </div>

            </div>


            <!-- =========================
                 TEACHER INFORMATION
            ========================== -->

            <div class="teacher-info">


                <!-- Email -->

                <div class="info-row">

                    <strong>
                        Email:
                    </strong>

                    <span>
                        ${escapeHTML(teacher.email)}
                    </span>

                </div>


                <!-- Phone -->

                <div class="info-row">

                    <strong>
                        Phone:
                    </strong>

                    <span>
                        ${escapeHTML(teacher.phone)}
                    </span>

                </div>


                <!-- Subject -->

                <div class="info-row">

                    <strong>
                        Subject:
                    </strong>

                    <span>
                        ${escapeHTML(teacher.subject)}
                    </span>

                </div>


                <!-- Qualification -->

                <div class="info-row">

                    <strong>
                        Qualification:
                    </strong>

                    <span>
                        ${escapeHTML(teacher.qualification)}
                    </span>

                </div>

            </div>


            <!-- =========================
                 CARD FOOTER
            ========================== -->

            <div class="teacher-card-footer">

                <a
                    href="teacher-details.html?id=${encodeURIComponent(teacher._id)}"
                    class="view-btn"
                >
                    View Details
                </a>

            </div>

        `;


        // Add card to page
        teachersContainer.appendChild(
            card
        );

    });

}


// =========================
// Image Error Handler
// =========================

function handleImageError(image) {

    // Hide broken image
    image.style.display =
        "none";


    // Find default avatar
    const defaultAvatar =
        image.parentElement.querySelector(
            ".default-avatar"
        );


    // Show initials
    if (defaultAvatar) {

        defaultAvatar.style.display =
            "flex";

    }

}


// =========================
// Get Teacher Initials
// =========================

function getInitials(name) {

    // If name doesn't exist
    if (!name) {

        return "TR";

    }


    // Remove extra spaces
    const words =
        name.trim().split(/\s+/);


    // One word name
    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    // Multiple words
    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// =========================
// Security Helper
// =========================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}
