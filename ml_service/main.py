from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import re
from datetime import datetime
import io
import base64
from pypdf import PdfReader

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Load SentenceTransformer model (Lightweight model for semantic similarity)
try:
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: Could not load sentence-transformers model. Semantic search will be disabled. Error: {e}")
    sbert_model = None


app = FastAPI()

class Base64PDFRequest(BaseModel):
    pdf_base64: str

# ── High-Precision PDF Extractor Endpoint (Base64 JSON) ──
@app.post("/extract-pdf-base64")
def extract_pdf_base64(req: Base64PDFRequest):
    try:
        pdf_bytes = base64.b64decode(req.pdf_base64)
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = "\n".join([page.extract_text() or "" for page in reader.pages])
        return {"text": text.strip()}
    except Exception as e:
        print(f"PDF base64 extraction error: {e}")
        return {"text": "", "error": str(e)}

# ── High-Precision PDF Extractor Endpoint (Multipart fallback) ──
@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        reader = PdfReader(io.BytesIO(contents))
        text = "\n".join([page.extract_text() or "" for page in reader.pages])
        return {"text": text.strip()}
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return {"text": "", "error": str(e)}

# ── Master Technical Skills List (Gazetteer) ──
# In a real production app, this would be a database table or a 10,000+ word library.
TECHNICAL_SKILLS = {
    # 💻 1. Technology, Programming & Cloud
    "python", "javascript", "typescript", "java", "c++", "c", "c#", "php", "ruby", "swift", "go", "rust", "kotlin", "r",
    "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "angular", "html", "css", "tailwind", "bootstrap",
    "node", "node.js", "nodejs", "express", "fastapi", "django", "flask", "spring", "spring boot", "rest api", "graphql",
    "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "firebase", "supabase", "aws", "azure", "gcp", "docker",
    "kubernetes", "k8s", "terraform", "jenkins", "ci/cd", "git", "linux", "machine learning", "deep learning", "nlp",
    "computer vision", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "power bi", "tableau", "cybersecurity",

    # 📈 2. Finance, Accounting & Banking
    "financial modeling", "financial analysis", "valuation", "forecasting", "budgeting", "accounting", "general ledger",
    "gaap", "ifrs", "auditing", "tax preparation", "internal audit", "accounts payable", "accounts receivable", "reconciliation",
    "quickbooks", "sap", "oracle financial", "corporate finance", "m&a", "mergers and acquisitions", "due diligence",
    "lbo modeling", "private equity", "investment banking", "capital markets", "risk management", "cpa", "cfa", "variance analysis",

    # 🏥 3. Healthcare, Nursing & Clinical
    "patient care", "nursing", "medication administration", "triage", "vital signs", "bls", "acls", "cpr", "emr", "ehr",
    "epic systems", "cerner", "clinical assessment", "infection control", "phlebotomy", "patient education", "clinical trials",
    "gcp", "irb", "protocol compliance", "patient recruitment", "fda regulations", "hipaa", "medical billing", "medical coding",
    "icd-10", "pharmacology", "quality assurance",

    # 📣 4. Marketing, Sales & Communication
    "digital marketing", "seo", "sem", "search engine optimization", "google analytics", "google ads", "content marketing",
    "social media marketing", "email marketing", "ppc", "pay-per-click", "copywriting", "content strategy", "hubspot",
    "mailchimp", "b2b sales", "b2c sales", "lead generation", "salesforce", "cold calling", "negotiation", "crm",
    "pipeline management", "brand strategy", "public relations", "market research", "customer acquisition",

    # 👥 5. Human Resources & Recruiting
    "human resources", "talent management", "talent acquisition", "recruiting", "talent sourcing", "ats", "workday",
    "greenhouse", "lever", "interviewing", "candidate screening", "linkedin recruiter", "employee relations", "onboarding",
    "hr compliance", "performance management", "conflict resolution", "payroll", "compensation", "benefits administration",

    # 📦 6. Supply Chain, Operations & Logistics
    "supply chain management", "inventory management", "inventory control", "demand forecasting", "logistics", "procurement",
    "vendor management", "supplier management", "warehouse operations", "erp", "lean manufacturing", "six sigma", "kaizen",
    "process optimization", "quality control", "operations management", "continuous improvement", "root cause analysis",

    # 🎨 7. Design, Creative & Media
    "ui design", "ux design", "ux research", "figma", "sketch", "adobe xd", "wireframing", "prototyping", "design systems",
    "user testing", "adobe photoshop", "adobe illustrator", "indesign", "after effects", "premiere pro", "typography",
    "brand identity", "graphic design", "visual design", "motion graphics", "video editing",

    # ⚖️ 9. Legal & Compliance
    "corporate law", "contract drafting", "legal compliance", "risk mitigation", "due diligence", "litigation",
    "litigation support", "contract management", "legal research", "regulatory compliance", "intellectual property", "patents", "trademarks",

    # 🏗️ 10. Engineering & Construction
    "autocad", "solidworks", "mechanical engineering", "civil engineering", "structural analysis", "fea", "matlab",
    "circuit design", "project scheduling", "construction management", "site supervision", "building codes", "revit", "pcb design", "ansys",

    # 🤝 Universal Professional & Soft Skills
    "leadership", "project management", "pmp", "agile", "scrum", "kanban", "strategic planning", "stakeholder management",
    "problem solving", "critical thinking", "collaboration", "communication", "time management", "decision making"
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
    "research scientist", "research engineer", "postdoctoral researcher",
    "registered nurse", "nurse", "physician", "clinical research coordinator", "medical assistant",
    "financial analyst", "investment banker", "accountant", "auditor", "tax consultant",
    "marketing manager", "digital marketer", "seo specialist", "content strategist", "sales executive",
    "hr manager", "recruiter", "talent acquisition specialist", "hr generalist",
    "supply chain manager", "logistics coordinator", "procurement specialist", "operations manager",
    "civil engineer", "mechanical engineer", "electrical engineer", "structural engineer",
    "legal counsel", "compliance officer", "attorney", "paralegal"
]

