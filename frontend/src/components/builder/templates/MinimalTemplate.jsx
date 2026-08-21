import React from "react";

/* ── Minimal Template ──
   Whitespace-heavy, typography-first design.
   Thin horizontal rules between sections.
   Ideal for design, consulting, and finance roles. */

const MinimalTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#111827";
  const fontFamily = customization?.fontFamily || "'Inter', 'Helvetica Neue', sans-serif";
  const fontSize = customization?.fontSize || "default";
  const sizeScale = fontSize === "small" ? 0.88 : fontSize === "large" ? 1.25 : 1.05;

  const linkColor = accent === "#111827" ? "#4f46e5" : accent;

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
    "summary", "experience", "education", "skills", "projects", "certifications", "languages",
  ];

  const normalizedSkills = Array.isArray(skills)
    ? skills.filter((s) => typeof s === "string" && s.trim())
    : typeof skills === "string"
      ? skills.split(/[,;\n•·|]+/).map((s) => s.trim()).filter(Boolean)
      : [];

  /* Thin rule separator */
  const Rule = () => (
    <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: `${18 * sizeScale}px 0` }} />
  );

  /* Section title */
  const SectionTitle = ({ children }) => (
    <h2
      style={{
        fontSize: 10.5 * sizeScale,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "#6b7280",
        margin: "0 0 12px 0",
        fontFamily,
      }}
    >
      {children}
    </h2>
  );

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <div key="summary">
            <Rule />
            <SectionTitle>About</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.75, color: "#4b5563", margin: 0, fontFamily }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience">
            <Rule />
            <SectionTitle>Experience</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12.5 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
                    <span style={{ fontSize: 9.5 * sizeScale, color: "#9ca3af", fontFamily, fontWeight: 500 }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" — ")}</span>
                  </div>
                  {exp.company && (
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#6b7280", margin: "3px 0 0", fontFamily, fontWeight: 500, fontStyle: "italic" }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ""}
                    </p>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "8px 0 0", paddingLeft: 0, listStyleType: "none" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.65, color: "#4b5563", marginBottom: 3, fontFamily, paddingLeft: 14, position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, color: "#d1d5db", fontWeight: 700 }}>–</span>
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
          <div key="education">
            <Rule />
            <SectionTitle>Education</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{edu.degree || "Degree"}</h3>
                    <p style={{ fontSize: 10.5 * sizeScale, color: "#6b7280", margin: "2px 0 0", fontFamily }}>
                      {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: 9.5 * sizeScale, color: "#9ca3af", fontFamily }}>{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return normalizedSkills.length > 0 ? (
          <div key="skills">
            <Rule />
            <SectionTitle>Skills</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, color: "#374151", lineHeight: 1.8, fontFamily, margin: 0 }}>
              {normalizedSkills.join("  ·  ")}
            </p>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects">
            <Rule />
            <SectionTitle>Projects</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{proj.name || "Project"}</h3>
                    {proj.techStack && <span style={{ fontSize: 9 * sizeScale, color: "#9ca3af", fontFamily, fontWeight: 500 }}>{proj.techStack}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: "3px 0 0", lineHeight: 1.65, fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 9.5 * sizeScale, color: linkColor, fontFamily, textDecoration: "none", borderBottom: `1px solid ${linkColor}44` }} target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications">
            <Rule />
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
          <div key="languages">
            <Rule />
            <SectionTitle>Languages</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", fontFamily, margin: 0 }}>
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
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 30 * sizeScale,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.02em",
            fontFamily,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", marginTop: 8 }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).map((item, i, arr) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{item}</span>
              {i < arr.length - 1 && <span style={{ margin: "0 10px", color: "#d1d5db", fontSize: 10 * sizeScale }}>·</span>}
            </React.Fragment>
          ))}
          {personalInfo.linkedin && (
            <>
              <span style={{ margin: "0 10px", color: "#d1d5db", fontSize: 10 * sizeScale }}>·</span>
              <a href={personalInfo.linkedin} style={{ fontSize: 10 * sizeScale, color: linkColor, fontFamily, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span style={{ margin: "0 10px", color: "#d1d5db", fontSize: 10 * sizeScale }}>·</span>
              <a href={personalInfo.portfolio} style={{ fontSize: 10 * sizeScale, color: linkColor, fontFamily, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">Portfolio</a>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sectionOrder.map((key) => renderSection(key))}
    </div>
  );
};

export default MinimalTemplate;
