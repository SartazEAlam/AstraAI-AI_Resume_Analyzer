import React, { useRef } from "react";
import { Download, Target, Printer } from "lucide-react";

/* ── Resume Preview Panel ──
   Shows the selected template at a scaled-down size.
   Provides Print/PDF and ATS Analyze buttons. */

const ResumePreview = ({ data, customization, TemplateComponent, onAnalyze }) => {
  const previewRef = useRef(null);

  const handlePrint = () => {
    // Create a new window with only the resume template for clean printing
    const printWindow = window.open("", "_blank", "width=800,height=1100");
    if (!printWindow) return;

    const templateHtml = previewRef.current?.querySelector(".resume-template")?.outerHTML || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data?.personalInfo?.fullName || "Resume"} - Resume</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Georgia&family=Outfit:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; }
          @media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; }
            .resume-template { width: 210mm !important; min-height: 297mm !important; }
          }
        </style>
      </head>
      <body>
        ${templateHtml}
        <script>
          setTimeout(() => { window.print(); window.close(); }, 400);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  /* Generate plain text from resume data for ATS analysis */
  const generatePlainText = () => {
    const lines = [];
    const pi = data?.personalInfo || {};
    if (pi.fullName) lines.push(pi.fullName);
    if (pi.email || pi.phone || pi.location) {
      lines.push([pi.email, pi.phone, pi.location].filter(Boolean).join(" | "));
    }
    if (pi.linkedin) lines.push(pi.linkedin);
    if (pi.portfolio) lines.push(pi.portfolio);

    if (data?.summary) {
      lines.push("", "PROFESSIONAL SUMMARY", data.summary);
    }

    if (data?.experience?.length) {
      lines.push("", "WORK EXPERIENCE");
      data.experience.forEach((exp) => {
        lines.push(`${exp.title || ""}${exp.company ? ` at ${exp.company}` : ""}${exp.location ? `, ${exp.location}` : ""}`);
        if (exp.startDate || exp.endDate) lines.push([exp.startDate, exp.endDate].filter(Boolean).join(" - "));
        (exp.bullets || []).forEach((b) => { if (b.trim()) lines.push(`• ${b}`); });
        lines.push("");
      });
    }

    if (data?.education?.length) {
      lines.push("EDUCATION");
      data.education.forEach((edu) => {
        lines.push(`${edu.degree || ""}${edu.institution ? ` - ${edu.institution}` : ""}${edu.year ? ` (${edu.year})` : ""}${edu.gpa ? ` GPA: ${edu.gpa}` : ""}`);
      });
    }

    if (data?.skills?.length) {
      lines.push("", "SKILLS", data.skills.join(", "));
    }

    if (data?.projects?.length) {
      lines.push("", "PROJECTS");
      data.projects.forEach((proj) => {
        lines.push(`${proj.name || ""}${proj.techStack ? ` (${proj.techStack})` : ""}`);
        if (proj.description) lines.push(proj.description);
        if (proj.link) lines.push(proj.link);
        lines.push("");
      });
    }

    if (data?.certifications?.length) {
      lines.push("CERTIFICATIONS");
      data.certifications.forEach((cert) => {
        lines.push(`${cert.name || ""}${cert.issuer ? ` - ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}`);
      });
    }

    if (data?.languages?.length) {
      lines.push("", "LANGUAGES");
      lines.push(data.languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", "));
    }

    return lines.join("\n");
  };

  const handleAnalyze = () => {
    const text = generatePlainText();
    if (onAnalyze && text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Action Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          <Printer className="w-3.5 h-3.5" />
          Download PDF
        </button>
        <button
          onClick={handleAnalyze}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Target className="w-3.5 h-3.5" />
          Analyze with ATS
        </button>
      </div>

      {/* Scaled Preview */}
      <div
        className="flex-1 overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50"
        style={{ position: "relative" }}
      >
        <div
          ref={previewRef}
          className="origin-top-left"
          style={{
            transform: "scale(0.42)",
            transformOrigin: "top left",
            width: "210mm",
            position: "absolute",
            top: 12,
            left: "50%",
            marginLeft: `calc(-210mm * 0.42 / 2)`,
          }}
        >
          {TemplateComponent && <TemplateComponent data={data} customization={customization} />}
        </div>
        {/* Spacer div so the container scrolls to the right height */}
        <div style={{ height: `calc(297mm * 0.42 + 24px)`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};

export default ResumePreview;