ROLE_SKILLS = {
    # Software & IT
    "Software Engineer": ["react", "node", "nodejs", "python", "javascript", "typescript", "html", "css", "sql", "git", "docker", "aws", "java", "c++", "c#"],
    "Backend Developer": ["python", "node", "nodejs", "java", "sql", "postgresql", "mongodb", "docker", "aws", "express", "fastapi", "rest api", "microservices"],
    "Frontend Developer": ["react", "javascript", "typescript", "html", "css", "vue", "angular", "tailwind", "next.js", "ui design", "redux"],
    "Full Stack Developer": ["react", "node", "nodejs", "javascript", "python", "sql", "mongodb", "express", "html", "css", "docker", "aws", "git"],
    "Mobile App Developer": ["swift", "kotlin", "react native", "flutter", "ios", "android", "mobile development", "java", "objective-c"],
    "Game Developer": ["unity", "unreal engine", "c#", "c++", "game design", "3d modeling", "gameplay programming"],
    "DevOps / Cloud Engineer": ["aws", "docker", "kubernetes", "linux", "ci/cd", "terraform", "jenkins", "azure", "gcp", "bash"],
    "Cybersecurity Analyst": ["cybersecurity", "network security", "linux", "python", "vulnerability assessment", "incident response", "siem", "penetration testing", "firewalls"],
    "Systems Administrator": ["linux", "windows server", "active directory", "networking", "troubleshooting", "vmware", "bash", "powershell", "system administration"],
    "Database Administrator": ["sql", "oracle", "postgresql", "mysql", "database design", "performance tuning", "nosql", "database administration"],
    "QA / Test Engineer": ["quality assurance", "automated testing", "selenium", "manual testing", "jira", "python", "java", "api testing", "cypress"],

    # Data & AI
    "Data Scientist": ["python", "machine learning", "deep learning", "sql", "tensorflow", "pytorch", "pandas", "nlp", "statistics", "r"],
    "Data Analyst": ["sql", "excel", "tableau", "power bi", "data visualization", "data analysis", "python", "pandas", "reporting"],
    "Data Engineer": ["python", "sql", "spark", "hadoop", "etl", "aws", "data warehousing", "airflow", "scala"],
    "Data & AI Specialist": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "scikit-learn", "pandas", "numpy", "sql", "llm", "generative ai"],

    # Engineering & Architecture
    "Mechanical Engineer": ["autocad", "solidworks", "mechanical engineering", "fea", "matlab", "ansys", "cad", "manufacturing"],
    "Civil / Structural Engineer": ["autocad", "civil engineering", "structural analysis", "construction management", "site supervision", "building codes", "revit", "microstation"],
    "Electrical Engineer": ["electrical engineering", "circuit design", "autocad", "matlab", "pcb design", "power systems", "plc", "schematics", "electronics"],
    "Hardware Engineer": ["hardware design", "verilog", "vhdl", "fpga", "pcb", "embedded systems", "c", "c++", "microcontrollers"],
    "Chemical Engineer": ["chemical engineering", "process engineering", "p&id", "process simulation", "chemistry", "matlab", "aspen hysys"],
    "Biomedical Engineer": ["biomedical engineering", "medical devices", "fda regulations", "matlab", "solidworks", "biomechanics", "biomaterials"],
    "Aerospace Engineer": ["aerospace engineering", "aerodynamics", "matlab", "solidworks", "ansys", "cad", "propulsion", "catia"],
    "Industrial Engineer": ["industrial engineering", "lean manufacturing", "six sigma", "supply chain", "process improvement", "logistics", "operations research"],
    "Architect": ["architecture", "autocad", "revit", "sketchup", "building design", "urban planning", "3d rendering", "construction documents"],

    # Business, Management & Operations
    "Project Manager": ["project management", "agile", "scrum", "budgeting", "risk management", "stakeholder management", "jira", "pmp", "scheduling", "leadership"],
    "Product Manager": ["product management", "agile", "scrum", "product strategy", "roadmap planning", "market research", "jira", "user stories", "cross-functional leadership"],
    "Business Analyst": ["business analysis", "requirements gathering", "sql", "process improvement", "stakeholder management", "jira", "agile", "excel"],
    "Management Consultant": ["management consulting", "strategy", "data analysis", "excel", "powerpoint", "problem solving", "market analysis", "financial modeling"],
    "Operations Manager": ["operations management", "process improvement", "budgeting", "logistics", "supply chain", "team leadership", "kpis"],
    "Supply Chain Manager": ["supply chain management", "inventory management", "logistics", "procurement", "lean manufacturing", "erp", "sap", "vendor management"],

    # Finance & Accounting
    "Investment Banker": ["financial modeling", "valuation", "excel", "m&a", "corporate finance", "due diligence", "lbo modeling", "private equity", "investment banking"],
    "Accountant / Auditor": ["accounting", "general ledger", "gaap", "ifrs", "auditing", "tax preparation", "internal audit", "accounts payable", "accounts receivable", "reconciliation", "cpa"],
    "Financial Analyst": ["financial analysis", "excel", "financial modeling", "forecasting", "budgeting", "corporate finance", "variance analysis"],

    # Healthcare & Medical
    "Registered Nurse": ["patient care", "nursing", "medication administration", "triage", "vital signs", "bls", "acls", "cpr", "emr", "ehr", "clinical assessment"],
    "Clinical Research Coordinator": ["clinical trials", "gcp", "irb", "protocol compliance", "patient recruitment", "fda regulations", "hipaa", "data analysis"],
    "Medical Doctor / Physician": ["patient care", "diagnosis", "treatment planning", "medical terminology", "ehr", "clinical research", "surgery", "internal medicine"],
    "Pharmacist": ["pharmacy", "medication management", "pharmacology", "patient counseling", "prescription filling", "clinical pharmacy"],
    "Healthcare Administrator": ["healthcare administration", "budgeting", "hipaa", "compliance", "emr", "patient scheduling", "healthcare management"],

    # Marketing & Sales
    "Marketing Manager": ["digital marketing", "seo", "content strategy", "social media marketing", "google analytics", "brand management", "campaign management", "email marketing"],
    "SEO Specialist": ["seo", "sem", "search engine optimization", "google analytics", "google ads", "content strategy", "copywriting", "digital marketing"],
    "Social Media Manager": ["social media marketing", "content creation", "copywriting", "instagram", "twitter", "linkedin", "facebook", "hootsuite", "community management"],
    "B2B Sales Executive": ["b2b sales", "lead generation", "salesforce", "cold calling", "negotiation", "crm", "pipeline management", "customer acquisition"],
    "Account Executive": ["b2b sales", "account management", "salesforce", "crm", "negotiation", "presentation skills", "lead generation", "closing"],
    "Public Relations Specialist": ["public relations", "press releases", "media relations", "corporate communications", "copywriting", "event planning"],

    # Design & Creative
    "Product Designer": ["ui design", "ux design", "ux research", "figma", "prototyping", "design systems", "user testing", "wireframing"],
    "Graphic Designer": ["adobe photoshop", "adobe illustrator", "indesign", "typography", "brand identity", "graphic design", "visual design", "layout design"],
    "UX Researcher": ["ux research", "user testing", "usability testing", "interviews", "surveys", "data analysis", "wireframing", "persona development"],
    "Art Director": ["art direction", "graphic design", "creative strategy", "adobe creative suite", "branding", "leadership", "visual design"],
    "Copywriter": ["copywriting", "content creation", "seo", "editing", "proofreading", "blogging", "creative writing", "advertising"],
    "Video Editor": ["video editing", "adobe premiere pro", "final cut pro", "after effects", "motion graphics", "color grading", "audio editing"],

    # HR & Legal
    "HR & Talent Acquisition Specialist": ["human resources", "talent management", "talent acquisition", "recruiting", "ats", "employee relations", "onboarding", "workday"],
    "Corporate Legal & Compliance Counsel": ["corporate law", "contract drafting", "legal compliance", "risk mitigation", "due diligence", "litigation support", "contract management", "legal research"],
    "Paralegal": ["legal research", "document drafting", "case management", "litigation support", "legal writing", "contracts"],

    # Education
    "Teacher / Educator": ["lesson planning", "classroom management", "curriculum development", "student assessment", "special education", "tutoring"],
    "Instructional Designer": ["instructional design", "e-learning", "curriculum development", "articulate storyline", "lms", "adult learning theory", "training materials"]
}

