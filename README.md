# Grade Entry System

The Grade Entry system is a web-based application which enables the users to securely log in and manage student grades. Authenticated users can enter grades for students across different courses and view a structured table displaying the grades each student has received per course. The system enforces login-based access to ensure that only authorized users can enter and manage grades.

## Key Features

- **RBAC**: Admin, Teacher, and Student roles with enforced permissions
- **Grade Management**: Teachers enter and update student grades
- **User Management**: Admins create and manage user accounts
- **Student Dashboard**: Read-only view of personal grades
- **Teacher Dashboard**: Grade entry interface with student list
- **Admin Dashboard**: Full system administration capabilities

## Assumptions:
- This application follows a monolithic architecture which runs on a localhost for demonstration and evaluation purposes. This design choice is appropriate given the expected small user base (up to ~1,000 users) and limited functional scope.
- As this system is intended for a small-scale use case, a relational database (MySQL) is used. MySQL is sufficient for structured data storage, enforces data integrity through constraints, and is easy to manage for small to medium datasets.
- This system implements a Role Based Access Control (RBAC) with the following users roles:
    Admin:
        Full CRUD access across the system.
        Can create and manage users (teachers and students).
        Can create and manage courses.
        Can view, update, or delete grades.
    Teacher:
        Read and Update access.
        Can view student grades and enter or update grades for assigned courses.
    Student:
        Read-only access.
        Can view only their own grades across enrolled courses in a structured table.
- The user interface is intentionally kept minimal and functional, with a focus on correctness and core functionality rather than advanced UI/UX design.
- User account creation is handled by the Admin. The admin assigns usernames and passwords to students and teachers. This assumption is made because the system targets a small, controlled environment where users may not self-register. Credentials can be shared securely through trusted communication channels such as email.

## Tech Stack

**Frontend**: React 19

**Backend**: Python/FastAPI

**Database**: MySQL

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js & npm
- MySQL 5.7+

### Setup Backend

```bash

#Backend setup

# 1. Supported Python Versions
This project supports:
- Python 3.10
- Python 3.11
- Python 3.12

#Python 3.13+ (including 3.14) is not supported due to missing prebuilt wheels for binary dependencies such as 'pydantic-core'.

# 2. Navigate to backend
cd grad_entry/backend

# 3. Create virtual environment
python -m venv venv
source venv/Scripts/activate   # Git Bash
# venv\Scripts\activate        # Command Prompt
# venv\Scripts\Activate.ps1    # PowerShell

# 4. Configure environment variables
# Copy .env.example to .env and update with your credentials if .env not avaialble
cp .env.example .env

# Then edit .env with your database configuration:
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=grade_system

# 5. Install dependencies
pip install -r requirements.txt

# 6. Start server
uvicorn app.main:app --reload --port 8000
```

**API runs at**: `http://localhost:8000`

**Note**: Never commit `.env` file. It's in `.gitignore` for security.

### Setup Frontend

```bash
# 1. In project root
npm install

# 2. Start development server
npm start
```

**App runs at**: `http://localhost:3000`

### Setup Database

```bash
# 1. Create database
mysql -u root -p < database/schema.sql

# 2. Database auto-initializes with sample data
# Admin: admin/admin123
# Teacher: teacher1/teacher123
# Students: student1/student123, student2/student123
```


## Project Structure

```
grade_entry/
├── src/                      # React frontend
│   ├── components/
│   │   ├── LoginPage.jsx    # Authentication
│   │   ├── AdminView.jsx    # Admin dashboard
│   │   ├── TeacherView.jsx  # Teacher grade entry
│   │   ├── StudentView.jsx  # Student grades (read-only)
│   │   ├── GradeEditor.jsx  # Grade form component
│   │   └── ManageUser.jsx   # User management
│   ├── services/
│   │   └── api.js           # Axios HTTP client
│   └── App.jsx              # Main app component
├── backend/
│   └── app/
│       ├── main.py          # API routes
│       ├── models.py        # SQLAlchemy models
│       ├── schemas.py       # Pydantic schemas
│       ├── crud.py          # Database operations
│       └── database.py      # DB connection
├── database/
│   └── schema.sql           # Initial schema
└── package.json
```

