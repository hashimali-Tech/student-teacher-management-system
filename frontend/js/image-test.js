const API_URL = "http://localhost:3000";

const status = document.getElementById("status");
const testImage = document.getElementById("testImage");
const imageUrl = document.getElementById("imageUrl");


// ========================================
// TEST IMAGE API
// ========================================

async function testImageAPI() {

    try {

        console.log("================================");
        console.log("IMAGE API TEST START");
        console.log("================================");


        // Get teachers from API
        const response = await fetch(
            `${API_URL}/api/teachers`
        );

        console.log("API URL:");
        console.log(`${API_URL}/api/teachers`);


        console.log("Response Status:");
        console.log(response.status);


        if (!response.ok) {
            throw new Error("Teacher API failed");
        }


        const data = await response.json();

        console.log("FULL API RESPONSE:");
        console.log(data);


        // ========================================
        // GET TEACHERS ARRAY
        // ========================================

        const teachers = data.teachers || data.data || data;

        console.log("TEACHERS:");
        console.log(teachers);


        if (!teachers || teachers.length === 0) {

            status.innerText =
                "⚠️ API WORKING BUT NO TEACHERS FOUND";

            return;
        }


        // ========================================
        // FIRST TEACHER
        // ========================================

        const teacher = teachers[0];

        console.log("FIRST TEACHER:");
        console.log(teacher);


        // ========================================
        // IMAGE PATH
        // ========================================

        console.log("================================");
        console.log("CHECKING IMAGE PATH");
        console.log("================================");

        console.log("ProfileImage value:");
        console.log(teacher.ProfileImage);


        console.log("image value:");
        console.log(teacher.image);


        // Support both names
        const imagePath =
            teacher.ProfileImage || teacher.image;


        if (!imagePath) {

            status.innerText =
                "❌ TEACHER HAS NO IMAGE PATH";

            console.error(
                "❌ No ProfileImage/image found in teacher data"
            );

            return;
        }


        // ========================================
        // FULL IMAGE URL
        // ========================================

        const fullImageURL =
            imagePath.startsWith("http")
                ? imagePath
                : `${API_URL}${imagePath}`;


        console.log("IMAGE PATH FROM DATABASE:");
        console.log(imagePath);


        console.log("FULL IMAGE URL:");
        console.log(fullImageURL);


        console.log("================================");


        // Show URL on page
        imageUrl.innerText =
            `Image URL: ${fullImageURL}`;


        // ========================================
        // TEST IMAGE
        // ========================================

        testImage.onload = function () {

            console.log("✅ IMAGE LOADED SUCCESSFULLY");

            console.log(
                "Working image URL:",
                fullImageURL
            );

            status.innerText =
                "✅ API WORKING — IMAGE LOADED SUCCESSFULLY";

            status.style.background = "#dcfce7";
            status.style.color = "#166534";

            testImage.style.display = "block";
        };


        testImage.onerror = function () {

            console.error(
                "❌ IMAGE FAILED TO LOAD"
            );

            console.error(
                "Image URL:",
                fullImageURL
            );

            status.innerText =
                "❌ API WORKING BUT IMAGE NOT FOUND";

            status.style.background = "#fee2e2";
            status.style.color = "#991b1b";
        };


        testImage.src = fullImageURL;


    } catch (error) {

        console.error(
            "❌ API ERROR:",
            error
        );

        status.innerText =
            "❌ API NOT WORKING";

        status.style.background = "#fee2e2";
        status.style.color = "#991b1b";
    }
}


// Run test
testImageAPI();