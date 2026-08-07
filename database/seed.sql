-- ============================================================
-- Multi-Sector Seed Data: 54 High-Demand Job Roles Across 10 Industries
-- ============================================================

USE resume_analyzer;

-- Clean existing seeded jobs to avoid duplicate IDs
TRUNCATE TABLE Analysis_History;
DELETE FROM Jobs;

INSERT INTO Jobs (id, title, category, description, required_skills) VALUES

-- 💻 1. TECHNOLOGY & SOFTWARE DEVELOPMENT
(1, 'Frontend Developer', 'Technology', 
 'Build responsive web interfaces using modern frameworks, component-based architectures, and state management.',
 '["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Git", "REST APIs", "Webpack"]'),

(2, 'Backend Developer', 'Technology',
 'Design scalable server-side architectures, RESTful/GraphQL APIs, database models, and microservices.',
 '["Node.js", "Express", "Python", "MySQL", "MongoDB", "REST APIs", "Docker", "Git", "Redis"]'),

(3, 'Full Stack Engineer', 'Technology',
 'Deliver end-to-end web applications combining robust backend services with polished frontend UI/UX.',
 '["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Docker", "AWS", "Git", "GraphQL"]'),

(4, 'DevOps & Cloud Engineer', 'Technology',
 'Manage CI/CD pipelines, container orchestration, cloud infrastructure (AWS/Azure), and system reliability.',
 '["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins", "Git", "Monitoring"]'),

(5, 'Cybersecurity Analyst', 'Technology',
 'Monitor threat vectors, conduct vulnerability assessments, manage firewalls, SIEM, and incident responses.',
 '["Network Security", "Firewalls", "SIEM", "Penetration Testing", "Linux", "Python", "Compliance", "Incident Response"]'),

(6, 'Mobile App Developer', 'Technology',
 'Build native and cross-platform mobile apps with smooth animations, offline persistence, and API integration.',
 '["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin", "REST APIs", "Git"]'),

(7, 'QA & Automation Test Engineer', 'Technology',
 'Write automated test suites, end-to-end integration tests, regression suites, and maintain test pipelines.',
 '["Selenium", "Cypress", "Jest", "Automation Testing", "CI/CD", "Python", "Postman", "Git"]'),

(8, 'IT Systems Administrator', 'Technology',
 'Maintain server infrastructure, Active Directory, network switches, enterprise backup systems, and IT support.',
 '["Linux", "Windows Server", "Active Directory", "Networking", "Bash", "VMware", "Troubleshooting"]'),


-- 🤖 2. DATA SCIENCE & ARTIFICIAL INTELLIGENCE
(9, 'Data Scientist', 'Data Science & AI',
 'Develop predictive machine learning models, statistical analyses, feature engineering, and data insights.',
 '["Python", "Pandas", "NumPy", "scikit-learn", "Machine Learning", "SQL", "Statistics", "Data Visualization"]'),

(10, 'Machine Learning / AI Engineer', 'Data Science & AI',
 'Train deep learning architectures, deploy model inference endpoints, MLOps pipelines, and computer vision systems.',
 '["PyTorch", "TensorFlow", "Deep Learning", "Python", "Docker", "MLOps", "Computer Vision", "NLP"]'),

(11, 'Data Engineer', 'Data Science & AI',
 'Build distributed data pipelines, ETL workflows, data warehousing schemas, and real-time streaming architectures.',
 '["Python", "SQL", "Spark", "ETL", "Snowflake", "Airflow", "Data Warehousing", "Kafka"]'),

(12, 'BI & Data Analytics Specialist', 'Data Science & AI',
 'Create executive BI dashboards, data modeling, KPI reporting, and strategic data-driven business insights.',
 '["Power BI", "Tableau", "SQL", "Excel", "Data Visualization", "DAX", "Business Intelligence"]'),

(13, 'NLP & LLM Engineer', 'Data Science & AI',
 'Fine-tune large language models, build retrieval-augmented generation (RAG) pipelines, and prompt frameworks.',
 '["NLP", "LangChain", "Transformers", "Python", "PyTorch", "FastAPI", "Vector Databases"]'),


-- 📈 3. FINANCE, BANKING & ACCOUNTING
(14, 'Financial Analyst', 'Finance & Banking',
 'Perform financial modeling, forecasting, variance analysis, company valuations, and investment presentations.',
 '["Financial Modeling", "Valuation", "Excel", "Financial Analysis", "Forecasting", "Accounting", "Power BI", "Corporate Finance"]'),

