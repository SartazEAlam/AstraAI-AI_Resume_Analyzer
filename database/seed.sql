-- ============================================================
-- Seed Data: Job Roles with Required Skills (MySQL)
-- Run this after schema.sql to populate your Jobs table
-- ============================================================

USE resume_analyzer;

INSERT IGNORE INTO Jobs (id, title, description, required_skills) VALUES
(
  1,
  'Frontend Developer',
  'We are looking for a skilled Frontend Developer proficient in modern web technologies. You will be responsible for building responsive user interfaces, optimizing web performance, and collaborating with backend teams. Experience with component-based architecture and state management is essential.',
  '["HTML", "CSS", "JavaScript", "React.js", "TypeScript", "Tailwind CSS", "Git", "REST APIs", "Responsive Design", "Webpack"]'
),
(
  2,
  'Backend Developer',
  'Seeking an experienced Backend Developer to design, build, and maintain server-side logic. You will ensure high performance and responsiveness, integrate front-end elements, and manage database operations. Strong understanding of RESTful API design and security best practices required.',
  '["Node.js", "Express.js", "Python", "MySQL", "MongoDB", "REST APIs", "Docker", "Git", "Authentication", "Redis"]'
),
(
  3,
  'Data Scientist',
  'Join our data team to extract insights from large datasets. You will build predictive models, perform statistical analysis, and communicate findings to stakeholders. Experience with machine learning frameworks and data visualization is critical.',
  '["Python", "Pandas", "NumPy", "scikit-learn", "TensorFlow", "SQL", "Data Visualization", "Statistics", "Machine Learning", "Jupyter"]'
),
(
  4,
  'Machine Learning Engineer',
  'We need an ML Engineer to design and deploy machine learning systems at scale. You will work on model training, feature engineering, and production deployment pipelines. Deep learning and NLP experience is highly valued.',
  '["Python", "TensorFlow", "PyTorch", "scikit-learn", "NLP", "spaCy", "Docker", "AWS", "Deep Learning", "MLOps"]'
),
(
  5,
  'Full Stack Developer',
  'Looking for a versatile Full Stack Developer comfortable working across the entire web stack. You will build end-to-end features, from database design to UI implementation. Strong problem-solving skills and knowledge of modern frameworks required.',
  '["React.js", "Node.js", "Express.js", "MySQL", "MongoDB", "HTML", "CSS", "JavaScript", "Git", "Docker"]'
),
(
  6,
  'DevOps Engineer',
  'Seeking a DevOps Engineer to streamline our development and deployment processes. You will manage CI/CD pipelines, cloud infrastructure, and monitoring systems. Experience with containerization and infrastructure-as-code is essential.',
  '["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins", "Git", "Monitoring", "Bash"]'
),
(
  7,
  'Data Analyst',
  'We are hiring a Data Analyst to help drive business decisions with data. You will create dashboards, perform ad-hoc analysis, and present actionable insights. Strong SQL skills and experience with visualization tools are a must.',
  '["SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics", "Data Visualization", "ETL", "Pandas", "Communication"]'
),
(
  8,
  'Cybersecurity Analyst',
  'Looking for a Cybersecurity Analyst to protect our digital assets. You will monitor threats, conduct vulnerability assessments, and implement security protocols. Knowledge of compliance frameworks and incident response is required.',
  '["Network Security", "Firewalls", "SIEM", "Penetration Testing", "Linux", "Python", "Compliance", "Incident Response", "Encryption", "Vulnerability Assessment"]'
);

-- Sample User (for testing)
INSERT IGNORE INTO Users (name, email) VALUES
('Test Student', 'student@example.com');
