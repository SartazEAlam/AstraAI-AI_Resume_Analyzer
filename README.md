# 🤖 AstraAI — Resume Analyzer with Intelligent Job Recommendation

A full-stack AI-powered web application that provides **automated career guidance** by analyzing resumes against job descriptions using **NLP** and **Machine Learning**.

Upload your resume, select a target role, and instantly receive a match score, skill gap analysis, strength rating, and personalized career recommendations.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Match Percentage** | Cosine similarity between resume and job description using TF-IDF vectorization |
| **Skill Gap Analysis** | Identifies missing skills for the target role by comparing against a curated technical skills gazetteer |
| **Role Recommendations** | Suggests better-suited roles when match is low based on your extracted skill profile |
| **Strength Score** | Overall resume quality score (0–100) based on technical skill density |
| **Extracted Skills** | NLP-powered skill extraction using spaCy + pattern matching against 60+ technologies |
| **Experience Parsing** | Extracts total years of experience, seniority level, and previous job titles with date ranges |
| **Dual Mode UI** | **Individual** mode for single resume analysis, **Organization** mode for bulk candidate ranking |
| **Drag & Drop Upload** | Premium UI with PDF/DOCX support and animated upload zone |
| **Bulk Analysis** | Upload multiple resumes at once, rank candidates in a table, and view detailed breakdowns per candidate |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────────┐
│                 │     │                    │     │                     │
│   React + Vite  │────▶│  Node.js + Express │────▶│  Python + FastAPI   │
│   (Frontend)    │◀────│  (Backend API)     │◀────│  (ML Microservice)  │
│   Port 3000     │     │  Port 5000         │     │  Port 8000          │
│                 │     │                    │     │                     │
└─────────────────┘     └────────┬───────────┘     └─────────────────────┘
                                 │
                        ┌────────▼───────────┐
                        │                    │
                        │   MySQL Database   │
                        │   resume_analyzer  │
                        │                    │
                        └────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · Tailwind CSS 3 · Vite 5 · Framer Motion · Recharts · Lucide Icons |
| Backend API | Node.js · Express.js · Multer (file uploads) · pdf-parse · mysql2 |
| ML Microservice | Python · FastAPI · Uvicorn |
| NLP / ML | spaCy (`en_core_web_sm`) · scikit-learn (TF-IDF + Cosine Similarity) |
| Database | MySQL (Jobs, Users, Resumes, Analysis_History) |

---

## 📁 Project Structure

```
AI_Resume_Analyzer/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx           # Main application (Individual + Organization modes)
│   │   ├── index.css         # Global styles, animations, design system
│   │   └── main.jsx          # React entry point
│   ├── index.html            # HTML shell
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── backend/                  # Node.js REST API
│   ├── server.js             # Express server, routes, PDF parsing, ML proxy
│   ├── .env                  # Environment variables (gitignored)
│   ├── .env.example          # Template for environment setup
│   ├── uploads/              # Temporary file upload directory (auto-cleaned)
│   └── package.json
│
├── ml_service/               # Python ML microservice
│   ├── main.py               # FastAPI app, NLP pipeline, skill extraction, scoring
│   └── requirements.txt      # Python dependencies
│
├── database/                 # MySQL schema and seed data
│   ├── schema.sql            # Tables: Users, Jobs, Resumes, Analysis_History
│   └── seed.sql              # 8 pre-configured job roles with descriptions & skills
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+
- **MySQL** 8.0+

### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

This creates the `resume_analyzer` database with 4 tables and seeds 8 job roles (Frontend Developer, Backend Developer, Data Scientist, ML Engineer, Full Stack Developer, DevOps Engineer, Data Analyst, Cybersecurity Analyst).

### 2. ML Service (Terminal 1)

```bash
cd ml_service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

The ML service will be available at `http://localhost:8000`.

### 3. Backend API (Terminal 2)

```bash
cd backend
cp .env.example .env
# Edit .env and set your MySQL password
npm install
npm start
```

The backend API will be available at `http://localhost:5000`.

### 4. Frontend (Terminal 3)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ⚙️ Environment Variables

Create a `backend/.env` file based on `backend/.env.example`:

```env
# Server
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=resume_analyzer

# Python ML Microservice
ML_SERVICE_URL=http://localhost:8000
```

---

## 🔌 API Endpoints

### Backend (Node.js — Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check — returns `{ status: "ok" }` |
| `GET` | `/api/jobs` | List all job roles (id + title) for the frontend dropdown |
| `POST` | `/api/upload` | Upload a resume PDF/DOCX + jobId → returns analysis results |

#### `POST /api/upload`

**Form Data:**
- `resume` (file) — PDF or DOCX file
- `jobId` (string) — ID of the target job from the Jobs table

**Response:**
```json
{
  "match_percentage": 65.42,
  "missing_skills": ["docker", "kubernetes"],
  "matched_skills": ["python", "react", "node"],
  "strength_score": 73.33,
  "recommended_roles": ["Backend Developer", "Data Analyst"],
  "extracted_skills": ["python", "react", "node", "sql", "git"],
  "experience": {
    "total_years": 5,
    "seniority_level": "Mid-Level",
    "positions": [
      {
        "title": "Software Engineer",
        "company": "Tech Corp",
        "duration": "2019 – 2024"
      }
    ]
  }
}
```

### ML Service (Python — Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Accepts `resume_text` + `job_description` → returns NLP analysis |

---

## 🧠 How the ML Pipeline Works

1. **Text Extraction** — The backend reads the uploaded PDF using `pdf-parse` and sends the raw text to the ML service.

2. **Skill Extraction** — The ML service tokenizes the text with spaCy and cross-references tokens against a curated gazetteer of 60+ technical skills (including multi-word skills like "machine learning" and "natural language processing").

3. **Experience Parsing** — Uses Regex and spaCy NER (`ORG` entities) to calculate total years of experience, infer seniority levels, and map past job titles and companies to date ranges.

4. **Match Scoring** — A blended score is calculated:
   - **30%** from TF-IDF cosine similarity (general context match)
   - **70%** from skill overlap ratio (specific requirement match)

5. **Strength Score** — Measures resume quality based on the breadth of technical skills found (benchmarked against a senior profile with 15+ skills).

6. **Role Recommendations** — When match percentage is below 50%, the system suggests alternative roles based on detected skill clusters (frontend, backend, data).

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `Users` | Registered user profiles (id, name, email) |
| `Jobs` | Job roles with descriptions and required skills (JSON) |
| `Resumes` | Uploaded resume metadata and extracted text |
| `Analysis_History` | Historical analysis results (match %, missing skills, strength) |

---

## 🖥️ UI Modes

### Individual Mode
Single resume upload with a premium hero landing page. After analysis, displays:
- Three animated score rings (Match %, Strength, Skill Coverage)
- Previous Experience timeline (total years, seniority, and past roles)
- Extracted skills tags
- Skill gap tags
- Career path recommendation cards

### Organization Mode
Bulk resume upload dashboard for recruiters. Features:
- Job role selector dropdown (pulled from MySQL)
- Multi-file drag & drop
- Ranked candidate table (sorted by match %) with inline experience badges
- Per-candidate detail modal with full breakdown
- Role distribution bar chart (Recharts)
- "Analyze New Batch" feature to instantly clear and restart ranking

---

## 🛠️ Development

```bash
# Frontend dev server (hot reload)
cd frontend && npm run dev

# Backend dev server (auto-restart with nodemon)
cd backend && npm run dev

# ML service (auto-reload)
cd ml_service && uvicorn main:app --reload --port 8000
```

---

## 📝 License

This project is for educational and demonstration purposes.