## API Endpoints

### Authentication

**POST /api/auth/login**
- Description: Authenticate user with credentials
- Access: Public (no authentication required)
- Response: User object with user_id, role, username, email, full_name
- Error Codes: 401 (Invalid credentials)
- Used by: All users during login

### User Management (Admin Only)

**POST /api/users?user_id={admin_id}**
- Description: Create new user (teacher or student)
- Access: Admin only
- Query Parameter: user_id (admin's user_id)
- Response: Created user object with user_id
- Error Codes: 401 (User not found), 403 (Insufficient permissions), 400 (User already exists)
- Notes: Only admins can create new accounts in this system

**GET /api/users?user_id={admin_id}**
- Description: Retrieve list of all users
- Access: Admin only
- Query Parameter: user_id (admin's user_id)
- Response: Array of user objects (all users in system)
- Error Codes: 401 (User not found), 403 (Insufficient permissions)
- Used by: Admin panel for user management

**DELETE /api/users/{delete_user_id}?user_id={admin_id}**
- Description: Delete a user account
- Access: Admin only
- Path Parameter: delete_user_id (user to delete)
- Query Parameter: user_id (admin's user_id)
- Response: Success message
- Error Codes: 401 (User not found), 403 (Insufficient permissions), 404 (Target user not found)
- Notes: Cascading delete removes associated grades

### Subject Management (Admin Only)

**GET /api/subjects**
- Description: Retrieve list of all subjects/courses
- Access: Public (no authentication required)
- Response: Array of subject objects with subject_id and subject_name
- Notes: Returns all available subjects in system

**POST /api/subjects?user_id={admin_id}**
- Description: Create new subject/course
- Access: Admin only
- Query Parameter: user_id (admin's user_id)
- Response: Created subject object with subject_id
- Error Codes: 401 (User not found), 403 (Insufficient permissions)
- Used by: Admin to add new subjects to system

**DELETE /api/subjects/{subject_id}?user_id={admin_id}**
- Description: Delete a subject/course
- Access: Admin only
- Path Parameter: subject_id (subject to delete)
- Query Parameter: user_id (admin's user_id)
- Response: Success message
- Error Codes: 401 (User not found), 403 (Insufficient permissions), 404 (Subject not found)
- Notes: Cascading delete removes all grades for this subject

### Student Management (Teacher & Admin)

**GET /api/students?user_id={teacher_or_admin_id}**
- Description: Retrieve list of all students
- Access: Teacher and Admin only
- Query Parameter: user_id (requesting user's user_id)
- Response: Array of student objects (filtered by role='student')
- Error Codes: 401 (User not found), 403 (Insufficient permissions)
- Used by: Teacher to view available students for grade entry

### Grade Management

**GET /api/grades/my-grades?user_id={student_id}**
- Description: View personal grades (Student only)
- Access: Student only
- Query Parameter: user_id (student's user_id)
- Error Codes: 403 (Only students can view own grades)
- Notes: Returns all grades for authenticated student across all subjects

**GET /api/grades/student/{student_id}?user_id={teacher_or_admin_id}**
- Description: View specific student's grades (Teacher/Admin only)
- Access: Teacher and Admin only
- Path Parameter: student_id (target student)
- Query Parameter: user_id (requesting user's user_id)
- Response: StudentGradesResponse with student info and grades
- Error Codes: 401 (User not found), 403 (Insufficient permissions), 404 (Student not found)
- Used by: Teacher to view student's grades before updating

**PUT /api/grades/student/{student_id}/subject/{subject_id}?user_id={teacher_or_admin_id}**
- Description: Update or create a grade for student in subject
- Access: Teacher and Admin only
- Path Parameters: student_id, subject_id
- Query Parameter: user_id (requesting user's user_id)
- Response: Success message
- Error Codes: 401 (User not found), 403 (Insufficient permissions)
- Notes: 
  - Creates grade if doesn't exist
  - Updates grade if already exists
  - Unique constraint prevents duplicate entries per student-subject pair
  - Timestamps automatically updated

### Health Check

**GET /**
- Description: API health check
- Access: Public
- Response: {"message": "Grade Entry System API"}
- Used for: Verifying API is running

## User Roles & Permissions

**Admin**

- Full CRUD access across entire system
- Create new users (teachers, students, other admins)
- Delete users from system
- Create and delete subjects/courses
- View and update grades for any student
- Access to admin dashboard with all management features
- Cannot be deleted unless another admin exists

**Teacher**

- View list of all students in system
- View individual student's grades across all subjects
- Enter grades for students in assigned subjects
- Update existing grades
- Cannot create users or manage subjects
- Cannot view other teachers' actions
- Cannot access admin panel
- Limited to grade entry and management

**Student**

- View only personal grades
- Read-only access to own grades
- Cannot modify any grades
- Cannot view other student's grades
- Cannot access admin or teacher features
- Can only see grades in assigned subjects
- Limited to viewing dashboard

**Best Practices**

- Never commit .env files (configured in .gitignore)
- Credentials passed through trusted channels only
- All endpoints validate user role before execution
- Database uses foreign key constraints with CASCADE delete
- Unique constraints prevent duplicate user entries

## Architecture

### Monolithic Design (Current)
- Single codebase (frontend + backend)
- Suitable for up to ~1,000 users
- Easy deployment and maintenance
- Appropriate for small institutions

## Database Schema

**Users**: user_id, username, password, email, role, created_at
**Subjects**: subject_id, subject_name, created_at
**Grades**: grade_id, student_id, subject_id, grade_value, updated_at

Constraints:
- Unique: username, email, (student_id, subject_id)
- Foreign keys with CASCADE delete
- Role enum: admin, teacher, student

## Troubleshooting

### Backend Issues
```bash
# Port already in use
lsof -i :8000  # Find process
kill -9 <PID>  # Kill process

# Database connection failed
# Check .env file exists and credentials are correct

# Import schema error
mysql -u root -p grade_system < database/schema.sql

# ModuleNotFoundError: pydantic_core._pydantic_core
An unsupported Python version (3.13+) is being used. `pydantic-core` does not yet
publish prebuilt wheels for newer Python versions, causing installation or
runtime failures.

Solution:
1. Install Python 3.10, 3.11, or 3.12
2. Recreate the virtual environment
3. Reinstall dependencies

# fastapi, sqlalchemy orm yellow underline error
Restart the language server and refresh window
Upgrade/ downgrade to 3.10.x, 3.11.x, or 3.12.x Python versions.
```

### Frontend Issues
```bash
# Clear cache and node_modules
rm -rf node_modules
npm install
npm start
```
## Future Scope:
- If the system is scaled to university-level, the application can continue to follow a monolithic MVC architecture, while improving scalability by deploying the frontend, backend, and database on separate servers and applying vertical scaling (increasing server resources). A distributed microservices architecture is not required for this use case due to limited request volume and high refactoring cost.
- For a larger user base and higher volume of data, the system can migrate to more scalable databases such as: PostgreSQL (advanced relational features, performance).
- Additional functionalities for admin can be updated such as blocking/ flagging users violating policies.
- Additional functionalities for teachers can be extended to create course-specific course classrooms with assignment management and course-level dashboards with grade distributions.
- University level students can be allowed to create their own accounts, manage personal profiles and enroll in courses through approval workflows.
- AI can also be integrated for automatic grade analysis, smart recommendations for academic improvement.
- Additional high level advancements like mobile-friendly or native application support can be done along with email and notification services for grade updates/ class announcements, integration/ unit tests can be performed.
- Enhance authentication using secure password hashing, token-based authentication, and session expiration.