# Dynamically add all skills from ROLE_SKILLS to the extraction gazetteer
all_role_skills = set().union(*ROLE_SKILLS.values())
TECHNICAL_SKILLS.update(all_role_skills)


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
def normalize_skill(skill: str) -> str:
    skill = skill.lower().strip()
    mappings = {
        "react.js": "react",
        "reactjs": "react",
        "next.js": "nextjs",
        "vue.js": "vue",
        "vuejs": "vue",
        "node.js": "nodejs",
        "node": "nodejs",
        "express.js": "express",
        "tailwind css": "tailwind",
        "rest apis": "rest api",
        "restful api": "rest api",
        "data visualization": "data analysis",
        "network security": "cybersecurity",
        "k8s": "kubernetes",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "sklearn": "scikit-learn",
        "scikit learn": "scikit-learn",
        "amazon web services": "aws",
        "google cloud": "gcp",
        "r programming": "r"
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
        
        # Auto-extract skills if JD is provided but required_skills array is empty (Custom JD Support)
        if request.job_description.strip() and not job_skills:
            if request.job_description.strip() in ROLE_SKILLS:
                job_skills = {normalize_skill(skill) for skill in ROLE_SKILLS[request.job_description.strip()]}
            else:
                job_skills = {
                    normalize_skill(skill)
                    for skill in extract_skills(job_desc)
                }


        resume_skills = {
            normalize_skill(skill)
            for skill in extract_skills(request.resume_text)
        }
        
        # 2. Skill Gap Analysis (Exact + Semantic Hybrid)
        exact_missing_skills = list(job_skills - resume_skills)
        matched_skills = list(job_skills & resume_skills)
        
        final_missing_skills = []
        semantic_matches = []

        if sbert_model and exact_missing_skills and resume_skills:
            # Generate embeddings for missing job skills and all resume skills
            missing_embeddings = sbert_model.encode(exact_missing_skills)
            resume_embeddings = sbert_model.encode(list(resume_skills))
            
            # Compute cosine similarities between all missing skills and all resume skills
            sim_matrix = cosine_similarity(missing_embeddings, resume_embeddings)
            
            for i, m_skill in enumerate(exact_missing_skills):
                # Find the best matching resume skill for this missing job skill
                best_match_idx = sim_matrix[i].argmax()
                best_score = sim_matrix[i][best_match_idx]
                
                if best_score > 0.72: # Threshold for semantic similarity
                    matched_skills.append(m_skill)
                    semantic_matches.append({
                        "job_skill": m_skill,
                        "matched_with": list(resume_skills)[best_match_idx],
                        "score": round(float(best_score), 2)
                    })
                else:
                    final_missing_skills.append(m_skill)
        else:
            final_missing_skills = exact_missing_skills

        missing_skills = final_missing_skills
        
        # 3. Match Percentage Calculation

        cosine_sim = 0

        if job_desc.strip() and resume_text.strip():
            try:
                vectorizer = TfidfVectorizer(
                    stop_words='english'
                )

                tfidf_matrix = vectorizer.fit_transform(
                    [resume_text, job_desc]
                )

                cosine_sim = float(cosine_similarity(
                    tfidf_matrix[0:1],
                    tfidf_matrix[1:2]
                )[0][0])
            except Exception:
                cosine_sim = 0.0
        
        # B: Skill Matching Ratio (Specific requirements)
        skill_match_ratio = 0
        if len(job_skills) > 0:
            skill_match_ratio = len(matched_skills) / len(job_skills)
        
        is_general_analysis = (
            len(job_skills) == 0
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

        # 5. Role Recommendations (Hybrid Semantic + Exact Match)
        role_scores = {}
        skill_depth_score = min(1.0, len(resume_skills) / 12.0) * 100
        has_exp = 100 if len(experience.get("positions", [])) > 0 or project_count > 0 else 30

        # Calculate TF-IDF semantic similarities
        role_names = list(ROLE_SKILLS.keys())
        role_texts = [f"{role} {' '.join(skills)}" for role, skills in ROLE_SKILLS.items()]
        
        tfidf_scores = {r: 0 for r in role_names}
        if request.resume_text.strip():
            try:
                vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1,2))
                corpus = [clean_text(request.resume_text)] + role_texts
                tfidf = vectorizer.fit_transform(corpus)
                sims = cosine_similarity(tfidf[0:1], tfidf[1:])[0]
                tfidf_scores = {role_names[i]: sims[i] * 100 for i in range(len(role_names))}
            except Exception as e:
                print(f"TF-IDF role matching failed: {e}")

        for role, skills in ROLE_SKILLS.items():
            matched_in_role = [s for s in skills if s in resume_skills]
            matched_count = len(matched_in_role)
            
            # Exact Match Score with Confidence Penalty
            confidence_penalty = 1.0
            if matched_count == 0:
                domain_score = 0
            else:
                if matched_count == 1:
                    confidence_penalty = 0.3
                elif matched_count == 2:
                    confidence_penalty = 0.7
                    
                domain_score = (matched_count / max(len(skills), 8)) * 100
            
            exact_match_score = domain_score * confidence_penalty
            semantic_score = min(100.0, tfidf_scores.get(role, 0) * 5) # Scale up semantic signal
            
            if exact_match_score == 0 and semantic_score < 10:
                raw_match = 0
            else:
                # Use whichever signal is stronger: exact keywords or semantic context
                base_score = max(exact_match_score, semantic_score)
                domain_multiplier = min(1.0, (max(matched_count, semantic_score/15) / 3.0)) 
                raw_match = (base_score * 0.70) + (skill_depth_score * 0.20 * domain_multiplier) + (has_exp * 0.10 * domain_multiplier)
            
            role_scores[role] = min(98.0, max(0.0, round(raw_match, 2)))

        highest_score = max(role_scores.values()) if role_scores else 0

        if highest_score == 0:
            if len(experience.get("positions", [])) > 0:
                best_role = experience["positions"][0]["title"]
            else:
                best_role = "Unclassified Professional"
        else:
            best_role = max(role_scores, key=role_scores.get)

        # Get top 6 roles for recommendations
        top_roles = sorted(
            role_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:6]

        recommended_roles = [
            role
            for role, score in top_roles
            if score > 35
        ]

        total_score = sum(role_scores.values())
        if total_score > 0:
            role_confidence = round((highest_score / total_score) * 100, 2)
        else:
            role_confidence = 0

        # 6. Calculate Match Percentage (Top Domain vs Global Market Coverage)
        top_role_match = 0
        global_market_match = 0
        
        if is_general_analysis:
            best_role_skills = ROLE_SKILLS.get(best_role, [])
            top_role_match = role_scores.get(best_role, 0)
            
            # B. Option 1: True Global Market Fit Across All Industry Sectors (typically 1.5% - 5%)
            all_sector_skills = set().union(*ROLE_SKILLS.values())
            matched_global = resume_skills & all_sector_skills
            if len(all_sector_skills) > 0:
                global_ratio = len(matched_global) / len(all_sector_skills)
                global_market_match = round((global_ratio / len(ROLE_SKILLS)) * 100, 2)
            if global_market_match == 0 and len(resume_skills) > 0:
                global_market_match = round(min(4.5, len(resume_skills) * 0.35), 2)
                
            final_match_percentage = top_role_match
        else:
            if request.job_description.strip() in ROLE_SKILLS and not request.required_skills:
                # Harmonize with Market Role Alignment scoring
                final_match_percentage = role_scores.get(request.job_description.strip(), 0)
            else:
                # Unify the DB Job scoring formula with the Market Role formula
                domain_multiplier = min(1.0, (len(matched_skills) / 3.0)) if len(job_skills) > 0 else 0
                raw_match = ((skill_match_ratio * 100) * 0.70) + (skill_depth_score * 0.20 * domain_multiplier) + (has_exp * 0.10 * domain_multiplier)
                
                # Boost slightly if there is high semantic text similarity, but don't let it drag the score down to 0
                if cosine_sim > 0.1:
                    raw_match += (cosine_sim * 10)
                    
                final_match_percentage = round(min(98.0, max(0.0, raw_match)), 2)
            top_role_match = final_match_percentage
            global_market_match = 0

        return {
            "match_percentage": round(final_match_percentage, 2),
            "top_role_match": round(top_role_match, 2),
            "global_market_match": round(global_market_match, 2),
            "missing_skills": missing_skills,
            "matched_skills": matched_skills,
            "semantic_matches": semantic_matches,
            "strength_score": round(strength_score, 2),
            "extracted_skills": list(resume_skills),
            "experience": experience,
            "best_role": best_role,
            "recommended_roles": recommended_roles,
            "role_scores": role_scores,
            "role_confidence": role_confidence,
            "is_general_analysis": is_general_analysis,
            "is_market_role": is_general_analysis,
            "matched_skill_count": len(matched_skills),
            "required_skill_count": len(job_skills),
            "parsed_text": resume_text,
        }

        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


