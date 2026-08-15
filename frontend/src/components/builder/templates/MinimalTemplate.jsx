import React from "react";

/* ── Minimal Template ──
   Whitespace-heavy, typography-first design.
   No borders, no boxes — relies on spacing and font hierarchy.
   Ideal for design, consulting, and finance roles. */

const MinimalTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#111827";
  const fontFamily = customization?.fontFamily || "'Inter', 'Helvetica Neue', sans-serif";
  const fontSize = customization?.fontSize || "default";
  const sizeScale = fontSize === "small" ? 0.9 : fontSize === "large" ? 1.1 : 1;

  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = data || {};

  const sectionOrder = customization?.sectionOrder || [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
  ];

  const SectionTitle = ({ children }) => (
    <h2
      style={{
        fontSize: 10 * sizeScale,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "#9ca3af",
        margin: "0 0 12px 0",
        fontFamily,
      }}
    >
      {children}
    </h2>
  );

  const normalizedSkills = Array.isArray(skills)
    ? skills.filter((s) => typeof s === "string" && s.trim())
    : typeof skills === "string"
      ? skills.split(/[,;\n•·|]+/).map((s) => s.trim()).filter(Boolean)
      : [];

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <div key="summary" style={{ marginBottom: 28 }}>
            <SectionTitle>About</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.75, color: "#4b5563", margin: 0, fontFamily, maxWidth: 540 }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience" style={{ marginBottom: 28 }}>
            <SectionTitle>Experience</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12.5 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
                    <span style={{ fontSize: 10 * sizeScale, color: "#9ca3af", fontFamily, fontWeight: 500 }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" — ")}</span>
                  </div>
                  {exp.company && (
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#6b7280", margin: "3px 0 0", fontFamily, fontWeight: 500 }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ""}
                    </p>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "8px 0 0", paddingLeft: 0, listStyleType: "none" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.65, color: "#4b5563", marginBottom: 3, fontFamily, paddingLeft: 14, position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, color: "#d1d5db" }}>–</span>
                          {b}
                        </li>
                      ) : null)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <div key="education" style={{ marginBottom: 28 }}>
            <SectionTitle>Education</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{edu.degree || "Degree"}</h3>
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#6b7280", margin: "2px 0 0", fontFamily }}>
                      {edu.institution}{edu.gpa ? ` · ${edu.gpa}` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: 10 * sizeScale, color: "#9ca3af", fontFamily }}>{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return normalizedSkills.length > 0 ? (
          <div key="skills" style={{ marginBottom: 28 }}>
            <SectionTitle>Skills</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", lineHeight: 1.8, fontFamily, margin: 0 }}>
              {normalizedSkills.join("    ·    ")}
            </p>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects" style={{ marginBottom: 28 }}>
            <SectionTitle>Projects</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{proj.name || "Project"}</h3>
                    {proj.techStack && <span style={{ fontSize: 9 * sizeScale, color: "#9ca3af", fontFamily, fontWeight: 500 }}>{proj.techStack}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: "3px 0 0", lineHeight: 1.6, fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 9.5 * sizeScale, color: accent === "#111827" ? "#4f46e5" : accent, fontFamily }} target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications" style={{ marginBottom: 28 }}>
            <SectionTitle>Certifications</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {certifications.map((cert, i) => (
                <span key={i} style={{ fontSize: 10.5 * sizeScale, color: "#374151", fontFamily }}>
                  {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <div key="languages" style={{ marginBottom: 28 }}>
            <SectionTitle>Languages</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", fontFamily, margin: 0 }}>
              {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("    ·    ")}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className="resume-template resume-template-minimal"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "48px 52px",
        background: "#ffffff",
        color: "#111827",
        fontFamily,
        fontSize: `${10.5 * sizeScale}px`,
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
    >
      {/* Header — extremely minimal */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 28 * sizeScale,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.02em",
            fontFamily,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", marginTop: 8 }}>
          {personalInfo.email && <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{personalInfo.email}</span>}
          {personalInfo.phone && <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{personalInfo.location}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ fontSize: 10 * sizeScale, color: accent === "#111827" ? "#4f46e5" : accent, fontFamily }} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ fontSize: 10 * sizeScale, color: accent === "#111827" ? "#4f46e5" : accent, fontFamily }} target="_blank" rel="noopener noreferrer">Portfolio</a>}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sectionOrder.map((key) => renderSection(key))}
    </div>
  );
};

export default MinimalTemplate;
