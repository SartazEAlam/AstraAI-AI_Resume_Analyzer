const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── MySQL Connection Pool ──
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'resume_analyzer',
    waitForConnections: true,
    connectionLimit: 10,
});
// ── Multer Setup for File Uploads ──
const upload = multer({ dest: 'uploads/' });

// ── Safe File Cleanup (prevents EBUSY crashes on Windows) ──
const safeCleanup = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.warn(`Could not delete temp file ${filePath}: ${err.code || err.message}`);
        // Retry after a short delay for EBUSY errors
        setTimeout(() => {
            try { fs.unlinkSync(filePath); } catch (_) { /* give up silently */ }
        }, 500);
    }
};

// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});

// ── Get All Jobs (for the frontend dropdown) ──
app.get('/api/jobs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, title FROM Jobs');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// ── Main Upload & Analyze Endpoint ──
app.post('/api/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const jobId = req.body.jobId;

        // 1. Read the uploaded file
        const dataBuffer = fs.readFileSync(req.file.path);

        // 2. Extract text from the PDF
        let extractedText = '';
        if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
            try {
                const pdfData = await pdfParse(dataBuffer);
                extractedText = pdfData.text ? pdfData.text.trim() : '';
            } catch (pdfErr) {
                console.error('PDF parsing error:', pdfErr.message);
                safeCleanup(req.file.path);
                return res.status(400).json({ error: 'Failed to read the PDF. The file might be corrupted, password-protected, or not a valid PDF.' });
            }
        } else {
            // For DOCX or other formats, read as UTF-8 text (basic fallback)
            extractedText = dataBuffer.toString('utf-8').trim();
        }

        if (!extractedText) {
            safeCleanup(req.file.path);
            return res.status(400).json({ error: 'No readable text found in the uploaded file. Please ensure the document is not an image-based PDF or an empty file.' });
        }

        // 3. Get the Job Description from MySQL
        let jobDescription = '';
        let requiredSkills = [];

        if (jobId) {

            const [rows] = await pool.query(
                `
                SELECT
                    description,
                    required_skills
                FROM Jobs
                WHERE id = ?
                `,
                [jobId]
            );

            if (rows.length > 0) {

                jobDescription = rows[0].description;

                requiredSkills =
                    typeof rows[0].required_skills === 'string'
                        ? JSON.parse(rows[0].required_skills)
                        : (rows[0].required_skills || []);
            }
        }
        // 4. Send text to Python ML Microservice
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        let pythonResponse;
        try {
            pythonResponse = await axios.post(
                `${mlServiceUrl}/analyze`,
                {
                    resume_text: extractedText,
                    job_description: jobDescription || "",

                    required_skills: requiredSkills || [],
                }
            );
        } catch (axiosErr) {
            console.error('ML service error:', axiosErr.response ? axiosErr.response.data : axiosErr.message);
            safeCleanup(req.file.path);
            return res.status(500).json({ error: 'Failed to communicate with the ML analysis service. Make sure it is running.' });
        }

        // 5. Save analysis results to MySQL (optional — won't break if DB is down)
        try {
            await pool.query(
                `INSERT INTO Analysis_History (resume_id, job_id, match_percentage, missing_skills, strength_score)
                 VALUES (?, ?, ?, ?, ?)`,
                [null, jobId, pythonResponse.data.match_percentage, JSON.stringify(pythonResponse.data.missing_skills), pythonResponse.data.strength_score]
            );
        } catch (saveErr) {
            console.warn('Could not save analysis to DB:', saveErr.message);
        }

        // 6. Clean up temp file
        safeCleanup(req.file.path);

        // 7. Return results
        res.json(pythonResponse.data);

    } catch (error) {
        console.error('Error during processing:', error.message);
        // Clean up file on error
        safeCleanup(req.file?.path);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Node.js Backend running at http://localhost:${PORT}`);
    console.log(`   ML Service expected at ${process.env.ML_SERVICE_URL || 'http://localhost:8000'}\n`);
});
