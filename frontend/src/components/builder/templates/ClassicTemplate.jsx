import React from "react";

/* ── Classic Template ──
   Clean single-column ATS-friendly layout.
   No columns, no graphics — pure structured text.
   Uses accent color for headings and dividers. */

const ClassicTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#4f46e5";
  const fontFamily = customization?.fontFamily || "'Georgia', 'Times New Roman', serif";
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

  const SectionDivider = ({ title }) => (
    <div style={{ marginTop: 18, marginBottom: 10 }}>
      <h2
        style={{
          fontSize: 13 * sizeScale,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: accent,
          margin: 0,
          paddingBottom: 4,
          borderBottom: `2px solid ${accent}`,
          fontFamily,
        }}
      >
        {title}
      </h2>
    </div>
  );

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <div key="summary">
            <SectionDivider title="Professional Summary" />
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.6, color: "#374151", margin: 0, fontFamily }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience">
            <SectionDivider title="Work Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
                    <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ") || ""}</span>
                  </div>
                  {exp.company && (
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", fontStyle: "italic", margin: "2px 0 0", fontFamily }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: 18, listStyleType: "disc" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.55, color: "#374151", marginBottom: 2, fontFamily }}>{b}</li>
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
          <div key="education">
            <SectionDivider title="Education" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {education.map((edu, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{edu.degree || "Degree"}</h3>
                    <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{edu.year || ""}</span>
                  </div>
                  <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: "2px 0 0", fontFamily }}>
                    {edu.institution || ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <div key="skills">
            <SectionDivider title="Technical Skills" />
            <p style={{ fontSize: 10.5 * sizeScale, color: "#374151", lineHeight: 1.7, fontFamily, margin: 0 }}>
              {skills.join("  ·  ")}
            </p>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects">
            <SectionDivider title="Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{proj.name || "Project"}</h3>
                    {proj.techStack && <span style={{ fontSize: 9.5 * sizeScale, color: accent, fontFamily }}>({proj.techStack})</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: 10.5 * sizeScale, color: "#374151", margin: "3px 0 0", lineHeight: 1.55, fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 9.5 * sizeScale, color: accent, fontFamily }} target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications">
            <SectionDivider title="Certifications" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {certifications.map((cert, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 10.5 * sizeScale, fontWeight: 600, color: "#111827", fontFamily }}>{cert.name || "Certification"}{cert.issuer ? ` — ${cert.issuer}` : ""}</span>
                  {cert.year && <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{cert.year}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <div key="languages">
            <SectionDivider title="Languages" />
            <p style={{ fontSize: 10.5 * sizeScale, color: "#374151", fontFamily, margin: 0 }}>
              {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("  ·  ")}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className="resume-template resume-template-classic"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "36px 40px",
        background: "#ffffff",
        color: "#111827",
        fontFamily,
        fontSize: `${10.5 * sizeScale}px`,
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 8, paddingBottom: 14, borderBottom: `3px solid ${accent}` }}>
        <h1
          style={{
            fontSize: 24 * sizeScale,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "0.02em",
            fontFamily,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px", marginTop: 6 }}>
          {personalInfo.email && <span style={{ fontSize: 10 * sizeScale, color: "#4b5563", fontFamily }}>{personalInfo.email}</span>}
          {personalInfo.phone && <span style={{ fontSize: 10 * sizeScale, color: "#4b5563", fontFamily }}>{personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 10 * sizeScale, color: "#4b5563", fontFamily }}>{personalInfo.location}</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px", marginTop: 3 }}>
          {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ fontSize: 10 * sizeScale, color: accent, fontFamily }} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ fontSize: 10 * sizeScale, color: accent, fontFamily }} target="_blank" rel="noopener noreferrer">Portfolio</a>}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sectionOrder.map((key) => renderSection(key))}
    </div>
  );
};

export default ClassicTemplate;
