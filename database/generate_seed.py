import re
import json

with open('ml_service/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'ROLE_SKILLS = \{(.*?)\n\}', content, re.DOTALL)
dict_content = match.group(1)

lines = dict_content.split('\n')
category = 'Other'
jobs = []
for line in lines:
    line = line.strip()
    if line.startswith('#'):
        category = line.lstrip('#').strip()
    elif ':' in line and '[' in line:
        role_match = re.search(r'\"([^\"]+)\":\s*\[(.*?)\]', line)
        if role_match:
            role = role_match.group(1)
            skills_str = role_match.group(2)
            skills = [s.strip().strip('\"').strip("'") for s in skills_str.split(',') if s.strip()]
            jobs.append((role, category, skills))

with open('database/seed.sql', 'w', encoding='utf-8') as f:
    f.write('USE resume_analyzer;\n')
    f.write('SET FOREIGN_KEY_CHECKS=0;\n')
    f.write('TRUNCATE TABLE Analysis_History;\n')
    f.write('TRUNCATE TABLE Jobs;\n')
    f.write('SET FOREIGN_KEY_CHECKS=1;\n')
    f.write('INSERT INTO Jobs (id, title, category, description, required_skills) VALUES\n')
    
    values = []
    for i, (role, cat, skills) in enumerate(jobs, 1):
        skills_json = json.dumps(skills).replace("'", "''")
        val = f"({i}, '{role}', '{cat}', 'Comprehensive evaluation for {role} role.', '{skills_json}')"
        values.append(val)
        
    f.write(',\n'.join(values) + ';\n')
print('Generated seed.sql with', len(jobs), 'jobs.')
