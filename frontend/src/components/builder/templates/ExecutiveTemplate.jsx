import React from "react";

/* ── Executive Template ──
   A distinguished, highly structured layout for senior professionals.
   Features elegant serif typography, bordered headers, and a compact timeline. */

const ExecutiveTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#1e3a8a"; // Default deep blue
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
    <div style={{ marginTop: 20, marginBottom: 12 }}>
      <h2
        style={{
          fontSize: 12.5 * sizeScale,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#111827",
          margin: 0,
          paddingBottom: 6,
          borderBottom: `1px solid ${accent}`,
          fontFamily,
        }}
      >
        {title}
      </h2>
    </div>
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
          <div key="summary">
            <SectionDivider title="Executive Summary" />
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.7, color: "#1f2937", margin: 0, fontFamily }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience">
            <SectionDivider title="Professional Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: 2 }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.company}</h3>
                    <span style={{ fontSize: 10 * sizeScale, fontWeight: 600, color: accent, fontFamily }}>
                      {exp.location || ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: 4 }}>
                    <p style={{ fontSize: 11 * sizeScale, color: "#374151", fontStyle: "italic", margin: 0, fontFamily }}>{exp.title}</p>
                    <span style={{ fontSize: 10 * sizeScale, color: "#4b5563", fontFamily }}>
                      {[exp.startDate, exp.endDate].filter(Boolean).join(" – ") || ""}
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: 16, listStyleType: "square" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.6, color: "#374151", marginBottom: 3, fontFamily }}>{b}</li>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: 11 * sizeScale, fontWeight: 700, color: "#111827", margin: "0 0 2px 0", fontFamily }}>{edu.institution}</h3>
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: 0, fontFamily }}>
                      {edu.degree} {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{edu.year || ""}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return normalizedSkills.length > 0 ? (
          <div key="skills">
            <SectionDivider title="Core Competencies" />
            <div style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.8, color: "#1f2937", fontFamily }}>
              {normalizedSkills.map((skill, index) => (
                <React.Fragment key={index}>
                  <span style={{ fontWeight: 600 }}>{skill}</span>
                  {index < normalizedSkills.length - 1 && <span style={{ margin: "0 8px", color: accent }}>|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects">
            <SectionDivider title="Key Initiatives & Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 11 * sizeScale, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", fontFamily }}>
                      {proj.name} {proj.techStack ? <span style={{ fontWeight: 400, color: "#4b5563", fontStyle: "italic" }}>({proj.techStack})</span> : ""}
                    </h3>
                  </div>
                  {proj.description && <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.6, color: "#374151", margin: "0 0 4px 0", fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 10 * sizeScale, color: accent, textDecoration: "none", fontFamily }}>{proj.link}</a>}
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
                <div key={i} style={{ fontSize: 10.5 * sizeScale, color: "#374151", fontFamily }}>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  {cert.issuer && ` — ${cert.issuer}`}
                  {cert.year && ` (${cert.year})`}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <div key="languages">
            <SectionDivider title="Languages" />
            <div style={{ fontSize: 10.5 * sizeScale, color: "#374151", fontFamily }}>
              {languages.map((l, i) => (
                <React.Fragment key={i}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: "#6b7280" }}> ({l.proficiency})</span>}
                  {i < languages.length - 1 && <span style={{ margin: "0 8px", color: "#d1d5db" }}>•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className="resume-template"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "24mm 20mm",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28 * sizeScale,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#111827",
            margin: "0 0 12px 0",
            fontFamily,
          }}
        >
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            fontSize: 10.5 * sizeScale,
            color: "#4b5563",
            fontFamily,
          }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span style={{ color: accent }}>|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span style={{ color: accent }}>|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
        </div>
        {(personalInfo.linkedin || personalInfo.portfolio) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
              fontSize: 10 * sizeScale,
              color: accent,
              marginTop: "8px",
              fontFamily,
            }}
          >
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.portfolio && (
              <>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>{personalInfo.portfolio}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sections */}
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default ExecutiveTemplate;
