import React, { useRef, useState } from "react";
import { Download, Target, Printer, FileText, Check, Loader2 } from "lucide-react";
import { generateResumePDF } from "../../utils/pdfGenerator";

/* ── Resume Preview Panel ──
   Shows the selected template at a scaled-down size.
   Provides Direct Vector PDF Export (100% ATS-Compliant), Print, ATS .TXT, and ATS Analyze. */

const ResumePreview = ({ data, customization, TemplateComponent, onAnalyze }) => {
  const previewRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadedPdf, setDownloadedPdf] = useState(false);
  const [downloadedTxt, setDownloadedTxt] = useState(false);

  /* 1. Export ATS-Compliant PDF using pdf-lib (real text runs, 100% extractable) */
  const handleExportPDF = async () => {
    setDownloadingPdf(true);
    try {
      const pdfBytes = await generateResumePDF(data, customization);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data?.personalInfo?.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadedPdf(true);
      setTimeout(() => setDownloadedPdf(false), 2500);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert(`Failed to generate PDF: ${err.message || err}. Please check console.`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* 3. Generate ATS-optimized plain text from resume data */
  const generatePlainText = () => {
    const lines = [];
    const pi = data?.personalInfo || {};
    if (pi.fullName) lines.push(pi.fullName.toUpperCase());
    
    const contactBits = [pi.email, pi.phone, pi.location].filter(Boolean);
    if (contactBits.length) lines.push(contactBits.join(" | "));
    
    const linkBits = [pi.linkedin, pi.portfolio].filter(Boolean);
    if (linkBits.length) lines.push(linkBits.join(" | "));

    if (data?.summary?.trim()) {
      lines.push("", "PROFESSIONAL SUMMARY", data.summary.trim());
    }

    // Normalized Skills
    const normalizedSkills = Array.isArray(data?.skills)
      ? data.skills.filter((s) => typeof s === "string" && s.trim())
      : typeof data?.skills === "string"
        ? data.skills.split(/[,;\n•·|]+/).map((s) => s.trim()).filter(Boolean)
        : [];

    if (normalizedSkills.length) {
      lines.push("", "TECHNICAL SKILLS", normalizedSkills.join(", "));
    }

    if (data?.experience?.length) {
      lines.push("", "WORK EXPERIENCE");
      data.experience.forEach((exp) => {
        if (!exp.title && !exp.company) return;
        const titleLine = [exp.title, exp.company].filter(Boolean).join(" - ");
        const dateLine = [exp.startDate, exp.endDate].filter(Boolean).join(" to ");
        lines.push(`${titleLine}${dateLine ? ` (${dateLine})` : ""}${exp.location ? ` | ${exp.location}` : ""}`);
        (exp.bullets || []).forEach((b) => {
          if (b && typeof b === "string" && b.trim()) {
            lines.push(`• ${b.trim()}`);
          }
        });
        lines.push("");
      });
    }

    if (data?.education?.length) {
      lines.push("EDUCATION");
      data.education.forEach((edu) => {
        if (!edu.degree && !edu.institution) return;
        lines.push(`${edu.degree || ""}${edu.institution ? ` - ${edu.institution}` : ""}${edu.year ? ` (${edu.year})` : ""}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`);
      });
    }

    if (data?.projects?.length) {
      lines.push("", "PROJECTS");
      data.projects.forEach((proj) => {
        if (!proj.name) return;
        lines.push(`${proj.name}${proj.techStack ? ` (${proj.techStack})` : ""}`);
        if (proj.description) lines.push(proj.description.trim());
        if (proj.link) lines.push(proj.link.trim());
        lines.push("");
      });
    }

    if (data?.certifications?.length) {
      lines.push("CERTIFICATIONS");
      data.certifications.forEach((cert) => {
        if (!cert.name) return;
        lines.push(`${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}`);
      });
    }

    if (data?.languages?.length) {
      lines.push("", "LANGUAGES");
      lines.push(
        data.languages
          .filter((l) => l.language)
          .map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`)
          .join(", ")
      );
    }

    return lines.join("\n").trim();
  };

  const handleDownloadTxt = () => {
    const text = generatePlainText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data?.personalInfo?.fullName || "Resume").replace(/\s+/g, "_")}_ATS.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedTxt(true);
    setTimeout(() => setDownloadedTxt(false), 2000);
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
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Direct Vector PDF Download Button */}
        <button
          onClick={handleExportPDF}
          disabled={downloadingPdf}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          {downloadingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : downloadedPdf ? (
            <Check className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {downloadingPdf ? "Generating..." : downloadedPdf ? "PDF Exported!" : "Export to PDF"}
        </button>

        {/* ATS .TXT Export Button */}
        <button
          onClick={handleDownloadTxt}
          title="Download 100% ATS-Compliant Plain Text Format"
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
        >
          {downloadedTxt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
          {downloadedTxt ? "Saved!" : "ATS .TXT"}
        </button>

        {/* Direct 1-Click ATS Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Target className="w-3.5 h-3.5" />
          Analyze with ATS
        </button>
      </div>

      {/* Scaled Preview */}
      <div
        className="flex-1 overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 builder-form-scrollbar"
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
