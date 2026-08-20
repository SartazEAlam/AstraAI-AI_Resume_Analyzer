const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
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

// ── Multi-Format Text Extraction Helper ──
const extractTextFromFile = async (filePath, originalName) => {
    const ext = path.extname(originalName || '').toLowerCase();
    const dataBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
        // 1. Try Python pypdf microservice first (handles all modern vector, Chrome print, and compressed PDFs)
        try {
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
            const base64Data = dataBuffer.toString('base64');
            const pyRes = await axios.post(`${mlServiceUrl}/extract-pdf-base64`, {
                pdf_base64: base64Data
            });
            if (pyRes.data && pyRes.data.text && pyRes.data.text.trim().length > 10) {
                return pyRes.data.text.trim();
            }
        } catch (pyErr) {
            console.warn('pypdf extraction error, falling back to pdf-parse:', pyErr.message);
        }

        // 2. Fallback to node pdf-parse
        try {
            const pdfData = await pdfParse(dataBuffer);
            if (pdfData.text && pdfData.text.trim().length > 10) {
                return pdfData.text.trim();
            }
        } catch (pdfErr) {
            console.warn('pdfParse fallback error:', pdfErr.message);
        }

        return '';
    } else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value ? result.value.trim() : '';
    } else if (ext === '.doc') {
        // Try mammoth first (modern Word often saves as .doc while using docx XML)
        try {
            const docxResult = await mammoth.extractRawText({ buffer: dataBuffer });
            if (docxResult.value && docxResult.value.trim().length > 20) {
                return docxResult.value.trim();
            }
        } catch (_) {}

        // Fallback for legacy binary .doc (Word 97-2003): extract readable text runs
        const rawStr = dataBuffer.toString('latin1');
        const matches = rawStr.match(/[\x20-\x7E\r\n\t]{4,}/g);
        if (matches && matches.length > 0) {
            return matches
                .filter(chunk => !chunk.startsWith('bjbj') && !chunk.startsWith('WordDocument'))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
        return '';
    } else if (ext === '.rtf') {
        const rtfStr = dataBuffer.toString('utf-8');
        return rtfStr
            .replace(/\\par[d]?/gi, '\n')
            .replace(/\{\\*?\\[^{}]+;?\}|[{}]|\\[a-z0-9]+/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    } else if (['.txt', '.text', '.md', '.csv'].includes(ext)) {
        return dataBuffer.toString('utf-8').trim();
    } else {
        // Unknown extension fallback: try mammoth then plain text
        try {
            const fallbackResult = await mammoth.extractRawText({ buffer: dataBuffer });
            if (fallbackResult.value && fallbackResult.value.trim()) {
                return fallbackResult.value.trim();
            }
        } catch (_) {}
        return dataBuffer.toString('utf-8').trim();
    }
};

// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});

// ── Get All Jobs with Category ──
app.get('/api/jobs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, title, category, description, required_skills FROM Jobs ORDER BY category ASC, title ASC');
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
        const customJD = req.body.customJD;

        // 1. Extract text from uploaded document (PDF, DOCX, DOC, TXT, RTF, MD)
        let extractedText = '';
        try {
            extractedText = await extractTextFromFile(req.file.path, req.file.originalname);
        } catch (extractErr) {
            console.error('File parsing error:', extractErr.message);
            safeCleanup(req.file.path);
            return res.status(400).json({ 
                error: `Failed to read ${req.file.originalname}. The file may be corrupted, password-protected, or in an unsupported format.` 
            });
        }

        if (!extractedText || extractedText.trim().length === 0) {
            safeCleanup(req.file.path);
            return res.status(400).json({ 
                error: 'No readable text found in the uploaded file. Please ensure the document contains extractable text and is not an image scan.' 
            });
        }

        // 3. Get the Job Description from MySQL or Custom Input
        let jobDescription = customJD || '';
        let requiredSkills = [];

        if (jobId && !customJD) {

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
            console.error('ML service error:', axiosErr.message);
            if (axiosErr.response) console.error('ML service response:', axiosErr.response.data);
            safeCleanup(req.file.path);
            return res.status(500).json({ error: 'Failed to communicate with the ML analysis service. Make sure it is running.' });
        }

        // 5. Save analysis results to MySQL (optional — won't break if DB is down)
        try {
            const safeJobId = jobId && !isNaN(parseInt(jobId, 10)) ? parseInt(jobId, 10) : null;
            await pool.query(
                `INSERT INTO Analysis_History (resume_id, job_id, match_percentage, missing_skills, strength_score)
                 VALUES (?, ?, ?, ?, ?)`,
                [null, safeJobId, pythonResponse.data.match_percentage, JSON.stringify(pythonResponse.data.missing_skills || []), pythonResponse.data.strength_score]
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



// ── Analyze Text Endpoint (For Live Editor) ──
app.post('/api/analyze-text', async (req, res) => {
    try {
        const { text, jobId, customJD } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        let jobDescription = customJD || '';
        let requiredSkills = [];

        if (jobId && !customJD) {
            const [rows] = await pool.query(
                'SELECT description, required_skills FROM Jobs WHERE id = ?',
                [jobId]
            );
            if (rows.length > 0) {
                jobDescription = rows[0].description;
                requiredSkills = typeof rows[0].required_skills === 'string'
                    ? JSON.parse(rows[0].required_skills)
                    : (rows[0].required_skills || []);
            }
        }

        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const pythonResponse = await axios.post(
            `${mlServiceUrl}/analyze`,
            {
                resume_text: text,
                job_description: jobDescription || "",
                required_skills: requiredSkills || [],
            }
        );

        res.json(pythonResponse.data);
    } catch (error) {
        console.error('Error analyzing text:', error.message);
        if (error.response) console.error('ML service response:', error.response.data);
        res.status(500).json({ error: 'Internal server error during text analysis.' });
    }
});

// ── Generate Cover Letter Endpoint ──
app.post('/api/generate-cover-letter', async (req, res) => {
    try {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const pythonResponse = await axios.post(
            `${mlServiceUrl}/generate-cover-letter`,
            req.body
        );
        res.json(pythonResponse.data);
    } catch (error) {
        console.error('Error generating cover letter:', error.message);
        if (error.response) console.error('ML service response:', error.response.data);
        res.status(500).json({ error: 'Internal server error during cover letter generation.' });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Node.js Backend running at http://localhost:${PORT}`);
    console.log(`   ML Service expected at ${process.env.ML_SERVICE_URL || 'http://localhost:8000'}\n`);
});
