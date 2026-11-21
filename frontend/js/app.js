const STUDENT_API =
    "http://localhost:3000/api/students";

const TEACHER_API =
    "http://localhost:3000/api/teachers";


document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);


async function loadDashboard() {

    try {

        const [
            studentResponse,
            teacherResponse
        ] = await Promise.all([

            fetch(STUDENT_API),

            fetch(TEACHER_API)

        ]);


        const studentData =
            await studentResponse.json();

        const teacherData =
            await teacherResponse.json();


        if (studentResponse.ok) {

            document.getElementById(
                "studentCount"
            ).textContent =
                studentData.count;

        }


        if (teacherResponse.ok) {

            document.getElementById(
                "teacherCount"
            ).textContent =
                teacherData.count;

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}