(15, 'Senior Accountant & Auditor', 'Finance & Banking',
 'Manage general ledger, month-end closing, GAAP/IFRS compliance, internal audits, and tax preparations.',
 '["GAAP", "General Ledger", "Auditing", "Tax Preparation", "QuickBooks", "SAP", "Account Reconciliation", "CPA"]'),

(16, 'Investment Banking Associate', 'Finance & Banking',
 'Execute M&A due diligence, pitch books, leveraged buyout (LBO) models, and capital market transactions.',
 '["M&A", "Due Diligence", "LBO Modeling", "Valuation", "Pitch Books", "Capital Markets", "Financial Modeling"]'),

(17, 'Risk & Compliance Officer', 'Finance & Banking',
 'Oversee enterprise risk assessments, credit risk models, anti-money laundering (AML), and regulatory adherence.',
 '["Risk Management", "Compliance", "Internal Audit", "AML", "Regulatory Compliance", "Credit Risk", "Reporting"]'),

(18, 'Tax Consultant / Specialist', 'Finance & Banking',
 'Provide corporate tax strategy, IRS audit defense, tax return preparation, and multi-state compliance.',
 '["Tax Planning", "Tax Preparation", "Corporate Tax", "GAAP", "CPA", "Accounting", "Excel"]'),

(19, 'Wealth & Portfolio Manager', 'Finance & Banking',
 'Manage high-net-worth client asset allocations, mutual funds, equities, and wealth preservation strategies.',
 '["Portfolio Management", "Asset Allocation", "Equity Research", "Financial Planning", "Wealth Management", "CFA"]'),


-- 🏥 4. HEALTHCARE, MEDICINE & LIFE SCIENCES
(20, 'Registered Nurse (RN)', 'Healthcare',
 'Provide direct patient care, administer medications, monitor vital signs, triage, and collaborate with physicians.',
 '["Patient Care", "Medication Administration", "Triage", "BLS", "ACLS", "EMR", "Clinical Assessment", "Infection Control"]'),

(21, 'Clinical Research Coordinator', 'Healthcare',
 'Manage clinical trials, protocol compliance, patient recruitment, FDA regulations, and data collection.',
 '["GCP", "Clinical Trials", "IRB", "Protocol Compliance", "Patient Recruitment", "Data Management", "FDA Regulations"]'),

(22, 'Healthcare Administrator', 'Healthcare',
 'Oversee hospital operations, healthcare billing, HIPAA compliance, staff scheduling, and quality assurance.',
 '["Healthcare Management", "HIPAA", "Medical Billing", "Electronic Health Records", "EHR", "Budgeting", "Quality Assurance"]'),

(23, 'Medical Laboratory Technologist', 'Healthcare',
 'Perform diagnostic lab testing, hematology assays, chemical analyses, and calibrate diagnostic equipment.',
 '["Clinical Laboratory", "Hematology", "Phlebotomy", "Quality Control", "Microbiology", "Lab Safety"]'),

(24, 'Clinical Pharmacist', 'Healthcare',
 'Dispense medications, review drug interactions, provide patient medication therapy, and verify dosages.',
 '["Pharmacology", "Medication Therapy", "Patient Counseling", "Drug Interactions", "Pharmacy Practice", "Clinical Assessment"]'),

(25, 'Biomedical Engineer', 'Healthcare',
 'Design and maintain medical equipment, biomaterials, physiological monitoring sensors, and FDA test validations.',
 '["Medical Devices", "Biomedical Instrumentation", "FDA Regulations", "MATLAB", "CAD", "Quality Assurance"]'),


-- 📣 5. MARKETING, SALES & GROWTH
(26, 'Digital Marketing Specialist', 'Marketing & Sales',
 'Drive growth via performance marketing, Google Ads, SEO, content strategy, email campaigns, and web analytics.',
 '["SEO", "Google Analytics", "Content Marketing", "Social Media Marketing", "Email Marketing", "PPC", "Copywriting", "HubSpot"]'),

(27, 'Enterprise Account Executive', 'Marketing & Sales',
 'Generate B2B leads, deliver product demonstrations, negotiate enterprise contracts, and achieve sales quotas.',
 '["B2B Sales", "Lead Generation", "Salesforce", "Cold Calling", "Negotiation", "CRM", "Contract Negotiation", "Pipeline Management"]'),

