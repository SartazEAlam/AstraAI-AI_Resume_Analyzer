from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from datetime import datetime

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

app = FastAPI()

# ── Master Technical Skills List (Gazetteer) ──
# In a real production app, this would be a database table or a 10,000+ word library.
TECHNICAL_SKILLS = {
    "python", "javascript", "java", "c++", "c#", "php", "ruby", "swift", "go", "rust", "sql", "nosql",
    "react", "reactjs", "node", "nodejs", "express", "angular", "vue", "nextjs", "django", "flask", "fastapi",
    "html", "css", "tailwind", "bootstrap", "sass", "typescript", "jquery", "redux", "graphql",
    "postgresql", "mysql", "mongodb", "redis", "oracle", "sqlite", "firebase", "cassandra",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab", "terraform", "ansible",
    "machine learning", "deep learning", "nlp", "natural language processing", "cv", "computer vision",
    "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn", "nltk", "spacy",
    "data science", "data analysis", "tableau", "power bi", "excel", "statistics", "r programming",
    "rest api", "soap", "microservices", "agile", "scrum", "devops", "ci/cd", "linux", "unix", "bash", "shell",
    "cybersecurity", "penetration testing", "firewall", "encryption", "blockchain", "solidity"
}
TECHNICAL_SKILLS.update({
    "webpack",
    "responsive design",
    "authentication",
    "monitoring",
    "incident response",
    "vulnerability assessment",
    "siem",
    "etl",
    "communication"
})

# ── Common Job Titles for Experience Extraction ──
COMMON_JOB_TITLES = [
    "software engineer", "senior software engineer", "staff engineer", "principal engineer",
    "frontend developer", "backend developer", "full stack developer", "fullstack developer",
    "web developer", "mobile developer", "ios developer", "android developer",
    "data scientist", "data analyst", "data engineer", "business analyst",
    "machine learning engineer", "ml engineer", "ai engineer", "deep learning engineer",
    "devops engineer", "site reliability engineer", "sre", "cloud engineer", "cloud architect",
    "product manager", "project manager", "engineering manager", "tech lead", "team lead",
    "qa engineer", "test engineer", "quality assurance", "automation engineer",
    "ui designer", "ux designer", "ui/ux designer", "product designer",
    "cybersecurity analyst", "security engineer", "network engineer", "systems administrator",
    "database administrator", "dba", "solutions architect", "technical architect",
    "blockchain developer", "game developer", "embedded engineer",
    "intern", "software intern", "engineering intern", "junior developer", "senior developer",
    "consultant", "technical consultant", "freelancer", "contractor",
    "cto", "ceo", "vp of engineering", "director of engineering", "head of engineering",
    "research scientist", "research engineer", "postdoctoral researcher"
]

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str = ""

    required_skills: list[str] = []
    preferred_projects: list[str] = []
    experience_keywords: list[str] = []

