
const API_URL = "http://localhost:3000/api/teachers";

const teacherForm = document.getElementById("teacherForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");


// ========================================
// IMAGE PREVIEW
// ========================================

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");


imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        imagePreview.style.display = "none";
        previewImage.src = "";
        return;
    }

    // Show preview
    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;
    imagePreview.style.display = "block";

});


// ========================================
// FORM SUBMIT
// ========================================

teacherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ========================================
        // GET FORM VALUES
        // ========================================

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const qualification =
            document.getElementById("qualification").value.trim();


        // ========================================
        // VALIDATION
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
        // GET IMAGE
        // ========================================

        const imageFile = imageInput.files[0];


        // ========================================
        // CREATE FORMDATA
        // ========================================

        const formData = new FormData();


        formData.append("name", name);

        formData.append("email", email);

        formData.append("phone", phone);

        formData.append("subject", subject);

        formData.append(
            "qualification",
            qualification
        );


        // ========================================
        // ADD IMAGE
        // IMPORTANT:
        // Backend expects "ProfileImage"
        // ========================================

        if (imageFile) {

            formData.append(
                "ProfileImage",
                imageFile
            );

        }


        // ========================================
        // BUTTON LOADING
        // ========================================

        submitBtn.disabled = true;

        submitBtn.textContent =
            "Adding Teacher...";


        try {

            // ========================================
            // SEND DATA TO BACKEND
            // ========================================

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    // IMPORTANT:
                    // Do NOT set Content-Type manually.
                    // Browser automatically sets:
                    // multipart/form-data + boundary

                    body: formData
                }
            );


            const data =
                await response.json();


            console.log(
                "Teacher API Response:",
                data
            );


            // ========================================
            // HANDLE ERROR
            // ========================================

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Failed to add teacher.",
                    "error"
                );


                submitBtn.disabled = false;

                submitBtn.textContent =
                    "Add Teacher";

                return;
            }


            // ========================================
            // SUCCESS
            // ========================================

            showMessage(
                "Teacher added successfully!",
                "success"
            );


            console.log(
                "Saved Teacher:",
                data.teacher
            );


            // Redirect after success
            setTimeout(() => {

                window.location.href =
                    "teachers.html";

            }, 800);


        } catch (error) {

            console.error(
                "Add Teacher Error:",
                error
            );


            showMessage(
                "Unable to connect to server.",
                "error"
            );


            submitBtn.disabled = false;

            submitBtn.textContent =
                "Add Teacher";

        }

    }
);


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(text, type) {

    message.textContent = text;

    message.className = type;

}
