CREATE DATABASE IF NOT EXISTS grade_system;
USE grade_system;

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    grade_value VARCHAR(2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject_id)
);

-- Insert sample data
INSERT INTO users (username, password, full_name, email, role) VALUES
('admin', 'admin123', 'Admin User', 'admin@school.com', 'admin'),
('teacher1', 'teacher123', 'John Teacher', 'teacher@school.com', 'teacher'),
('student1', 'student123', 'Alice Student', 'alice@school.com', 'student'),
('student2', 'student123', 'Bob Student', 'bob@school.com', 'student');

INSERT INTO subjects (subject_name) VALUES
('Mathematics'),
('Physics'),
('Chemistry'),
('Biology');

INSERT INTO grades (student_id, subject_id, grade_value) VALUES
(3, 1, 'A'),
(3, 2, 'A'),
(3, 3, 'B'),
(3, 4, 'A'),
(4, 1, 'B'),
(4, 2, 'C'),
(4, 3, 'D'),
(4, 4, 'E');
