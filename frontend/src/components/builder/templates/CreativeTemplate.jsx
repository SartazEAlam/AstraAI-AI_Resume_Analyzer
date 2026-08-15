import React from "react";

/* ── Creative Template ──
   Bold header with accent-colored background.
   Skills shown as tags with accent, timeline-style experience.
   More visual personality than Classic or Minimal. */

const CreativeTemplate = ({ data, customization }) => {
  const accent = customization?.accentColor || "#7c3aed";
  const fontFamily = customization?.fontFamily || "'Outfit', 'Inter', sans-serif";
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

  // Derive lighter accent for backgrounds
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  const rgb = hexToRgb(accent);
  const accentLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
  const accentMedium = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;

  const normalizedSkills = Array.isArray(skills)
    ? skills.filter((s) => typeof s === "string" && s.trim())
    : typeof skills === "string"
      ? skills.split(/[,;\n•·|]+/).map((s) => s.trim()).filter(Boolean)
      : [];

  const SectionTitle = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, background: accent }} />
      <h2
        style={{
          fontSize: 12 * sizeScale,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#111827",
          margin: 0,
          fontFamily,
        }}
      >
        {children}
      </h2>
    </div>
  );

  return (
    <div
      className="resume-template resume-template-creative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "#ffffff",
        fontFamily,
        fontSize: `${10.5 * sizeScale}px`,
        lineHeight: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Bold Header Banner ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
          color: "#ffffff",
          padding: "36px 40px 32px",
          position: "relative",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 60,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        <h1
          style={{
            fontSize: 28 * sizeScale,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: "-0.01em",
            fontFamily,
            position: "relative",
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 18px",
            marginTop: 10,
            position: "relative",
          }}
        >
          {personalInfo.email && <span style={{ fontSize: 10 * sizeScale, color: "rgba(255,255,255,0.9)", fontFamily }}>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span style={{ fontSize: 10 * sizeScale, color: "rgba(255,255,255,0.9)", fontFamily }}>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 10 * sizeScale, color: "rgba(255,255,255,0.9)", fontFamily }}>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ fontSize: 10 * sizeScale, color: "rgba(255,255,255,0.9)", textDecoration: "underline", fontFamily }} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ fontSize: 10 * sizeScale, color: "rgba(255,255,255,0.9)", textDecoration: "underline", fontFamily }} target="_blank" rel="noopener noreferrer">Portfolio ↗</a>}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "28px 40px 36px" }}>
        {/* Summary */}
        {summary && (
          <div style={{ marginBottom: 26, padding: "14px 18px", background: accentLight, borderRadius: 10, borderLeft: `4px solid ${accent}` }}>
            <p style={{ fontSize: 10.5 * sizeScale, lineHeight: 1.7, color: "#374151", margin: 0, fontFamily }}>{summary}</p>
          </div>
        )}

        {/* Skills as colored tags */}
        {normalizedSkills.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <SectionTitle>Skills & Technologies</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {normalizedSkills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9.5 * sizeScale,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: accentMedium,
                    color: accent,
                    fontFamily,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience — Timeline Style */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <SectionTitle>Experience</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    position: "relative",
                    paddingBottom: i < experience.length - 1 ? 18 : 0,
                  }}
                >
                  {/* Timeline line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent, marginTop: 4, flexShrink: 0 }} />
                    {i < experience.length - 1 && <div style={{ width: 2, flex: 1, background: accentMedium, marginTop: 4 }} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 12.5 * sizeScale, fontWeight: 700, color: "#111827", margin: 0, fontFamily }}>{exp.title || "Position"}</h3>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <SectionTitle>Education</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ padding: "10px 14px", background: accentLight, borderRadius: 8 }}>
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
          <div style={{ marginBottom: 26 }}>
            <SectionTitle>Projects</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
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

        {/* Bottom row: Certifications + Languages */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <SectionTitle>Certifications</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {certifications.map((cert, i) => (
                  <span key={i} style={{ fontSize: 10 * sizeScale, color: "#374151", fontFamily }}>
                    ✦ {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1, minWidth: 150 }}>
              <SectionTitle>Languages</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {languages.map((l, i) => (
                  <span key={i} style={{ fontSize: 10 * sizeScale, color: "#374151", fontFamily }}>
                    {l.language}{l.proficiency ? ` — ${l.proficiency}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
