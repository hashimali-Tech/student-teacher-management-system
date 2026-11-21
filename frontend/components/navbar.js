function createNavbar(activePage = "") {

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (!navbar) {
        return;
    }


    navbar.innerHTML = `

        <nav class="navbar">

            <a
                href="index.html"
                class="nav-brand"
            >
                🎓 Student Management
            </a>


            <button
                class="mobile-menu"
                id="mobileMenu"
            >
                ☰
            </button>


            <ul
                class="nav-links"
                id="navLinks"
            >

                <li>
                    <a
                        href="index.html"
                        class="${
                            activePage === "dashboard"
                                ? "active"
                                : ""
                        }"
                    >
                        Dashboard
                    </a>
                </li>


                <li>
                    <a
                        href="students.html"
                        class="${
                            activePage === "students"
                                ? "active"
                                : ""
                        }"
                    >
                        Students
                    </a>
                </li>


                <li>
                    <a
                        href="add-student.html"
                        class="${
                            activePage === "add-student"
                                ? "active"
                                : ""
                        }"
                    >
                        Add Student
                    </a>
                </li>


                <li>
                    <a
                        href="teachers.html"
                        class="${
                            activePage === "teacher"
                                ? "active"
                                : ""
                        }"
                    >
                        Teachers
                    </a>
                </li>


                <li>
                    <a
                        href="add-teacher.html"
                        class="${
                            activePage === "add-teacher"
                                ? "active"
                                : ""
                        }"
                    >
                        Add Teacher
                    </a>
                </li>

            </ul>

        </nav>

    `;


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const navLinks =
        document.getElementById(
            "navLinks"
        );


    if (
        mobileMenu &&
        navLinks
    ) {

        mobileMenu.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "show"
                );

            }
        );

    }

}