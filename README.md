# Student & Teacher Management System

A Full-Stack Web Application for managing student and teacher records, built with **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB**.

The system provides an organized platform for managing student and teacher information, performing CRUD operations, and handling profile images.

## Features

### Student Management
- Add new student records.
- View student information.
- Update existing student details.
- Delete student records.
- Manage student profile images.

### Teacher Management
- Add new teacher records.
- View teacher information.
- Update existing teacher details.
- Delete teacher records.
- Manage teacher profile images.

### Backend
- RESTful API architecture.
- Node.js and Express.js.
- MongoDB database integration.
- Separate models, controllers, and routes.
- Image upload middleware.
- Centralized error-handling middleware.

## Technologies Used

| Frontend | Backend | Database |
|---|---|---|
| HTML5 | Node.js | MongoDB |
| CSS3 | Express.js | Mongoose |
| JavaScript | REST APIs | |

## Project Structure

```text
student-teacher-management-system/
│
├── frontend/
│   ├── components/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── index.html
│   ├── students.html
│   ├── teachers.html
│   ├── add-student.html
│   ├── add-teacher.html
│   ├── edit-student.html
│   ├── edit-teacher.html
│   ├── student-details.html
│   └── teacher-details.html
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── studentController.js
│   │   └── teacherController.js
│   ├── middleware/
│   ├── models/
│   │   ├── Student.js
│   │   └── Teacher.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   └── teacherRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hashimali-Tech/student-teacher-management-system.git
```

### 2. Open the Project

```bash
cd student-teacher-management-system
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add your MongoDB connection string and the other configuration values required by your application.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Use the actual environment variable names expected by your backend code. Never upload real credentials to GitHub.

### 5. Start the Backend

```bash
npm start
```

Use the start command defined in your backend `package.json`. If your project uses a different script, run that script instead.

### 6. Run the Frontend

Open `frontend/index.html` in your browser or use a local development server.

Make sure the frontend API configuration points to your running backend.

## API Overview

The backend provides separate API routes for student and teacher management.

| Resource | API Base Route |
|---|---|
| Students | `/api/students` |
| Teachers | `/api/teachers` |

The available HTTP methods and request formats are defined in the corresponding route files.

## Database

MongoDB is used to store student and teacher records.

Mongoose models:
- `Student.js`
- `Teacher.js`

## Author

**Hashim Ali**

- GitHub: https://github.com/hashimali-Tech
- Email: hashimalideveloper@gmail.com

## License

This project is available for educational and portfolio purposes. Add a specific open-source license if you intend to grant formal reuse permissions.
