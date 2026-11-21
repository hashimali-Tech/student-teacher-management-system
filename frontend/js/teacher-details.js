const API_URL = "http://localhost:3000/api/teachers";


// ========================================
// GET HTML ELEMENTS
// ========================================

const teacherDetails =
    document.getElementById("teacherDetails");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");


// ========================================
// GET TEACHER ID FROM URL
// ========================================

const urlParams =
    new URLSearchParams(window.location.search);

const teacherId =
    urlParams.get("id");


// ========================================
// CHECK TEACHER ID
// ========================================

if (!teacherId) {

    console.log("ERROR: Teacher ID is missing.");

    showError("Teacher ID is missing.");

} else {

    console.log(
        "Teacher ID received:",
        teacherId
    );

    loadTeacher();

}


// ========================================
// LOAD TEACHER
// ========================================

async function loadTeacher() {

    try {

        console.log("\n================================");
        console.log("LOADING TEACHER");
        console.log("================================");

        console.log(
            "Request URL:",
            `${API_URL}/${teacherId}`
        );


        // ========================================
        // SHOW LOADING
        // ========================================

        loading.style.display = "block";

        errorMessage.style.display = "none";

        teacherDetails.style.display = "none";


        // ========================================
        // FETCH TEACHER
        // ========================================

        const response = await fetch(
            `${API_URL}/${teacherId}`
        );


        // ========================================
        // CONSOLE AFTER FETCH
        // ========================================

        console.log(
            "Fetch response:",
            response
        );

        console.log(
            "Response status:",
            response.status
        );

        console.log(
            "Response OK:",
            response.ok
        );


        // ========================================
        // GET JSON
        // ========================================

        const data =
            await response.json();


        // ========================================
        // SHOW COMPLETE BACKEND RESPONSE
        // ========================================

        console.log(
            "================================"
        );

        console.log(
            "BACKEND RESPONSE"
        );

        console.log(
            "================================"
        );

        console.log(
            "Complete response:",
            data
        );


        // ========================================
        // CHECK RESPONSE
        // ========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load teacher."
            );

        }


        // ========================================
        // CHECK TEACHER DATA
        // ========================================

        if (!data.teacher) {

            throw new Error(
                "Teacher data not found in response."
            );

        }


        // ========================================
        // SHOW COMPLETE TEACHER DATA
        // ========================================

        console.log(
            "================================"
        );

        console.log(
            "TEACHER DATA"
        );

        console.log(
            "================================"
        );

        console.log(
            "Teacher:",
            data.teacher
        );


        // ========================================
        // CHECK TEACHER IMAGE PATH
        // ========================================

        console.log(
            "================================"
        );

        console.log(
            "TEACHER IMAGE DEBUG"
        );

        console.log(
            "================================"
        );

        console.log(
            "ProfileImage from MongoDB:",
            data.teacher.ProfileImage
        );


        // ========================================
        // CREATE FULL IMAGE URL
        // ========================================

        const imageUrl =
            getTeacherImageUrl(
                data.teacher.ProfileImage
            );


        console.log(
            "Full Image URL:",
            imageUrl
        );


        console.log(
            "================================"
        );


        // ========================================
        // DISPLAY TEACHER
        // ========================================

        displayTeacher(
            data.teacher
        );


    } catch (error) {

        console.error(
            "ERROR LOADING TEACHER:",
            error
        );


        showError(
            error.message ||
            "Unable to load teacher."
        );


    } finally {

        console.log(
            "Teacher loading finished."
        );


        loading.style.display =
            "none";

    }

}


// ========================================
// GET TEACHER IMAGE URL
// ========================================

function getTeacherImageUrl(imagePath) {

    // No image
    if (!imagePath) {

        return null;

    }


    // Already full URL
    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
    ) {

        return imagePath;

    }


    // Convert backend path to full URL
    return `http://localhost:3000${imagePath}`;

}


// ========================================
// DISPLAY TEACHER
// ========================================