(28, 'Brand & Content Strategist', 'Marketing & Sales',
 'Develop brand storytelling, creative campaigns, audience research, PR communications, and social growth.',
 '["Brand Strategy", "Content Strategy", "Copywriting", "Public Relations", "Social Media", "Market Research", "Storytelling"]'),

(29, 'SEO & Growth Marketing Manager', 'Marketing & Sales',
 'Optimize technical search ranking, backlink acquisition, A/B testing conversion funnels, and organic traffic growth.',
 '["SEO", "Google Search Console", "A/B Testing", "SEM", "Google Analytics", "Keyword Research", "Conversion Optimization"]'),

(30, 'Product Marketing Manager (PMM)', 'Marketing & Sales',
 'Orchestrate go-to-market launches, competitive positioning, value proposition messaging, and sales enablement.',
 '["Product Marketing", "Go-To-Market", "Competitive Analysis", "Product Positioning", "Market Research", "Sales Enablement"]'),

(31, 'Customer Success Manager (CSM)', 'Marketing & Sales',
 'Drive product adoption, reduce customer churn, run quarterly business reviews, and expand account value.',
 '["Customer Retention", "Account Management", "Onboarding", "CRM", "Zendesk", "Customer Support", "Communication"]'),


-- 👥 6. HUMAN RESOURCES & PEOPLE OPERATIONS
(32, 'Human Resources Manager', 'Human Resources',
 'Lead talent management, employee relations, performance reviews, organizational culture, and HR compliance.',
 '["Employee Relations", "Talent Management", "HR Compliance", "Performance Management", "Conflict Resolution", "HR Policies"]'),

(33, 'Technical Recruiter / Talent Acquisition', 'Human Resources',
 'Source engineering candidates, manage applicant tracking systems (ATS), conduct behavioral interviews, and negotiate offers.',
 '["Talent Sourcing", "ATS", "Interviewing", "Candidate Screening", "LinkedIn Recruiter", "Offer Negotiation", "Headhunting"]'),

(34, 'HR Business Partner (HRBP)', 'Human Resources',
 'Align business objectives with talent strategies, workforce planning, succession planning, and executive coaching.',
 '["Strategic HR", "Workforce Planning", "Organizational Development", "Leadership Development", "Change Management"]'),

(35, 'Compensation & Benefits Specialist', 'Human Resources',
 'Design total reward programs, manage healthcare benefits, salary benchmarking, 401(k) plans, and payroll audits.',
 '["Compensation Planning", "Benefits Administration", "Salary Benchmarking", "Payroll", "Workday", "Job Evaluation"]'),

(36, 'Learning & Development (L&D) Specialist', 'Human Resources',
 'Design corporate training modules, onboarding curricula, LMS administration, and professional development programs.',
 '["Instructional Design", "Training Delivery", "LMS", "Employee Training", "Curriculum Development", "E-Learning"]'),


-- 📦 7. SUPPLY CHAIN, OPERATIONS & LOGISTICS
(37, 'Supply Chain Analyst', 'Supply Chain & Operations',
 'Optimize inventory levels, demand forecasting, logistics routing, vendor relationships, and supplier metrics.',
 '["Supply Chain Management", "Inventory Control", "Demand Forecasting", "Logistics", "SAP", "ERP", "Vendor Management", "Excel"]'),

(38, 'Operations & Plant Manager', 'Supply Chain & Operations',
 'Direct day-to-day facility operations, Lean Six Sigma processes, production schedules, safety, and KPIs.',
 '["Operations Management", "Lean Manufacturing", "Six Sigma", "Process Optimization", "Quality Control", "Team Leadership"]'),

(39, 'Procurement & Sourcing Specialist', 'Supply Chain & Operations',
 'Manage supplier RFPs, contract negotiation, cost reduction initiatives, purchase orders, and supplier risk.',
 '["Strategic Sourcing", "Procurement", "Vendor Management", "Contract Negotiation", "SAP", "Cost Analysis"]'),

(40, 'Logistics & Freight Coordinator', 'Supply Chain & Operations',
 'Coordinate freight shipments, carrier dispatching, customs clearance, warehouse transfers, and route optimization.',
 '["Logistics", "Freight Forwarding", "Supply Chain", "Dispatching", "Route Optimization", "TMS", "Warehouse Operations"]'),

