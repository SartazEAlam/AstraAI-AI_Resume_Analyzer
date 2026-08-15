import React from "react";

/* ── Tech Template ──
   A sleek, modern template for developers and IT professionals.
   Features a bold left-aligned header, monospace skills tags, and a highly scannable layout. */

const TechTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#10b981"; // Emerald green default
  const fontFamily = customization?.fontFamily || "'Inter', 'Roboto', sans-serif";
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
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "languages",
  ];

  const SectionTitle = ({ title }) => (
    <div style={{ marginTop: 22, marginBottom: 12 }}>
      <h2
        style={{
          fontSize: 14 * sizeScale,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#111827",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily,
        }}
      >
        <span style={{ width: "24px", height: "4px", backgroundColor: accent, borderRadius: "2px" }}></span>
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
            <SectionTitle title="Profile" />
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.6, color: "#374151", margin: 0, fontFamily }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience">
            <SectionTitle title="Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ position: "relative", paddingLeft: 12, borderLeft: `2px solid ${accent}40` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
                    <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily, fontWeight: 500, backgroundColor: "#f3f4f6", padding: "2px 8px", borderRadius: "12px" }}>
                      {[exp.startDate, exp.endDate].filter(Boolean).join(" – ") || ""}
                    </span>
                  </div>
                  {exp.company && (
                    <p style={{ fontSize: 11 * sizeScale, color: accent, fontWeight: 600, margin: "4px 0 0", fontFamily }}>
                      {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                    </p>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "8px 0 0", paddingLeft: 16, listStyleType: "circle" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.5, color: "#4b5563", marginBottom: 4, fontFamily }}>{b}</li>
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
            <SectionTitle title="Education" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {education.map((edu, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ fontSize: 11.5 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{edu.degree}</h3>
                    <span style={{ fontSize: 10 * sizeScale, color: "#6b7280", fontFamily }}>{edu.year || ""}</span>
                  </div>
                  <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: "2px 0 0", fontFamily }}>
                    <span style={{ fontWeight: 600 }}>{edu.institution}</span>
                    {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return normalizedSkills.length > 0 ? (
          <div key="skills">
            <SectionTitle title="Technical Skills" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {normalizedSkills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: `${accent}15`,
                    color: accent,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: 9.5 * sizeScale,
                    fontWeight: 600,
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects">
            <SectionTitle title="Projects" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
              {projects.map((proj, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px" }}>
                  <h3 style={{ fontSize: 11 * sizeScale, fontWeight: 700, color: "#111827", margin: "0 0 6px 0", fontFamily }}>
                    {proj.name}
                  </h3>
                  {proj.techStack && (
                    <p style={{ fontSize: 9.5 * sizeScale, color: accent, margin: "0 0 6px 0", fontFamily, fontWeight: 600 }}>
                      {proj.techStack}
                    </p>
                  )}
                  {proj.description && <p style={{ fontSize: 10 * sizeScale, lineHeight: 1.5, color: "#4b5563", margin: "0 0 8px 0", fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 9.5 * sizeScale, color: "#6b7280", textDecoration: "underline", fontFamily }}>{proj.link}</a>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications">
            <SectionTitle title="Certifications" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {certifications.map((cert, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5 * sizeScale, color: "#374151", fontFamily }}>
                  <span style={{ color: accent }}>★</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  {cert.issuer && `(${cert.issuer})`}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <div key="languages">
            <SectionTitle title="Languages" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: 10.5 * sizeScale, color: "#111827", fontFamily }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: "#6b7280" }}> - {l.proficiency}</span>}
                </div>
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
        padding: "24mm",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28, borderBottom: "2px solid #f3f4f6", paddingBottom: 24 }}>
        <h1
          style={{
            fontSize: 32 * sizeScale,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#111827",
            margin: "0 0 12px 0",
            fontFamily,
            lineHeight: 1.1
          }}
        >
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: 10.5 * sizeScale,
            color: "#4b5563",
            fontFamily,
            fontWeight: 500
          }}
        >
          {personalInfo.email && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: accent}}>@</span>{personalInfo.email}</div>}
          {personalInfo.phone && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: accent}}>#</span>{personalInfo.phone}</div>}
          {personalInfo.location && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: accent}}>📍</span>{personalInfo.location}</div>}
        </div>
        {(personalInfo.linkedin || personalInfo.portfolio) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: 10.5 * sizeScale,
              color: "#111827",
              marginTop: "12px",
              fontFamily,
              fontWeight: 500
            }}
          >
            {personalInfo.linkedin && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: accent}}>in/</span>{personalInfo.linkedin}</div>}
            {personalInfo.portfolio && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{color: accent}}>🔗</span>{personalInfo.portfolio}</div>}
          </div>
        )}
      </div>

      {/* Sections */}
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default TechTemplate;
