-- ============================================================
-- LEAP Database - Full Setup Script
-- Run this in MySQL to set up all tables from scratch
-- ============================================================

CREATE DATABASE IF NOT EXISTS LEAP;
USE LEAP;

-- ── USER ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `User` (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    date_joined     DATE,
    email           VARCHAR(255) UNIQUE NOT NULL,
    avatar_url      VARCHAR(500),
    is_active       TINYINT(1) DEFAULT 1,
    is_staff        TINYINT(1) DEFAULT 0,
    last_login      DATETIME,
    is_superuser    TINYINT(1) DEFAULT 0
);

-- ── USER_AUTH (passwords — keeps User table clean) ────────────────────────────
CREATE TABLE IF NOT EXISTS User_Auth (
    auth_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    CONSTRAINT fk_userauth_user FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE
);

-- ── ADMIN ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    role        VARCHAR(100),
    status      VARCHAR(50),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE
);

-- ── STUDENT ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Student (
    student_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    middle_name     VARCHAR(100),
    last_name       VARCHAR(100),
    first_name      VARCHAR(100),
    gender          VARCHAR(20),
    address         VARCHAR(255),
    year_level      INT,
    dept_id         INT,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE
);

-- ── INSTRUCTOR ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Instructor (
    instructor_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    first_name      VARCHAR(100),
    middle_name     VARCHAR(100),
    last_name       VARCHAR(100),
    age             INT,
    birth_date      DATE,
    gender          VARCHAR(20),
    address         VARCHAR(255),
    contact_no      VARCHAR(50),
    specialization  VARCHAR(255),
    hire_date       DATE,
    status          VARCHAR(50),
    CONSTRAINT fk_instructor_user FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE
);

-- ── COURSE ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Course (
    course_id       INT AUTO_INCREMENT PRIMARY KEY,
    course_name     VARCHAR(255) NOT NULL,
    course_code     VARCHAR(50) UNIQUE,
    description     TEXT,
    is_published    TINYINT(1) DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status          VARCHAR(50)
);

-- ── ENROLLMENT ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Enrollment (
    enrollment_id   INT AUTO_INCREMENT PRIMARY KEY,
    student_id      INT,
    course_id       INT,
    early_enrolled  TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course  FOREIGN KEY (course_id)  REFERENCES Course(course_id)  ON DELETE CASCADE
);

-- ── LESSON ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Lesson (
    lesson_id       INT AUTO_INCREMENT PRIMARY KEY,
    course_id       INT,
    title           VARCHAR(255),
    description     TEXT,
    attachment      VARCHAR(500),
    lesson_order    INT,
    section_order   INT,
    CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE
);

-- ── REQUIREMENT ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Requirement (
    requirement_id  INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id       INT,
    title           VARCHAR(255),
    type            VARCHAR(100),
    due_date        DATE,
    total_points    DECIMAL(10,2),
    max_attempts    INT,
    CONSTRAINT fk_requirement_lesson FOREIGN KEY (lesson_id) REFERENCES Lesson(lesson_id) ON DELETE CASCADE
);

-- ── SUBMISSION ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Submission (
    submission_id       INT AUTO_INCREMENT PRIMARY KEY,
    requirement_id      INT,
    attempt_number      INT,
    date_submitted      DATETIME DEFAULT CURRENT_TIMESTAMP,
    true_or_false       TINYINT(1),
    status              VARCHAR(50),
    feedback            TEXT,
    CONSTRAINT fk_submission_requirement FOREIGN KEY (requirement_id) REFERENCES Requirement(requirement_id) ON DELETE CASCADE
);

-- ── QUESTION ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Question (
    question_id     INT AUTO_INCREMENT PRIMARY KEY,
    requirement_id  INT,
    question_text   TEXT,
    points          DECIMAL(10,2),
    CONSTRAINT fk_question_requirement FOREIGN KEY (requirement_id) REFERENCES Requirement(requirement_id) ON DELETE CASCADE
);

-- ── CHOICE ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Choice (
    choice_id       INT AUTO_INCREMENT PRIMARY KEY,
    question_id     INT,
    choice_text     TEXT,
    is_correct      TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_choice_question FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE
);

-- ── STUDENT_ANSWER ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Student_Answer (
    answer_id       INT AUTO_INCREMENT PRIMARY KEY,
    submission_id   INT,
    question_id     INT,
    choice_id       INT,
    answer_text     TEXT,
    point_earned    DECIMAL(10,2),
    CONSTRAINT fk_answer_submission FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question   FOREIGN KEY (question_id)   REFERENCES Question(question_id),
    CONSTRAINT fk_answer_choice     FOREIGN KEY (choice_id)     REFERENCES Choice(choice_id)
);

-- ── GRADE ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Grade (
    grade_id        INT AUTO_INCREMENT PRIMARY KEY,
    student_id      INT,
    course_id       INT,
    grade_value     DECIMAL(5,2),
    date_awarded    DATE,
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_course  FOREIGN KEY (course_id)  REFERENCES Course(course_id)  ON DELETE CASCADE
);

-- ── BADGE ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Badge (
    badge_id        INT AUTO_INCREMENT PRIMARY KEY,
    badge_name      VARCHAR(255) NOT NULL,
    description     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── BADGE CONDITION ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS BadgeCondition (
    badge_id            INT,
    condition_type      VARCHAR(100),
    required_score      DECIMAL(10,2),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (badge_id, condition_type),
    CONSTRAINT fk_badgecondition_badge FOREIGN KEY (badge_id) REFERENCES Badge(badge_id) ON DELETE CASCADE
);

-- ── STUDENT_BADGE ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Student_Badge (
    student_badge_id    INT AUTO_INCREMENT PRIMARY KEY,
    student_id          INT,
    badge_id            INT,
    date_earned         DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_studentbadge_student FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_studentbadge_badge   FOREIGN KEY (badge_id)   REFERENCES Badge(badge_id)   ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_student_user           ON Student(user_id);
CREATE INDEX idx_instructor_user        ON Instructor(user_id);
CREATE INDEX idx_enrollment_student     ON Enrollment(student_id);
CREATE INDEX idx_enrollment_course      ON Enrollment(course_id);
CREATE INDEX idx_lesson_course          ON Lesson(course_id);
CREATE INDEX idx_requirement_lesson     ON Requirement(lesson_id);
CREATE INDEX idx_submission_requirement ON Submission(requirement_id);
CREATE INDEX idx_question_requirement   ON Question(requirement_id);
CREATE INDEX idx_choice_question        ON Choice(question_id);
CREATE INDEX idx_answer_submission      ON Student_Answer(submission_id);
CREATE INDEX idx_grade_student          ON Grade(student_id);
CREATE INDEX idx_grade_course           ON Grade(course_id);
CREATE INDEX idx_student_badge_student  ON Student_Badge(student_id);
CREATE INDEX idx_student_badge_badge    ON Student_Badge(badge_id);
