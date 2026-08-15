import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Wand2,
  Loader2,
} from "lucide-react";

/* ── Section Accordion Wrapper ── */
const Section = ({ icon: Icon, title, count, isOpen, onToggle, children }) => (
  <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden transition-colors">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
        {count > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
            {count}
          </span>
        )}
      </div>
      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {isOpen && <div className="p-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">{children}</div>}
  </div>
);

/* ── Form Input Helper ── */
const Input = ({ label, value, onChange, placeholder, type = "text", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>}
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
      {...props}
    />
  </div>
);

/* ── Textarea with optional AI Enhance ── */
const TextArea = ({ label, value, onChange, placeholder, rows = 3, onEnhance, enhancing }) => (
  <div className="space-y-1 relative group">
    {label && (
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
        {onEnhance && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onEnhance(); }}
            disabled={enhancing || !value?.trim()}
            className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-40 transition-colors"
          >
            {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            AI Enhance
          </button>
        )}
      </div>
    )}
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />
  </div>
);

/* ── Main Resume Form Component ── */
const ResumeForm = ({ data, onChange }) => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
  });
  const [enhancingStates, setEnhancingStates] = useState({});

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const update = (field, value) => onChange({ ...data, [field]: value });

  const updatePersonal = (field, value) =>
    update("personalInfo", { ...data.personalInfo, [field]: value });

  /* ── Array field helpers ── */
  const addItem = (field, template) =>
    update(field, [...(data[field] || []), template]);

  const removeItem = (field, index) =>
    update(field, (data[field] || []).filter((_, i) => i !== index));

  const updateItem = (field, index, newData) =>
    update(
      field,
      (data[field] || []).map((item, i) => (i === index ? { ...item, ...newData } : item))
    );

  /* ── Bullet helpers ── */
  const addBullet = (expIndex) => {
    const exp = [...(data.experience || [])];
    exp[expIndex] = { ...exp[expIndex], bullets: [...(exp[expIndex].bullets || []), ""] };
    update("experience", exp);
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    const exp = [...(data.experience || [])];
    const bullets = [...(exp[expIndex].bullets || [])];
    bullets[bulletIndex] = value;
    exp[expIndex] = { ...exp[expIndex], bullets };
    update("experience", exp);
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const exp = [...(data.experience || [])];
    exp[expIndex] = {
      ...exp[expIndex],
      bullets: exp[expIndex].bullets.filter((_, i) => i !== bulletIndex),
    };
    update("experience", exp);
  };

  /* ── AI Enhance a single bullet ── */
  const enhanceBullet = async (expIndex, bulletIndex) => {
    const key = `exp-${expIndex}-${bulletIndex}`;
    const bulletText = data.experience?.[expIndex]?.bullets?.[bulletIndex];
    if (!bulletText?.trim()) return;

    setEnhancingStates((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await axios.post("http://localhost:5000/api/enhance-bullet", { text: bulletText });
      if (response.data?.enhanced) {
        updateBullet(expIndex, bulletIndex, response.data.enhanced);
      }
    } catch (err) {
      console.error("Enhance failed:", err);
    } finally {
      setEnhancingStates((prev) => ({ ...prev, [key]: false }));
    }
  };

  /* ── AI Enhance Professional Summary ── */
  const enhanceSummary = async () => {
    const summaryText = data.summary?.trim() || "";
    // If summary is empty, generate from roles/skills
    const contextText = summaryText || (data.skills?.length > 0 ? `Experienced professional skilled in ${data.skills.slice(0, 5).join(", ")}.` : "");
    if (!contextText) return;

    setEnhancingStates((prev) => ({ ...prev, summary: true }));
    try {
      const response = await axios.post("http://localhost:5000/api/enhance-bullet", { text: contextText });
      if (response.data?.enhanced) {
        update("summary", response.data.enhanced);
      }
    } catch (err) {
      console.error("Enhance summary failed:", err);
    } finally {
      setEnhancingStates((prev) => ({ ...prev, summary: false }));
    }
  };

  /* ── Skills tag input ── */
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const raw = skillInput.trim();
    if (!raw) return;
    const currentSkills = Array.isArray(data.skills) 
      ? data.skills 
      : (typeof data.skills === 'string' ? data.skills.split(/[,;\n•|]+/).map(s => s.trim()).filter(Boolean) : []);

    const newItems = raw
      .split(/[,;\n•|]+/)
      .map((s) => s.trim())
      .filter((s) => s && !currentSkills.includes(s));

    if (newItems.length > 0) {
      update("skills", [...currentSkills, ...newItems]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const currentSkills = Array.isArray(data.skills) 
      ? data.skills 
      : (typeof data.skills === 'string' ? data.skills.split(/[,;\n•|]+/).map(s => s.trim()).filter(Boolean) : []);
    update("skills", currentSkills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 pb-6">
      {/* ── Personal Info ── */}
      <Section
        icon={User}
        title="Personal Information"
        isOpen={openSections.personal}
        onToggle={() => toggle("personal")}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input
              label="Full Name"
              value={data.personalInfo?.fullName}
              onChange={(v) => updatePersonal("fullName", v)}
              placeholder="John Doe"
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={data.personalInfo?.email}
            onChange={(v) => updatePersonal("email", v)}
            placeholder="john@example.com"
          />
          <Input
            label="Phone"
            value={data.personalInfo?.phone}
            onChange={(v) => updatePersonal("phone", v)}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Location"
            value={data.personalInfo?.location}
            onChange={(v) => updatePersonal("location", v)}
            placeholder="Mumbai, India"
          />
          <Input
            label="LinkedIn URL"
            value={data.personalInfo?.linkedin}
            onChange={(v) => updatePersonal("linkedin", v)}
            placeholder="linkedin.com/in/johndoe"
          />
          <div className="col-span-2">
            <Input
              label="Portfolio / Website"
              value={data.personalInfo?.portfolio}
              onChange={(v) => updatePersonal("portfolio", v)}
              placeholder="https://johndoe.dev"
            />
          </div>
        </div>
      </Section>

      {/* ── Summary ── */}
      <Section
        icon={FileText}
        title="Professional Summary"
        isOpen={openSections.summary}
        onToggle={() => toggle("summary")}
      >
        <TextArea
          label="Summary"
          value={data.summary}
          onChange={(v) => update("summary", v)}
          placeholder="Write a compelling 2-3 sentence summary highlighting your key strengths and career goals..."
          rows={4}
          onEnhance={enhanceSummary}
          enhancing={enhancingStates.summary}
        />
      </Section>

      {/* ── Experience ── */}
      <Section
        icon={Briefcase}
        title="Work Experience"
        count={(data.experience || []).length}
        isOpen={openSections.experience}
        onToggle={() => toggle("experience")}
      >
        <div className="space-y-4">
          {(data.experience || []).map((exp, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Position #{i + 1}</span>
                <button
                  onClick={() => removeItem("experience", i)}
                  className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Job Title" value={exp.title} onChange={(v) => updateItem("experience", i, { title: v })} placeholder="Software Engineer" />
                <Input label="Company" value={exp.company} onChange={(v) => updateItem("experience", i, { company: v })} placeholder="Google" />
                <Input label="Start Date" value={exp.startDate} onChange={(v) => updateItem("experience", i, { startDate: v })} placeholder="Jan 2023" />
                <Input label="End Date" value={exp.endDate} onChange={(v) => updateItem("experience", i, { endDate: v })} placeholder="Present" />
                <div className="col-span-2">
                  <Input label="Location" value={exp.location} onChange={(v) => updateItem("experience", i, { location: v })} placeholder="Bangalore, India" />
                </div>
              </div>
              {/* Bullets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Achievements</label>
                {(exp.bullets || []).map((bullet, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 mt-2.5 font-mono">•</span>
                    <textarea
                      value={bullet}
                      onChange={(e) => updateBullet(i, j, e.target.value)}
                      rows={2}
                      placeholder="Describe an achievement with quantifiable impact..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); enhanceBullet(i, j); }}
                        disabled={enhancingStates[`exp-${i}-${j}`] || !bullet?.trim()}
                        title="AI Enhance"
                        className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-500 disabled:opacity-30 transition-colors"
                      >
                        {enhancingStates[`exp-${i}-${j}`] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => removeBullet(i, j)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addBullet(i)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addItem("experience", { title: "", company: "", startDate: "", endDate: "", location: "", bullets: [""] })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
      </Section>

      {/* ── Education ── */}
      <Section
        icon={GraduationCap}
        title="Education"
        count={(data.education || []).length}
        isOpen={openSections.education}
        onToggle={() => toggle("education")}
      >
        <div className="space-y-3">
          {(data.education || []).map((edu, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Education #{i + 1}</span>
                <button onClick={() => removeItem("education", i)} className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Input label="Degree / Program" value={edu.degree} onChange={(v) => updateItem("education", i, { degree: v })} placeholder="B.Tech Computer Science" />
                </div>
                <Input label="Institution" value={edu.institution} onChange={(v) => updateItem("education", i, { institution: v })} placeholder="IIT Delhi" />
                <Input label="Year" value={edu.year} onChange={(v) => updateItem("education", i, { year: v })} placeholder="2024" />
                <Input label="GPA / Percentage" value={edu.gpa} onChange={(v) => updateItem("education", i, { gpa: v })} placeholder="9.2/10" />
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem("education", { degree: "", institution: "", year: "", gpa: "" })}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
      </Section>

      {/* ── Skills ── */}
      <Section
        icon={Wrench}
        title="Skills"
        count={(data.skills || []).length}
        isOpen={openSections.skills}
        onToggle={() => toggle("skills")}
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              onClick={addSkill}
              disabled={!skillInput.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
            >
              Add
            </button>
          </div>
          {(data.skills || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800"
                >
                  {skill}
                  <button onClick={() => removeSkill(i)} className="hover:text-rose-500 transition-colors">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ── Projects ── */}
      <Section
        icon={FolderOpen}
        title="Projects"
        count={(data.projects || []).length}
        isOpen={openSections.projects}
        onToggle={() => toggle("projects")}
      >
        <div className="space-y-3">
          {(data.projects || []).map((proj, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Project #{i + 1}</span>
                <button onClick={() => removeItem("projects", i)} className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Project Name" value={proj.name} onChange={(v) => updateItem("projects", i, { name: v })} placeholder="AI Resume Analyzer" />
                <Input label="Tech Stack" value={proj.techStack} onChange={(v) => updateItem("projects", i, { techStack: v })} placeholder="React, Node.js, Python" />
                <div className="col-span-2">
                  <TextArea label="Description" value={proj.description} onChange={(v) => updateItem("projects", i, { description: v })} placeholder="Built a full-stack AI-powered resume analyzer..." rows={2} />
                </div>
                <div className="col-span-2">
                  <Input label="Link" value={proj.link} onChange={(v) => updateItem("projects", i, { link: v })} placeholder="https://github.com/user/project" />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem("projects", { name: "", description: "", techStack: "", link: "" })}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </Section>

      {/* ── Certifications ── */}
      <Section
        icon={Award}
        title="Certifications"
        count={(data.certifications || []).length}
        isOpen={openSections.certifications}
        onToggle={() => toggle("certifications")}
      >
        <div className="space-y-3">
          {(data.certifications || []).map((cert, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cert #{i + 1}</span>
                <button onClick={() => removeItem("certifications", i)} className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Name" value={cert.name} onChange={(v) => updateItem("certifications", i, { name: v })} placeholder="AWS Solutions Architect" />
                <Input label="Issuer" value={cert.issuer} onChange={(v) => updateItem("certifications", i, { issuer: v })} placeholder="Amazon" />
                <Input label="Year" value={cert.year} onChange={(v) => updateItem("certifications", i, { year: v })} placeholder="2024" />
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem("certifications", { name: "", issuer: "", year: "" })}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>
      </Section>

      {/* ── Languages ── */}
      <Section
        icon={Globe}
        title="Languages"
        count={(data.languages || []).length}
        isOpen={openSections.languages}
        onToggle={() => toggle("languages")}
      >
        <div className="space-y-3">
          {(data.languages || []).map((lang, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Input label={i === 0 ? "Language" : undefined} value={lang.language} onChange={(v) => updateItem("languages", i, { language: v })} placeholder="English" />
              </div>
              <div className="flex-1">
                <Input label={i === 0 ? "Proficiency" : undefined} value={lang.proficiency} onChange={(v) => updateItem("languages", i, { proficiency: v })} placeholder="Native / Fluent" />
              </div>
              <button onClick={() => removeItem("languages", i)} className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors mb-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem("languages", { language: "", proficiency: "" })}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Language
          </button>
        </div>
      </Section>
    </div>
  );
};

export default ResumeForm;
