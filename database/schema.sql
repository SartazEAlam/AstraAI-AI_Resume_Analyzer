-- ============================================================
-- AI Resume Analyzer - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS resume_analyzer;
USE resume_analyzer;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_path VARCHAR(255) NOT NULL,
    extracted_text TEXT,
    extracted_skills JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Analysis_History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT,
    job_id INT,
    match_percentage DECIMAL(5, 2),
    missing_skills JSON,
    strength_score DECIMAL(5, 2),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES Resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);
