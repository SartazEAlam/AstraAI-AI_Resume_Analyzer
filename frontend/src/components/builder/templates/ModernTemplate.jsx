import React from "react";

/* ── Modern Template ──
   Two-column sidebar design.
   Left sidebar: contact, skills, languages, certifications.
   Right main: summary, experience, education, projects. */

const ModernTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#4f46e5";
  const fontFamily = customization?.fontFamily || "'Inter', 'Segoe UI', sans-serif";
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

  // Lighten accent for backgrounds
  const accentBg = accent + "12";

  const normalizedSkills = Array.isArray(skills)
    ? skills.filter((s) => typeof s === "string" && s.trim())
    : typeof skills === "string"
      ? skills.split(/[,;\n•·|]+/).map((s) => s.trim()).filter(Boolean)
      : [];

  const SectionTitle = ({ children, light }) => (
    <h2
      style={{
        fontSize: 11 * sizeScale,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: light ? "rgba(255,255,255,0.85)" : accent,
        margin: "0 0 10px 0",
        paddingBottom: 6,
        borderBottom: `1.5px solid ${light ? "rgba(255,255,255,0.2)" : accent + "40"}`,
        fontFamily,
      }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="resume-template resume-template-modern"
      style={{
        width: "210mm",
        minHeight: "297mm",
        display: "flex",
        background: "#ffffff",
        fontFamily,
        fontSize: `${10.5 * sizeScale}px`,
        lineHeight: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Left Sidebar ── */}
      <div
        style={{
          width: "33%",
          background: accent,
          color: "#ffffff",
          padding: "32px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flexShrink: 0,
        }}
      >
        {/* Name & Title */}
        <div style={{ textAlign: "center", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26 * sizeScale,
              fontWeight: 800,
              color: "#ffffff",
              fontFamily,
            }}
          >
            {(personalInfo.fullName || "U")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <h1
            style={{
              fontSize: 18 * sizeScale,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              fontFamily,
              letterSpacing: "0.01em",
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div>
          <SectionTitle light>Contact</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {personalInfo.email && <span style={{ fontSize: 9.5 * sizeScale, color: "rgba(255,255,255,0.9)", wordBreak: "break-all", fontFamily }}>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span style={{ fontSize: 9.5 * sizeScale, color: "rgba(255,255,255,0.9)", fontFamily }}>☎ {personalInfo.phone}</span>}
            {personalInfo.location && <span style={{ fontSize: 9.5 * sizeScale, color: "rgba(255,255,255,0.9)", fontFamily }}>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ fontSize: 9.5 * sizeScale, color: "rgba(255,255,255,0.9)", textDecoration: "underline", fontFamily }} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
            {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ fontSize: 9.5 * sizeScale, color: "rgba(255,255,255,0.9)", textDecoration: "underline", fontFamily }} target="_blank" rel="noopener noreferrer">Portfolio ↗</a>}
          </div>
        </div>

        {/* Skills */}
        {normalizedSkills.length > 0 && (
          <div>
            <SectionTitle light>Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {normalizedSkills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9 * sizeScale,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.15)",
                    color: "#ffffff",
                    fontFamily,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <SectionTitle light>Languages</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10 * sizeScale, color: "#ffffff", fontFamily }}>{l.language}</span>
                  {l.proficiency && <span style={{ fontSize: 9 * sizeScale, color: "rgba(255,255,255,0.7)", fontFamily }}>{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <SectionTitle light>Certifications</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {certifications.map((cert, i) => (
                <div key={i}>
                  <span style={{ fontSize: 10 * sizeScale, fontWeight: 600, color: "#ffffff", fontFamily }}>{cert.name}</span>
                  {(cert.issuer || cert.year) && (
                    <div style={{ fontSize: 9 * sizeScale, color: "rgba(255,255,255,0.7)", fontFamily }}>
                      {[cert.issuer, cert.year].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Main Content ── */}
      <div style={{ flex: 1, padding: "32px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Summary */}
        {summary && (
          <div>
            <SectionTitle>Professional Summary</SectionTitle>
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.65, color: "#374151", margin: 0, fontFamily }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <SectionTitle>Work Experience</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
                    <span style={{ fontSize: 9.5 * sizeScale, color: "#9ca3af", fontFamily, fontWeight: 600 }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>
                  </div>
                  {exp.company && (
                    <p style={{ fontSize: 10.5 * sizeScale, color: accent, fontWeight: 600, margin: "2px 0 0", fontFamily }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: 16, listStyleType: "disc" }}>
                      {exp.bullets.map((b, j) => b.trim() ? (
                        <li key={j} style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.55, color: "#374151", marginBottom: 2, fontFamily }}>{b}</li>
                      ) : null)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <SectionTitle>Education</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {education.map((edu, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{edu.degree || "Degree"}</h3>
                    <span style={{ fontSize: 9.5 * sizeScale, color: "#9ca3af", fontFamily }}>{edu.year}</span>
                  </div>
                  <p style={{ fontSize: 10.5 * sizeScale, color: "#4b5563", margin: "2px 0 0", fontFamily }}>
                    {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <SectionTitle>Projects</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 12 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{proj.name || "Project"}</h3>
                    {proj.techStack && <span style={{ fontSize: 9 * sizeScale, color: accent, fontFamily, fontWeight: 600 }}>({proj.techStack})</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: 10.5 * sizeScale, color: "#374151", margin: "3px 0 0", lineHeight: 1.55, fontFamily }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ fontSize: 9 * sizeScale, color: accent, fontFamily }} target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