from typing import List, Optional

class CoverLetterRequest(BaseModel):
    name: str
    target_role: str
    target_company: str
    hiring_manager: Optional[str] = "Hiring Manager"
    skills: List[str]
    experience_highlights: List[str]
    tone: str = "Professional"

@app.post("/generate-cover-letter")
def generate_cover_letter(req: CoverLetterRequest):
    """
    Generates a tailored cover letter using NLP synthesis based on candidate data and target role.
    """
    try:
        # Construct the paragraphs
        skills_str = ", ".join(req.skills[:5]) if req.skills else "my diverse skill set"
        exp_str = req.experience_highlights[0] if req.experience_highlights else "delivering high-quality results"
        
        opening = f"Dear {req.hiring_manager},\n\nI am writing to express my strong interest in the {req.target_role} position at {req.target_company}. With a proven track record in the industry and a deep passion for innovation, I am confident in my ability to make an immediate impact on your team."
        
        if req.tone.lower() == "enthusiastic":
            opening = f"Dear {req.hiring_manager},\n\nI am absolutely thrilled to apply for the {req.target_role} role at {req.target_company}! I have been following your company's incredible work, and I know my background makes me a perfect fit for this exciting opportunity."
        elif req.tone.lower() == "executive":
            opening = f"Dear {req.hiring_manager},\n\nPlease accept this letter as formal expression of my interest in the {req.target_role} position with {req.target_company}. My career has been defined by driving strategic initiatives and fostering operational excellence."
            
        body1 = f"Throughout my career, I have honed my expertise in {skills_str}. For example, {exp_str}. This experience has equipped me with the unique ability to navigate complex challenges and consistently deliver value. I thrive in environments that demand both strategic thinking and hands-on execution."
        
        if req.tone.lower() == "confident":
            body1 = f"My expertise in {skills_str} sets me apart as a top performer. Specifically, {exp_str}. I consistently exceed expectations and bring a high level of dedication and strategic vision to every project I touch."
            
        body2 = f"What draws me to {req.target_company} is your commitment to excellence and innovation in the space. I am eager to bring my background to your organization and contribute to your continued success. I believe my unique blend of technical skills and collaborative mindset aligns perfectly with your goals."
        
        conclusion = f"Thank you for considering my application. I would welcome the opportunity to discuss how my experience and vision can contribute to the success of {req.target_company}. I look forward to the possibility of speaking with you soon.\n\nSincerely,\n{req.name}"

        return {
            "letter": f"{opening}\n\n{body1}\n\n{body2}\n\n{conclusion}"
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
