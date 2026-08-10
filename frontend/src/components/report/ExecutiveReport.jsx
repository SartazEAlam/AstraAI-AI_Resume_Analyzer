import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  LayoutDashboard,
  BrainCircuit,
  Briefcase,
  Calendar,
} from "lucide-react";

/* ── Formal Executive Resume Assessment & ATS Audit Report ── */
const ExecutiveReport = ({ results, fileName, jobTitle, category }) => {
  if (!results) return null;

  const isTargetJob = results.required_skill_count > 0;
  const targetScore = Math.round(results.match_percentage || 0);
  const topRoleScore = Math.round(results.top_role_match || results.match_percentage || 0);
  const globalScore = results.global_market_match != null ? results.global_market_match : 0;
  const strengthScore = Math.round(results.strength_score || 0);
  const bestRole = results.best_role || "General Professional";
  const totalSkills = results.extracted_skills?.length || 0;
  const missingSkillsCount = results.missing_skills?.length || 0;

  const getVerdict = (score) => {
    if (score >= 80) return { label: "EXCEPTIONAL MATCH", badge: "bg-emerald-600 text-white", grade: "A+" };
    if (score >= 65) return { label: "STRONG CANDIDATE", badge: "bg-indigo-600 text-white", grade: "A" };
    if (score >= 50) return { label: "MODERATE FIT", badge: "bg-amber-600 text-white", grade: "B" };
    return { label: "GROWTH OPPORTUNITY", badge: "bg-rose-600 text-white", grade: "C" };
  };

  const primaryScore = isTargetJob ? targetScore : topRoleScore;
  const verdict = getVerdict(primaryScore);

  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const docId = Math.abs(
    (fileName || "RESUME").split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  ).toString(16).toUpperCase().padStart(6, "0");

  return (
    <div className="report-root bg-white text-slate-900 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl space-y-8 font-sans">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Astra Career Intelligence
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 rounded">
                Official Report
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Executive Resume Evaluation & ATS Readiness Audit
            </p>
          </div>
        </div>

        <div className="text-left md:text-right space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Evaluation Date
          </div>
          <div className="text-sm font-black text-slate-800">{reportDate}</div>
          <div className="text-[11px] font-mono text-slate-400">
            REF: AST-{docId}
          </div>
        </div>
      </div>

      {/* Candidate Profile Summary Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Candidate Document
          </div>
          <div className="text-base font-black text-slate-900 truncate" title={fileName}>
            {fileName || "Candidate Resume"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {results.experience?.seniority_level || "Professional"} Level
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Evaluation Target
          </div>
          <div className="text-base font-black text-indigo-600 truncate">
            {isTargetJob ? (jobTitle || "Specific Target Role") : "Multi-Sector Screening"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {category || "Global Industry Benchmark (54 Roles)"}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Experience
          </div>
          <div className="text-base font-black text-slate-900">
            {results.experience?.total_years != null
              ? `${results.experience.total_years} Year${results.experience.total_years !== 1 ? "s" : ""}`
              : "Not Specified"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Verified Timeline</div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            ATS Readiness Grade
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-sm font-black ${verdict.badge}`}>
              Grade {verdict.grade}
            </span>
            <span className="text-xs font-bold text-slate-700">{verdict.label}</span>
          </div>
        </div>
      </div>

      {/* 4-Card Executive Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Primary Fit */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              {isTargetJob ? "Target Match" : "Single Best Fit"}
            </span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-900 my-1">
            {primaryScore}%
          </div>
          <p className="text-xs text-indigo-700/80 font-medium">
            {isTargetJob ? `Role alignment for ${jobTitle}` : `Top match for ${bestRole}`}
          </p>
        </div>

        {/* Card 2: Market / Skill Breadth */}
        <div className="p-5 rounded-2xl bg-cyan-50/60 border-2 border-cyan-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
              {isTargetJob ? "Skill Match Ratio" : "Overall Market Fit"}
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-black text-cyan-950 my-1">
            {isTargetJob
              ? `${Math.round(((results.matched_skill_count || 0) / (results.required_skill_count || 1)) * 100)}%`
              : `${globalScore}%`}
          </div>
          <p className="text-xs text-cyan-800/80 font-medium">
            {isTargetJob
              ? `${results.matched_skill_count} of ${results.required_skill_count} skills matched`
              : "Normalized across all 54 global database roles"}
          </p>
        </div>

        {/* Card 3: Resume Strength */}
        <div className="p-5 rounded-2xl bg-purple-50/60 border-2 border-purple-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Resume Strength
            </span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-950 my-1">
            {strengthScore}/100
          </div>
          <p className="text-xs text-purple-700/80 font-medium">
            Structure, impact phrasing & keyword density
          </p>
        </div>

        {/* Card 4: Skills Identified */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Extracted Skills
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950 my-1">
            {totalSkills} Skills
          </div>
          <p className="text-xs text-emerald-800/80 font-medium">
            Recognized industry competencies
          </p>
        </div>
      </div>

      {/* Competency & Skill Gap Analysis Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Skills */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Core Competencies ({totalSkills})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.extracted_skills?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
              >
                ✓ {skill}
              </span>
            ))}
            {(!results.extracted_skills || results.extracted_skills.length === 0) && (
              <p className="text-xs text-slate-400 italic">No specific skills detected.</p>
            )}
          </div>
        </div>

        {/* Skill Gaps / Missing Competencies */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Critical Skill Gaps & Development ({missingSkillsCount})
            </h3>
          </div>
          {results.missing_skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {results.missing_skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                >
                  + {skill}
                </span>
              ))}
            </div>
          ) : isTargetJob ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              ✨ 100% Match! All core required competencies for this target position were found in the resume.
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium leading-relaxed">
              💡 General multi-sector screening completed. Recommended career paths and required next-level skills are listed below.
            </div>
          )}
        </div>
      </div>

      {/* Experience & Work History Breakdown */}
      {results.experience && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              Experience & Professional Timeline
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {results.experience.seniority_level} Level • {results.experience.total_years || 0} Years Experience
            </span>
          </div>

          {results.experience.positions?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.experience.positions.map((pos, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-indigo-600 font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{pos.title}</p>
                    {pos.company && (
                      <p className="text-xs text-slate-600">{pos.company}</p>
                    )}
                    {pos.duration && (
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {pos.duration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No structured positions parsed from resume text.</p>
          )}
        </div>
      )}

      {/* Recommended Career Tracks */}
      {results.recommended_roles?.length > 0 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              Recommended Career Roles & Target Tracks
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {results.recommended_roles.map((role, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100"
              >
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">
                  Track #{i + 1}
                </span>
                <span className="text-sm font-black text-slate-900">{role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Strategic Career Recommendations (Dynamic: only shown when gaps/missing skills are detected) */}
      {(missingSkillsCount > 0 || (results.score && results.score < 80)) && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Strategic Optimization Roadmap ({missingSkillsCount} Actionable Gaps Identified)
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {missingSkillsCount > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                <span>
                  <strong>Bridge Missing Core Keywords:</strong> Add highlighted target skills ({results.missing_skills?.slice(0, 4).join(", ")}) in project descriptions and technical summaries.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span>
                <strong>Quantify Key Achievements:</strong> Integrate concrete metric achievements (e.g. <em>"Increased system throughput by 35%"</em> or <em>"Managed $250k portfolio"</em>) under recent experience.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span>
                <strong>ATS Format Standard:</strong> Maintain clean single-column structure and standard section headings (Experience, Education, Skills) to guarantee 100% ATS parser fidelity.
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Report Footer & Certification */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>
          Generated by <strong>Astra AI Resume Intelligence Engine</strong> • Confidential Assessment
        </div>
        <div>
          Verification ID: AST-VERIFIED-2026 • Page 1 of 1
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReport;
