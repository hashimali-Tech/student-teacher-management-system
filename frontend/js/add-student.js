const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");


// =====================================================
// IMAGE PREVIEW
// =====================================================

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {

        imagePreview.style.display = "none";
        previewImage.src = "";

        return;
    }

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

        imageInput.value = "";
        imagePreview.style.display = "none";

        return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

        showMessage(
            "Image size must be less than 2MB.",
            "error"
        );

        imageInput.value = "";
        imagePreview.style.display = "none";

        return;
    }

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    imagePreview.style.display = "block";

});


// =====================================================
// FORM SUBMIT
// =====================================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


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
                .value
                .trim();


        const imageFile =
            imageInput.files[0];


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


        submitBtn.disabled = true;

        submitBtn.textContent =
            "Adding Student...";


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
            semester
        );


        // =================================================
        // IMPORTANT FIX:
        // Backend multer expects field name "image"
        // (not "ProfileImage")
        // =================================================

        if (imageFile) {

            formData.append(
                "image",
                imageFile
            );

        }


        try {

            console.log(
                "Sending student data..."
            );

            console.log(
                "Name:",
                name
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Phone:",
                phone
            );

            console.log(
                "Course:",
                course
            );

            console.log(
                "Semester:",
                semester
            );

            console.log(
                "Profile Image:",
                imageFile
            );


            const response =
                await fetch(
                    "http://localhost:3000/api/students",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            // =================================================
            // SAFE RESPONSE PARSING
            // Pehle text lo, phir JSON try karo
            // =================================================

            const text =
                await response.text();


            let data;


            try {

                data =
                    JSON.parse(text);

            } catch (parseError) {

                console.error(
                    "Server ne JSON nahi bheja. Raw response:"
                );

                console.error(text);

                showMessage(
                    "Server error. Please check console.",
                    "error"
                );

                submitBtn.disabled = false;

                submitBtn.textContent =
                    "Add Student";

                return;
            }


            console.log(
                "Backend Response:",
                data
            );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Failed to add student.",
                    "error"
                );

                submitBtn.disabled = false;

                submitBtn.textContent =
                    "Add Student";

                return;
            }


            showMessage(
                "Student added successfully! Redirecting...",
                "success"
            );


            setTimeout(function () {

                //window.location.href =
                    //"students.html";

            }, 500);


        } catch (error) {

            console.error(
                "Error:",
                error
            );


            showMessage(
                "Unable to connect to the server.",
                "error"
            );


            submitBtn.disabled = false;

            submitBtn.textContent =
                "Add Student";

        }

    }
);


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(text, type) {

    message.textContent =
        text;

    message.className =
        type;

}