def clean_text(text: str) -> str:
    """Pre-process text to remove noise."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text) # Remove punctuation
    text = re.sub(r'\d+', '', text) # Remove numbers
    return " ".join(text.split())

def extract_skills(text: str) -> set:
    """
    Extracts skills by cross-referencing text against a known TECHNICAL_SKILLS list.
    This is much more accurate than generic noun extraction.
    """
    doc = nlp(text.lower())
    found_skills = set()
    
    # 1. Match against single words
    tokens = [token.text for token in doc if not token.is_stop]
    for token in tokens:
        if token in TECHNICAL_SKILLS:
            found_skills.add(token)
            
    # 2. Match against phrases (n-grams like "machine learning")
    text_content = doc.text
    for skill in TECHNICAL_SKILLS:
        if " " in skill and skill in text_content:
            found_skills.add(skill)
            
    return found_skills
def extract_projects(text: str):

    project_keywords = [
        "fake news detection",
        "student management system",
        "management system",
        "portfolio",
        "dashboard",
        "chatbot",
        "e-commerce",
        "recommendation system",
        "prediction system",
        "web application",
        "machine learning project"
    ]

    text = text.lower()

    found_projects = []

    for project in project_keywords:

        if project in text:
            found_projects.append(project)

    return found_projects

def extract_experience(text: str) -> dict:

    lines = text.split("\n")
    text_lower = text.lower()

    current_year = datetime.now().year

    # -----------------------------
    # Detect Student / Fresher
    # -----------------------------

    student_keywords = [
        "student",
        "b.tech",
        "bachelor",
        "undergraduate",
        "cgpa",
        "education",
        "college",
        "university"
    ]

    is_student = any(
        keyword in text_lower
        for keyword in student_keywords
    )

    # -----------------------------
    # Work Experience Keywords
    # -----------------------------

    work_keywords = [
        "internship",
        "intern",
        "work experience",
        "employment",
        "software engineer",
        "developer",
        "analyst",
        "consultant",
        "engineer",
        "full stack",
        "frontend",
        "backend"
    ]

    has_work_experience = any(
        keyword in text_lower
        for keyword in work_keywords
    )

    # -----------------------------
    # Explicit Experience Years
    # -----------------------------

    total_years = None

    year_patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)',
        r'(?:experience|exp)\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)'
    ]

    for pattern in year_patterns:

        match = re.search(
            pattern,
            text_lower
        )

        if match:

            total_years = int(
                match.group(1)
            )

            break

    # -----------------------------
    # Date Range Extraction
    # -----------------------------

    date_ranges = []

    date_range_pattern = (
        r'(20\d{2}|19\d{2})'
        r'\s*[-–—]\s*'
        r'(20\d{2}|19\d{2}|present|current|now)'
    )

    if total_years is None and has_work_experience:

        for line in lines:

            line_lower = line.lower()

            # Ignore education lines
            if any(
                word in line_lower
                for word in student_keywords
            ):
                continue

            matches = re.finditer(
                date_range_pattern,
                line_lower
            )

            for match in matches:

                start_year = int(
                    match.group(1)
                )

                end_str = match.group(2)

                if end_str in [
                    "present",
                    "current",
                    "now"
                ]:
                    end_year = current_year
                else:
                    end_year = int(end_str)

                if (
                    start_year <= end_year
                    and start_year >= 1980
                ):

                    duration = (
                        end_year -
                        start_year
                    )

                    date_ranges.append({
                        "start": start_year,
                        "end": end_year,
                        "duration": duration
                    })

        if date_ranges:

            total_years = sum(
                item["duration"]
                for item in date_ranges
            )

            total_years = min(
                total_years,
                40
            )

    # -----------------------------
    # Fresher Handling
    # -----------------------------

    if not has_work_experience:

        total_years = 0

    if total_years is None:

        total_years = 0

    # -----------------------------
    # Job Titles
    # -----------------------------

    found_positions = []

    for title in COMMON_JOB_TITLES:

        pattern = (
            r'\b' +
            re.escape(title.lower()) +
            r'\b'
        )

        if re.search(
            pattern,
            text_lower
        ):

            found_positions.append({
                "title": title.title(),
                "company": None,
                "duration": None
            })

    found_positions = (
        found_positions[:5]
    )

    # -----------------------------
    # Seniority Level
    # -----------------------------

    if is_student and total_years == 0:

        seniority = "Fresher"

    elif total_years < 2:

        seniority = "Junior"

    elif total_years < 5:

        seniority = "Mid-Level"

    elif total_years < 10:

        seniority = "Senior"

    else:

        seniority = "Principal / Staff"

    # -----------------------------
    # Return
    # -----------------------------

    return {

        "total_years": total_years,

        "seniority_level": seniority,

        "positions": found_positions,

        "date_ranges_found": len(
            date_ranges
        ),

        "is_student": is_student
    }
def normalize_skill(skill):
    skill = skill.lower().strip()

    mappings = {
        "react.js": "react",
        "reactjs": "react",

        "node.js": "nodejs",
        "express.js": "express",

        "tailwind css": "tailwind",

        "rest apis": "rest api",
        "restful api": "rest api",

        "data visualization": "data analysis",

        "network security": "cybersecurity"
    }

    return mappings.get(skill, skill)
@app.post("/analyze")
def analyze_resume(request: AnalysisRequest):
    try:
        # Clean inputs
        resume_text = clean_text(request.resume_text)
        job_desc = clean_text(request.job_description)

        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Resume text is required"
            )

        # 1. Skill Extraction (Accurate Matching)
        job_skills = {
            normalize_skill(skill)
            for skill in request.required_skills
        }

        resume_skills = {
            normalize_skill(skill)
            for skill in extract_skills(request.resume_text)
        }
        
        # 2. Skill Gap Analysis
        missing_skills = list(job_skills - resume_skills)
        matched_skills = list(job_skills & resume_skills)
        
        # 3. Match Percentage Calculation

        cosine_sim = 0

        if job_desc.strip():
            vectorizer = TfidfVectorizer(
                stop_words='english'
            )

            tfidf_matrix = vectorizer.fit_transform(
                [resume_text, job_desc]
            )

            cosine_sim = cosine_similarity(
                tfidf_matrix[0:1],
                tfidf_matrix[1:2]
            )[0][0]
        
        # B: Skill Matching Ratio (Specific requirements)
        skill_match_ratio = 0
        if len(job_skills) > 0:
            skill_match_ratio = len(matched_skills) / len(job_skills)
        
        is_general_analysis = (
            len(request.required_skills) == 0
        )
        if is_general_analysis:

            final_match_percentage = 0

        else:

            final_match_percentage = round(
                (cosine_sim * 30)
                + (skill_match_ratio * 70),
                2
            )
            

        # 4. Strength Score
        # Based on total technical skills found relative to an 'ideal' senior profile (e.g., 15+ skills)
        # 4. Experience Extraction
        experience = extract_experience(
            request.resume_text
        )

        # 5. Strength Score
        project_count = len(
            extract_projects(
                request.resume_text
            )
        )

        strength_score = (
            len(resume_skills) * 4
            + project_count * 15
            + len(
                experience.get(
                    "positions",
                    []
                )
            ) * 10
        )

        strength_score = min(
            strength_score,
            100
        )

        # 5. Role Recommendations
        # If match is low, suggest roles based on extracted resume skills
        role_skills = {

            "Frontend Developer": [
                "react",
                "reactjs",
                "html",
                "css",
                "javascript",
                "typescript",
                "redux",
                "tailwind",
                "bootstrap",
                "nextjs"
            ],

            "Backend Developer": [
                "node",
                "nodejs",
                "express",
                "mysql",
                "postgresql",
                "mongodb",
                "redis",
                "fastapi",
                "django",
                "flask",
                "java",
                "spring"
            ],

            "ML Engineer": [
                "python",
                "machine learning",
                "deep learning",
                "tensorflow",
                "pytorch",
                "nlp",
                "computer vision",
                "scikit-learn"
            ],

            "Data Analyst": [
                "sql",
                "excel",
                "power bi",
                "tableau",
                "pandas",
                "numpy",
                "statistics",
                "data analysis"
            ],

            "DevOps Engineer": [
                "docker",
                "kubernetes",
                "aws",
                "azure",
                "terraform",
                "jenkins",
                "linux"
            ]
        }

        role_scores = {}

        for role, skills in role_skills.items():

            score = 0

            for skill in skills:

                if skill in resume_skills:

                    if skill in [
                        "machine learning",
                        "deep learning",
                        "tensorflow",
                        "pytorch",
                        "nlp",
                        "computer vision"
                    ]:
                        score += 5

                    elif skill in [
                        "python",
                        "sql",
                        "pandas",
                        "numpy",
                        "power bi",
                        "tableau"
                    ]:
                        score += 4

                    elif skill in [
                        "react",
                        "node",
                        "express",
                        "mongodb"
                    ]:
                        score += 3

                    else:
                        score += 1

            role_scores[role] = score


        # OUTSIDE the loop

        highest_score = max(role_scores.values())

        if highest_score == 0:

            best_role = "Software Developer"

        else:

            best_role = max(
                role_scores,
                key=role_scores.get
            )

        top_roles = sorted(
            role_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        recommended_roles = [
            role
            for role, score in top_roles
            if score > 0
        ]

        total_score = sum(
            role_scores.values()
        )

        if total_score > 0:

            role_confidence = round(
                (highest_score / total_score) * 100,
                2
            )

        else:

            role_confidence = 0
        

        return {
            "match_percentage": round(final_match_percentage * 100, 2) if final_match_percentage <= 1 else final_match_percentage,
            "missing_skills": missing_skills,
            "matched_skills": matched_skills,
            "strength_score": round(strength_score, 2),
            "extracted_skills": list(resume_skills),
            "experience": experience,
            "best_role": best_role,
            "recommended_roles": recommended_roles,
            "role_scores": role_scores,
            "role_confidence": role_confidence,
            "is_general_analysis": is_general_analysis,
            "matched_skill_count": len(matched_skills),
            "required_skill_count": len(job_skills),
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