function displayTeacher(teacher) {

    console.log(
        "Displaying teacher:",
        teacher
    );


    // ========================================
    // GET IMAGE URL
    // ========================================

    const imageUrl =
        getTeacherImageUrl(
            teacher.ProfileImage
        );


    console.log(
        "Image URL used for <img>:",
        imageUrl
    );


    // ========================================
    // IMAGE HTML
    // ========================================

    let profileImageHTML;


    if (imageUrl) {

        profileImageHTML = `

            <img
                src="${imageUrl}"
                alt="${escapeHTML(teacher.name)}"
                class="teacher-profile-image"
                onerror="handleImageError(this)"
            >

        `;

    } else {

        profileImageHTML = `

            <div class="teacher-profile-fallback">
                ${getInitials(teacher.name)}
            </div>

        `;

    }


    // ========================================
    // TEACHER DETAILS
    // ========================================

    teacherDetails.innerHTML = `

        <div class="details-header">


            <!-- PROFILE IMAGE -->

            <div class="details-avatar">

                ${profileImageHTML}

            </div>


            <!-- TEACHER TITLE -->

            <div class="teacher-title">

                <h2>
                    ${escapeHTML(teacher.name)}
                </h2>

                <p>
                    Teacher ID:
                    ${escapeHTML(teacher._id)}
                </p>

            </div>


        </div>


        <!-- =====================================
             TEACHER INFORMATION
        ====================================== -->

        <div class="teacher-info">


            <!-- NAME -->

            <div class="info-item">

                <span class="info-label">
                    Name
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher.name)}
                </span>

            </div>


            <!-- EMAIL -->

            <div class="info-item">

                <span class="info-label">
                    Email
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher.email)}
                </span>

            </div>


            <!-- PHONE -->

            <div class="info-item">

                <span class="info-label">
                    Phone
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher.phone)}
                </span>

            </div>


            <!-- SUBJECT -->

            <div class="info-item">

                <span class="info-label">
                    Subject
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher.subject)}
                </span>

            </div>


            <!-- QUALIFICATION -->

            <div class="info-item">

                <span class="info-label">
                    Qualification
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher.qualification)}
                </span>

            </div>


            <!-- TEACHER ID -->

            <div class="info-item">

                <span class="info-label">
                    Teacher ID
                </span>

                <span class="info-value">
                    ${escapeHTML(teacher._id)}
                </span>

            </div>


        </div>


        <!-- =====================================
             BUTTONS
        ====================================== -->

        <div class="teacher-details-actions">


            <!-- Edit -->

            <a
                href="edit-teacher.html?id=${encodeURIComponent(teacher._id)}"
                class="details-btn edit-btn"
            >
                Edit Teacher
            </a>


            <!-- Delete -->

            <button
                type="button"
                class="details-btn delete-btn"
                onclick="deleteTeacher('${teacher._id}')"
            >
                Delete Teacher
            </button>


        </div>

    `;


    // ========================================
    // SHOW TEACHER DETAILS
    // ========================================

    teacherDetails.style.display =
        "block";


    console.log(
        "Teacher displayed successfully."
    );

}


// ========================================
// IMAGE ERROR HANDLER
// ========================================

function handleImageError(image) {

    console.error(
        "Teacher profile image failed to load:",
        image.src
    );


    const avatar =
        image.parentElement;


    if (!avatar) {

        return;

    }


    avatar.innerHTML = `

        <div class="teacher-profile-fallback">
            ${getInitials(
                document.querySelector(".teacher-title h2")?.textContent
            )}
        </div>

    `;

}


// ========================================
// GET INITIALS
// ========================================

function getInitials(name) {

    if (!name) {

        return "?";

    }


    const words =
        name.trim().split(/\s+/);


    // ONE WORD NAME

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    // FIRST + LAST NAME

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================
// Delete Teacher
// =========================

async function deleteTeacher(id) {

    // Confirmation

    const confirmed =
        confirm(
            "Are you sure you want to delete this Teacher record ?"
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
                "Failed to delete Teacher"
            );

        }


        // Success

        alert(
            "Teacher deleted successfully."
        );


        // Go back

        window.location.href =
            "teachers.html";


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete Teacher."
        );

    }

}


// ========================================
// SHOW ERROR
// ========================================

function showError(message) {

    console.error(
        "DISPLAY ERROR:",
        message
    );


    errorMessage.textContent =
        message;


    errorMessage.className =
        "error";


    errorMessage.style.display =
        "block";

}

