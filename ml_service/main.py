from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import re
from datetime import datetime

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
        if job_desc.strip() and not job_skills:
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

        # 5. Role Recommendations
        # If match is low, suggest roles based on extracted resume skills
                # 5. Universal Multi-Sector Role Recommendations
        role_skills = {
            "Software Engineer": [
                "react", "node", "nodejs", "python", "javascript", "typescript", "html", "css", "sql", "git", "docker", "aws"
            ],
            "Data & AI Specialist": [
                "python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "scikit-learn", "pandas", "numpy", "sql"
            ],
            "Financial & Investment Analyst": [
                "financial modeling", "valuation", "excel", "financial analysis", "forecasting", "accounting", "corporate finance", "m&a", "gaap"
            ],
            "Healthcare / Nursing Practitioner": [
                "patient care", "nursing", "medication administration", "triage", "bls", "acls", "emr", "ehr", "hipaa", "clinical assessment"
            ],
            "Digital Marketer & Strategist": [
                "digital marketing", "seo", "google analytics", "content marketing", "social media marketing", "copywriting", "hubspot", "b2b sales"
            ],
            "HR & Talent Acquisition Specialist": [
                "human resources", "talent management", "talent acquisition", "recruiting", "ats", "employee relations", "onboarding", "workday"
            ],
            "Operations & Supply Chain Lead": [
                "supply chain management", "inventory management", "logistics", "procurement", "lean manufacturing", "six sigma", "erp", "sap"
            ],
            "UI/UX & Product Designer": [
                "figma", "ui design", "ux design", "ux research", "wireframing", "prototyping", "design systems", "adobe photoshop", "adobe illustrator"
            ],
            "Corporate Legal & Compliance Counsel": [
                "corporate law", "contract drafting", "legal compliance", "risk mitigation", "due diligence", "litigation support", "contract management", "legal research"
            ],
            "Civil / Mechanical Engineer": [
                "autocad", "solidworks", "mechanical engineering", "civil engineering", "structural analysis", "fea", "matlab", "circuit design", "construction management"
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

        # 6. Calculate Match Percentage (Top Domain vs Global Market Coverage)
        top_role_match = 0
        global_market_match = 0
        
        if is_general_analysis:
            best_role_skills = role_skills.get(best_role, [])
            matched_in_best = [s for s in best_role_skills if s in resume_skills]
            
            # A. Option 2: Primary Domain Fit (0 - 100)
            domain_score = (len(matched_in_best) / max(len(best_role_skills), 8)) * 100 if best_role_skills else 0
            skill_depth_score = min(1.0, len(resume_skills) / 12.0) * 100
            has_exp = 100 if len(experience.get("positions", [])) > 0 or project_count > 0 else 30
            raw_match = (domain_score * 0.60) + (skill_depth_score * 0.25) + (has_exp * 0.15)
            top_role_match = min(98.0, max(15.0, round(raw_match, 2))) if len(resume_skills) > 0 else 0
            
            # B. Option 1: True Global Market Fit Across All Industry Sectors (typically 1.5% - 5%)
            all_sector_skills = set().union(*role_skills.values())
            matched_global = resume_skills & all_sector_skills
            if len(all_sector_skills) > 0:
                global_ratio = len(matched_global) / len(all_sector_skills)
                global_market_match = round((global_ratio / len(role_skills)) * 100, 2)
            if global_market_match == 0 and len(resume_skills) > 0:
                global_market_match = round(min(4.5, len(resume_skills) * 0.35), 2)
                
            final_match_percentage = top_role_match
        else:
            final_match_percentage = round(
                (cosine_sim * 30)
                + (skill_match_ratio * 70),
                2
            )
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
            "matched_skill_count": len(matched_skills),
            "required_skill_count": len(job_skills),
            "parsed_text": resume_text,
        }

        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

class BulletRequest(BaseModel):
    text: str

from action_verbs import get_suggestion_for_weak_verb, ACTION_VERBS

@app.post("/enhance-bullet")
def enhance_bullet(request: BulletRequest):
    """Provides actionable feedback on a resume bullet point."""
    text = request.text.strip()
    if not text:
        return {"feedback": [], "enhanced": False, "score": 0}
        
    feedback = []
    score = 100
    
    # 1. Weak verb check
    verb_suggestion = get_suggestion_for_weak_verb(text)
    if verb_suggestion:
        feedback.append(verb_suggestion)
        score -= 20
        
    # 2. Metrics / Number check
    has_metrics = bool(re.search(r'\d+', text)) or '%' in text or '$' in text
    if not has_metrics:
        feedback.append("Missing metrics: Add numbers, percentages, or dollar amounts to quantify your impact.")
        score -= 30
        
    # 3. Length check
    words = text.split()
    if len(words) < 8:
        feedback.append("Too short: Expand on the context or the result of your action.")
        score -= 10
    elif len(words) > 30:
        feedback.append("Too long: Keep bullet points concise (aim for 1-2 lines).")
        score -= 10
        
    # 4. STAR method formatting
    # Basic check: looks for "by", "resulting in", "leading to", "achieving"
    impact_keywords = ['by', 'resulting in', 'leading to', 'achieving', 'to', 'which']
    has_impact = any(keyword in text.lower() for keyword in impact_keywords)
    if not has_impact and score > 50:
        feedback.append("Format suggestion: Try using the 'Action + Context + Result' format. What was the impact of your work?")
        score -= 15
        
    if score == 100:
        feedback.append("✨ Strong bullet point! It starts with a good verb and includes quantifiable metrics.")
        
    return {
        "original": text,
        "feedback": feedback,
        "score": max(0, score),
        "enhanced": score > 80
    }