(41, 'Warehouse & Inventory Manager', 'Supply Chain & Operations',
 'Manage distribution center operations, pick/pack/ship workflows, inventory counts, and OSHA safety compliance.',
 '["Warehouse Management", "Inventory Management", "WMS", "Distribution", "Safety Compliance", "Logistics"]'),


-- 🎨 8. DESIGN, PRODUCT & CREATIVE
(42, 'UI/UX Product Designer', 'Design & Creative',
 'Design intuitive user experiences, wireframes, high-fidelity prototypes, user research, and design systems.',
 '["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems", "User Testing", "Adobe XD"]'),

(43, 'Graphic & Brand Designer', 'Design & Creative',
 'Create visual branding, logos, marketing collateral, typography, and vector illustrations.',
 '["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Typography", "Brand Identity", "Visual Design", "Motion Graphics"]'),

(44, 'Technical Product Manager', 'Design & Creative',
 'Define product roadmaps, groom engineering backlogs, write detailed user stories, and drive Agile sprints.',
 '["Product Management", "Agile", "Scrum", "Product Roadmaps", "User Stories", "JIRA", "Wireframing"]'),

(45, 'Motion Graphics & Video Producer', 'Design & Creative',
 'Produce animated video content, promo reels, visual effects (VFX), sound design, and video editing.',
 '["Adobe After Effects", "Premiere Pro", "Motion Graphics", "Video Editing", "Animation", "Storyboarding"]'),

(46, '3D & Industrial Product Designer', 'Design & Creative',
 'Model 3D components, physical prototypes, industrial product aesthetics, and render photorealistic designs.',
 '["SolidWorks", "CAD", "3D Modeling", "Blender", "Rapid Prototyping", "Rendering", "Industrial Design"]'),


-- ⚖️ 9. LEGAL, GOVERNANCE & COMPLIANCE
(47, 'Corporate Legal Counsel', 'Legal & Compliance',
 'Draft commercial agreements, manage corporate governance, intellectual property protection, and risk mitigation.',
 '["Corporate Law", "Contract Drafting", "Legal Compliance", "Risk Mitigation", "Due Diligence", "M&A"]'),

(48, 'Paralegal / Legal Assistant', 'Legal & Compliance',
 'Conduct legal case research, prepare court filings, organize discovery documents, and draft legal summaries.',
 '["Legal Research", "Document Drafting", "Case Management", "Discovery", "Litigation Support", "Westlaw"]'),

(49, 'Regulatory Affairs Specialist', 'Legal & Compliance',
 'Ensure statutory and regulatory compliance, manage regulatory submissions, licenses, and audits.',
 '["Regulatory Compliance", "Policy Development", "Audit Management", "Risk Analysis", "Government Relations"]'),

(50, 'Contract Administrator', 'Legal & Compliance',
 'Manage end-to-end contract lifecycles, SLAs, contract renegotiations, compliance verifications, and archiving.',
 '["Contract Management", "Negotiation", "SLA Management", "Compliance", "Procurement", "Legal Writing"]'),


-- 🏗️ 10. ENGINEERING & CONSTRUCTION
(51, 'Mechanical Engineer', 'Engineering & Construction',
 'Design mechanical systems, heat transfer components, 3D CAD modeling, structural FEA, and GD&T drawings.',
 '["AutoCAD", "SolidWorks", "Mechanical Engineering", "FEA", "Thermodynamics", "GD&T", "Product Design"]'),

(52, 'Electrical Engineer', 'Engineering & Construction',
 'Design circuit boards, PCB layouts, microcontrollers, embedded hardware firmware, and power systems.',
 '["Circuit Design", "PCB Design", "MATLAB", "Embedded Systems", "Microcontrollers", "Electrical Engineering"]'),

(53, 'Civil & Structural Engineer', 'Engineering & Construction',
 'Design structural foundations, concrete/steel frameworks, civil blueprints, and perform site load calculations.',
 '["AutoCAD", "Revit", "Structural Analysis", "Civil Engineering", "Site Inspection", "Construction Management"]'),

(54, 'Construction Project Manager', 'Engineering & Construction',
 'Oversee construction site operations, subcontractor scheduling, project budgets, and OSHA safety standards.',
 '["Construction Management", "Project Scheduling", "Primavera P6", "Budgeting", "Safety Management", "OSHA"]');

-- Sample User
INSERT IGNORE INTO Users (name, email) VALUES
('Test Candidate', 'candidate@example.com');
