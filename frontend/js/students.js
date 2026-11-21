
const API_URL = "http://localhost:3000/api/students";


// =========================
// Get HTML Elements
// =========================

const studentsContainer =
    document.getElementById("studentsContainer");

const studentCount =
    document.getElementById("studentCount");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const noStudents =
    document.getElementById("noStudents");


// =========================
// Load Students When Page Opens
// =========================

document.addEventListener("DOMContentLoaded", () => {

    getStudents();

});


// =========================
// Get All Students
// =========================

async function getStudents() {

    try {

        // Show loading
        loading.style.display = "block";

        // Hide previous error
        errorMessage.textContent = "";
        errorMessage.style.display = "none";


        // Send GET request
        const response = await fetch(API_URL);


        // Convert response to JSON
        const data = await response.json();

        console.log("Students API Response:", data);


        // Check response
        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load students"
            );

        }


        // Update student count
        studentCount.textContent = data.count;


        // Hide loading
        loading.style.display = "none";


        // Check if students exist
        if (
            !data.students ||
            data.students.length === 0
        ) {

            noStudents.style.display = "block";

            studentsContainer.innerHTML = "";

            return;
        }


        // Hide no students message
        noStudents.style.display = "none";


        // Display students
        displayStudents(data.students);


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        // Hide loading
        loading.style.display = "none";


        // Show error
        errorMessage.textContent =
            "Unable to load students. Make sure the backend server is running.";

        errorMessage.style.display = "block";

    }

}


// =========================
// Display Student Cards
// =========================

function displayStudents(students) {

    // Clear old cards
    studentsContainer.innerHTML = "";


    // Create card for every student
    students.forEach(student => {

        // Create card
        const card =
            document.createElement("div");

        card.className = "student-card";


        // Get profile image
        const profileImage =
            student.ProfileImage
                ? `http://localhost:3000${student.ProfileImage}`
                : "";


        // Get initials
        const initials =
            getInitials(student.name);


        // Create card HTML
        card.innerHTML = `

            <!-- =========================
                 CARD HEADER
            ========================== -->

            <div class="student-card-header">


                <!-- Profile Image -->

                <div class="student-avatar">

                    ${
                        profileImage
                            ? `
                                <img
                                    src="${profileImage}"
                                    alt="${escapeHTML(student.name)}"
                                    class="student-profile-image"
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


                <!-- Student Name -->

                <div class="student-name-section">

                    <h2>
                        ${escapeHTML(student.name)}
                    </h2>

                    <span>
                        Student
                    </span>

                </div>

            </div>


            <!-- =========================
                 STUDENT INFORMATION
            ========================== -->

            <div class="student-info">


                <!-- Email -->

                <div class="info-row">

                    <strong>
                        Email:
                    </strong>

                    <span>
                        ${escapeHTML(student.email)}
                    </span>

                </div>


                <!-- Phone -->

                <div class="info-row">

                    <strong>
                        Phone:
                    </strong>

                    <span>
                        ${escapeHTML(student.phone)}
                    </span>

                </div>


                <!-- Course -->

                <div class="info-row">

                    <strong>
                        Course:
                    </strong>

                    <span>
                        ${escapeHTML(student.course)}
                    </span>

                </div>


                <!-- Semester -->

                <div class="info-row">

                    <strong>
                        Semester:
                    </strong>

                    <span>
                        ${escapeHTML(student.semester)}
                    </span>

                </div>

            </div>


            <!-- =========================
                 CARD FOOTER
            ========================== -->

            <div class="student-card-footer">

                <a
                    href="student-details.html?id=${encodeURIComponent(student._id)}"
                    class="view-btn"
                >
                    View Details
                </a>

            </div>

        `;


        // Add card to page
        studentsContainer.appendChild(card);

    });

}


// =========================
// Image Error Handler
// =========================

function handleImageError(image) {

    // Hide broken image
    image.style.display = "none";


    // Find default avatar
    const defaultAvatar =
        image.parentElement.querySelector(
            ".default-avatar"
        );


    // Show initials
    if (defaultAvatar) {

        defaultAvatar.style.display = "flex";

    }

}


// =========================
// Get Student Initials
// =========================

function getInitials(name) {

    // If name doesn't exist
    if (!name) {

        return "ST";

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

