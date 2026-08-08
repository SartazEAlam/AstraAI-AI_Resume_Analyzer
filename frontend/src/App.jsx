import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Search,
  LayoutDashboard,
  BrainCircuit,
  ArrowRight,
  Briefcase,
  Calendar,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#4f46e5",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];

/* ── Components ── */

const Navbar = ({ mode, setMode }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 solid-panel px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
          Astra<span className="text-indigo-600">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-full">
        <button
          onClick={() => setMode("individual")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === "individual" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          Individual
        </button>
        <button
          onClick={() => setMode("organization")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === "organization" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          Organization
        </button>
      </div>
    </div>
  </nav>
);

const ScoreRing = ({ score, label, badge, icon: Icon, colorClass }) => {
  const isNA = score === null || score === undefined;

  const displayScore = isNA ? 0 : Math.min(100, Math.max(0, score));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center h-full">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className={colorClass}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">
            {isNA ? "N/A" : `${Math.round(displayScore)}%`}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 mt-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {label}
          </span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm max-w-[200px] truncate bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

const DualScoreRing = ({ topScore, topRole, globalScore }) => {
  const isTopNA = topScore === null || topScore === undefined;
  const isGlobalNA = globalScore === null || globalScore === undefined;

  const displayTop = isTopNA ? 0 : Math.min(100, Math.max(0, topScore));
  const displayGlobal = isGlobalNA
    ? 0
    : Math.min(100, Math.max(0, globalScore));

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const topOffset = circumference - (displayTop / 100) * circumference;
  const globalOffset = circumference - (displayGlobal / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center h-full w-full">
      <div className="flex items-center justify-center gap-3 w-full">
        {/* Ring 1: Top Fit Domain */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-indigo-500"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: topOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-900">
                {isTopNA ? "N/A" : `${Math.round(displayTop)}%`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Single Best
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 max-w-[120px] truncate"
              title={`Top Match: ${topRole || "General"}`}
            >
              🎯 {topRole || "Top Fit"}
            </span>
          </div>
        </div>

        {/* Ring 2: Global Market Fit */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-emerald-500"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: globalOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-900">
                {isGlobalNA ? "N/A" : `${displayGlobal}%`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Overall Market
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 max-w-[120px] truncate"
              title="Evaluated across all 54 jobs in all sectors"
            >
              🌐 All 54 Jobs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniScoreRing = ({ score, colorClass }) => {
  const displayScore = Math.min(100, Math.max(0, score));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90 absolute" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-slate-200"
          strokeWidth="4"
          fill="none"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          className={colorClass}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <span className="text-[11px] font-bold text-slate-700 relative z-10">
        {displayScore}
      </span>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="solid-card p-6 flex flex-col gap-4">
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const LoadingOverlay = () => (
  <div className="space-y-8 py-10">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
        <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Analyzing Your Profile
        </h3>
        <p className="text-slate-400 text-sm">
          Our AI is extracting skills and mapping career paths...
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="solid-card p-8 h-48 shimmer" />
      ))}
    </div>
  </div>
);

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

      {/* AI Strategic Career Recommendations */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Strategic Optimization Roadmap for High-Impact ATS Placement
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>Quantify Key Achievements:</strong> Integrate concrete metric achievements (e.g. <em>"Increased system throughput by 35%"</em> or <em>"Managed $250k portfolio"</em>) under recent experience.
            </span>
          </li>
          {missingSkillsCount > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>
                <strong>Bridge Missing Core Keywords:</strong> Add highlighted target skills ({results.missing_skills?.slice(0, 3).join(", ")}) in project descriptions and technical summaries.
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>ATS Format Standard:</strong> Maintain clean single-column structure and standard section headings (Experience, Education, Skills) to guarantee 100% ATS parser fidelity.
            </span>
          </li>
        </ul>
      </div>

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

const CandidateModal = ({ candidate, onClose, jobTitle, category }) => {
  const [modalTab, setModalTab] = useState("breakdown"); // "breakdown" or "report"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm no-print"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-wrap items-center justify-between mb-8 border-b border-slate-100 pb-6 gap-4 no-print">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {candidate.fileName}
            </h2>
            <p className="text-slate-500 mt-1">Detailed Candidate Analysis</p>
          </div>

          <div className="flex items-center gap-3">
            {!candidate.error && (
              <>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setModalTab("breakdown")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modalTab === "breakdown"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Breakdown
                  </button>
                  <button
                    onClick={() => setModalTab("report")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modalTab === "report"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Executive Report
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Export PDF
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-500"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {candidate.error ? (
          <div className="py-12 flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Analysis Failed
            </h3>
            <p className="text-slate-500 max-w-md">{candidate.error}</p>
          </div>
        ) : modalTab === "report" ? (
          <ExecutiveReport
            results={candidate}
            fileName={candidate.fileName}
            jobTitle={jobTitle}
            category={category}
          />
        ) : (
          <>
            <div className="screen-only">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                {candidate.required_skill_count > 0 ? (
                  <ScoreRing
                    score={candidate.match_percentage}
                    label="Target Job Match"
                    badge="🎯 Target Opening"
                    icon={Target}
                    colorClass="stroke-indigo-500"
                  />
                ) : (
                  <DualScoreRing
                    topScore={
                      candidate.top_role_match || candidate.match_percentage
                    }
                    topRole={candidate.best_role}
                    globalScore={candidate.global_market_match}
                  />
                )}

                <ScoreRing
                  score={candidate.strength_score}
                  label="Resume Strength"
                  icon={Zap}
                  colorClass="stroke-purple-500"
                />
                <ScoreRing
                  score={
                    candidate.required_skill_count > 0
                      ? Math.round(
                          (candidate.matched_skill_count /
                            candidate.required_skill_count) *
                            100,
                        )
                      : Math.round(
                          Math.min(
                            100,
                            ((candidate.extracted_skills?.length || 0) / 15) *
                              100,
                          ),
                        )
                  }
                  label={
                    candidate.required_skill_count > 0
                      ? "Skill Coverage"
                      : "Skill Breadth"
                  }
                  icon={CheckCircle2}
                  colorClass="stroke-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="solid-card p-6 shadow-none">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Extracted Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.extracted_skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!candidate.extracted_skills ||
                      candidate.extracted_skills.length === 0) && (
                      <p className="text-slate-500 italic text-sm">
                        No specific skills detected.
                      </p>
                    )}
                  </div>
                </div>
                <div className="solid-card p-6 shadow-none">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Skill Gaps
                    </h3>
                  </div>
                  {candidate.missing_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : candidate.required_skill_count > 0 ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <p className="text-emerald-600 text-sm font-medium">
                        ✨ Candidate profile matches all target job skills!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <p className="text-slate-600 text-sm font-medium">
                        💡 General market screening active. Select a specific role
                        to analyze required skill gaps.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              {candidate.experience && (
                <div className="solid-card p-6 shadow-none mb-8">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                    <Briefcase className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Previous Experience
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70 mb-1">
                        Total Experience
                      </p>
                      <p className="text-2xl font-black text-amber-700">
                        {candidate.experience.total_years != null
                          ? `${candidate.experience.total_years} year${candidate.experience.total_years !== 1 ? "s" : ""}`
                          : "Not detected"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-600/70 mb-1">
                        Seniority Level
                      </p>
                      <p className="text-2xl font-black text-violet-700">
                        {candidate.experience.seniority_level}
                      </p>
                    </div>
                  </div>
                  {candidate.experience.positions?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Positions Found
                      </p>
                      {candidate.experience.positions.map((pos, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {pos.title}
                            </p>
                            {pos.company && (
                              <p className="text-xs text-slate-500">
                                {pos.company}
                              </p>
                            )}
                            {pos.duration && (
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" /> {pos.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(!candidate.experience.positions ||
                    candidate.experience.positions.length === 0) &&
                    candidate.experience.total_years == null && (
                      <p className="text-slate-400 italic text-sm">
                        No specific work experience detected in the resume.
                      </p>
                    )}
                </div>
              )}

              {candidate.recommended_roles?.length > 0 && (
                <div className="solid-card p-6 shadow-none bg-slate-50 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-500" />{" "}
                    Recommended Alternative Roles
                  </h3>
                  <div className="flex gap-4 flex-wrap">
                    {candidate.recommended_roles.map((role, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Print-only clean Executive Report */}
            <div className="print-only">
              <ExecutiveReport
                results={candidate}
                fileName={candidate.fileName}
                jobTitle={jobTitle}
                category={category}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt", ".rtf", ".md"];
const isAllowedFile = (name) => {
  const lower = (name || "").toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const OrganizationDashboard = () => {
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredJobs = selectedCategory
    ? jobs.filter((j) => (j.category || "Other") === selectedCategory)
    : jobs;

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        setJobs(res.data);

        if (res.data.length > 0) {
          setSelectedJobId(String(res.data[0].id));
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResults([]);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
        isAllowedFile(f.name),
      );
      setFiles(droppedFiles);
      setResults([]);
    }
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setResults([]);

    // Process files sequentially to avoid overwhelming the ML service
    const batchResults = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("resume", file);
      if (selectedJobId) {
        formData.append("jobId", selectedJobId);
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000, // 60 second timeout per file
          },
        );
        batchResults.push({ fileName: file.name, ...response.data });
      } catch (err) {
        console.error("Error uploading", file.name, err);
        batchResults.push({
          fileName: file.name,
          error: err.response?.data?.error || "Failed to analyze",
        });
      }
    }

    setResults(
      batchResults.sort(
        (a, b) => (b.match_percentage || 0) - (a.match_percentage || 0),
      ),
    );
    setLoading(false);
  };

  const roleDistribution = React.useMemo(() => {
    if (results.length === 0) return [];
    const counts = {};
    results.forEach((res) => {
      if (res.recommended_roles) {
        res.recommended_roles.forEach((role) => {
          counts[role] = (counts[role] || 0) + 1;
        });
      }
    });
    return Object.keys(counts)
      .map((role) => ({
        name: role,
        count: counts[role],
      }))
      .sort((a, b) => b.count - a.count);
  }, [results]);

  return (
    <div className="space-y-8 relative">
      {results.length === 0 && !loading && (
        <div className="solid-card p-8 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Bulk Resume Analysis
          </h2>

          {/* 2-Dropdown Cascading Job Selector for Organization */}
          <div className="mb-6 p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Dropdown 1: Industry / Sector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  🏢 1. Industry Sector
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedJobId("");
                  }}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium transition-all shadow-sm cursor-pointer"
                >
                  <option value="">🌐 All Sectors</option>
                  {[...new Set(jobs.map((j) => j.category || "Other"))].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Dropdown 2: Target Opening */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  🎯 2. Target Job Opening
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium transition-all shadow-sm cursor-pointer"
                >
                  <option value="">Select Target Job Opening</option>
                  {filteredJobs.map((job) => (
                    <option key={job.id} value={String(job.id)}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div
            className={`upload-zone min-h-[200px] flex flex-col items-center justify-center p-8 cursor-pointer ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt,.rtf,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
            />
            <Upload className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">
              {files.length > 0
                ? `${files.length} resumes selected`
                : "Drop multiple resumes here"}
            </h3>
            <p className="text-slate-400">or click to browse your files</p>
            <p className="text-xs text-slate-500 pt-2 uppercase tracking-widest">
              Supported: PDF, Word (DOCX, DOC), TXT, RTF
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
            className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold text-lg transition-all"
          >
            {loading ? "Analyzing Batch..." : "Start Bulk Analysis"}
          </button>
        </div>
      )}

      {loading && (
        <div className="solid-card p-12 flex flex-col items-center justify-center mt-8">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold text-slate-700">
            Analyzing {files.length} candidates against the job description...
          </p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="space-y-8 mt-8">
          <div className="flex items-center justify-between bg-white solid-card p-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Batch Analysis Complete
              </h2>
              <p className="text-slate-500">
                Successfully analyzed {results.length} candidate
                {results.length !== 1 && "s"}.
              </p>
            </div>
            <button
              onClick={() => {
                setResults([]);
                setFiles([]);
              }}
              className="text-sm font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100"
            >
              Analyze New Batch →
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <div className="solid-card p-8 bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Recommended Career Paths
                </h3>
                <p className="text-sm text-slate-500 mb-8">
                  Role Distribution Based on Candidate Profiles of{" "}
                  {results.length} candidates.
                </p>

                {roleDistribution.length > 0 ? (
                  <div
                    style={{
                      height: `${Math.max(150, roleDistribution.length * 80)}px`,
                    }}
                    className="w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={roleDistribution}
                        layout="vertical"
                        margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={true}
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#475569",
                            fontSize: 11,
                            fontWeight: "bold",
                          }}
                          width={100}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                          {roleDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-slate-400 italic">
                    No roles recommended
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="solid-card p-8 bg-white h-full overflow-hidden flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Ranked Candidates
                </h3>
                <div className="overflow-x-auto flex-grow">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Candidate File
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                          {selectedJobId ? "Match %" : "Single Best"}
                        </th>
                        {!selectedJobId && (
                          <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                            Overall Market
                          </th>
                        )}
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                          Strength
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Key Skills
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Top Role
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 font-semibold text-slate-900 flex items-center gap-3 whitespace-nowrap">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            <span
                              className="truncate max-w-[200px]"
                              title={res.fileName}
                            >
                              {res.fileName}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              {res.error ? (
                                "-"
                              ) : (
                                <MiniScoreRing
                                  score={res.top_role_match || res.match_percentage}
                                  colorClass="stroke-indigo-500"
                                />
                              )}
                            </div>
                          </td>
                          {!selectedJobId && (
                            <td className="p-4 text-center">
                              {res.error ? (
                                "-"
                              ) : (
                                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/90 shadow-sm">
                                  {res.global_market_match != null ? `${res.global_market_match}%` : "0%"}
                                </span>
                              )}
                            </td>
                          )}
                          <td className="p-4">
                            <div className="flex justify-center">
                              {res.error ? (
                                "-"
                              ) : (
                                <MiniScoreRing
                                  score={res.strength_score}
                                  colorClass="stroke-purple-500"
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm whitespace-nowrap">
                            {res.error ? (
                              "-"
                            ) : (
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-amber-400" />
                                <span className="font-semibold">
                                  {res.experience?.total_years != null
                                    ? `${res.experience.total_years} yr${res.experience.total_years !== 1 ? "s" : ""}`
                                    : "—"}
                                </span>
                                {res.experience?.seniority_level && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-bold">
                                    {res.experience.seniority_level}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4 max-w-[200px] truncate text-slate-600 text-sm">
                            {res.error
                              ? "-"
                              : res.extracted_skills?.slice(0, 3).join(", ") ||
                                "None"}
                          </td>
                          <td className="p-4 text-slate-600 text-sm font-semibold max-w-[150px] truncate">
                            {res.error
                              ? "-"
                              : res.recommended_roles?.[0] ||
                                "No matching role"}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedCandidate(res)}
                              className={`text-sm font-bold transition-colors px-4 py-2 rounded-full ${
                                res.error
                                  ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                                  : "text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
                              }`}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            jobTitle={jobs.find((j) => String(j.id) === String(selectedJobId))?.title}
            category={selectedCategory || jobs.find((j) => String(j.id) === String(selectedJobId))?.category}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Application ── */

function App() {
  const [mode, setMode] = useState("individual");
  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" or "report"
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredJobs = selectedCategory
    ? jobs.filter((j) => (j.category || "Other") === selectedCategory)
    : jobs;

  const currentJobObj = jobs.find((j) => String(j.id) === String(selectedJobId));
  const currentJobTitle = currentJobObj ? currentJobObj.title : "";
  const currentCategory = selectedCategory || (currentJobObj ? currentJobObj.category : "");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch(console.error);
  }, []);

  // Single upload state
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setError("");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && isAllowedFile(dropped.name)) {
      setFile(dropped);
      setFileName(dropped.name);
      setError("");
    } else {
      setError("Please upload a supported resume format (PDF, Word DOCX/DOC, TXT, RTF).");
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file to analyze.");
      return;
    }

    setLoading(true);
    setResults(null);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    if (selectedJobId) {
      formData.append("jobId", selectedJobId);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        "Service connection failed. Ensure backend and ML services are running.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar mode={mode} setMode={setMode} />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-float"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px] animate-float"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {mode === "individual" ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">
                  <Sparkles className="w-3 h-3" /> Powered by Advanced AI
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                  Optimize Your{" "}
                  <span className="text-gradient">Career Path</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Upload your resume and let Astra analyze your skills, identify
                  gaps, and recommend the best roles tailored to your unique
                  profile.
                </p>
              </motion.div>
            </div>

            {/* Upload & Dashboard Section */}
            <div className="max-w-4xl mx-auto">
              {!results && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  {/* Upload Card */}
                  <div className="solid-card p-1 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-slate-800">
                    <div className="solid-card bg-white p-8 md:p-12">
                      <div
                        className={`upload-zone min-h-[300px] flex flex-col items-center justify-center p-10 cursor-pointer ${dragOver ? "drag-over" : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.doc,.txt,.rtf,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
                        />

                        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                          <Upload className="w-10 h-10 text-indigo-400" />
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {fileName ? fileName : "Drop your resume here"}
                          </h3>
                          <p className="text-slate-400">
                            {fileName
                              ? "Ready for analysis"
                              : "or click to browse your files"}
                          </p>
                          <p className="text-xs text-slate-500 pt-4 uppercase tracking-widest">
                            Supported formats: PDF, Word (DOCX, DOC), TXT, RTF
                          </p>
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                        >
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}
                      {/* 2-Dropdown Cascading Job Selector */}
                      <div className="mt-8 p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Dropdown 1: Industry / Sector */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              🏢 1. Industry Sector
                            </label>
                            <select
                              value={selectedCategory}
                              onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedJobId(""); // Reset specific role on category switch
                              }}
                              className="w-full p-3.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium transition-all shadow-sm cursor-pointer"
                            >
                              <option value="">
                                🌐 All Sectors (View All Roles)
                              </option>
                              {[
                                ...new Set(
                                  jobs.map((j) => j.category || "Other"),
                                ),
                              ].map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Dropdown 2: Specific Job Role */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              🎯 2. Target Job Role (Optional)
                            </label>
                            <select
                              value={selectedJobId}
                              onChange={(e) =>
                                setSelectedJobId(String(e.target.value))
                              }
                              className="w-full p-3.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium transition-all shadow-sm cursor-pointer"
                            >
                              <option value="">
                                General Analysis (No Target Job)
                              </option>
                              {filteredJobs.map((job) => (
                                <option key={job.id} value={String(job.id)}>
                                  {job.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={!file}
                        className="w-full mt-8 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                      >
                        🚀 Start Analysis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div
                    id="how-it-works"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
                  >
                    <FeatureCard
                      icon={Target}
                      title="Skill Mapping"
                      desc="Intelligent extraction of technical and soft skills from your resume text."
                    />
                    <FeatureCard
                      icon={TrendingUp}
                      title="Market Fit"
                      desc="Calculate how well you match with industry-standard job requirements."
                    />
                    <FeatureCard
                      icon={Zap}
                      title="Smart Gaps"
                      desc="Identify specific skills you need to acquire for your target career goals."
                    />
                  </div>
                </motion.div>
              )}

              {/* Loading View */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingOverlay />
                </motion.div>
              )}

              {/* Results Dashboard */}
              <AnimatePresence>
                {results && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* View Switcher & Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 no-print bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                        <button
                          onClick={() => setViewMode("dashboard")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            viewMode === "dashboard"
                              ? "bg-white text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Interactive Dashboard
                        </button>
                        <button
                          onClick={() => setViewMode("report")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            viewMode === "report"
                              ? "bg-white text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Executive ATS Report
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Print / Export PDF
                        </button>
                        <button
                          onClick={() => {
                            setResults(null);
                            setFile(null);
                            setFileName("");
                            setViewMode("dashboard");
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Analyze New →
                        </button>
                      </div>
                    </div>

                    {viewMode === "report" ? (
                      <ExecutiveReport
                        results={results}
                        fileName={fileName}
                        jobTitle={currentJobTitle}
                        category={currentCategory}
                      />
                    ) : (
                      <>
                        <div className="screen-only space-y-8">
                          {/* Score Overview */}
                          <div className="solid-card p-8 md:p-12 glow-primary">
                            <div className="flex items-center justify-between mb-10">
                              <div>
                                <h2 className="text-3xl font-black text-slate-900">
                                  Analysis Results
                                </h2>
                                <p className="text-slate-400">
                                  Comprehensive breakdown of your professional profile
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-6">
                              {results.required_skill_count > 0 ? (
                                <ScoreRing
                                  score={results.match_percentage}
                                  label="Target Job Match"
                                  badge="🎯 Specific Target Job"
                                  icon={Target}
                                  colorClass="stroke-indigo-500"
                                />
                              ) : (
                                <DualScoreRing
                                  topScore={
                                    results.top_role_match || results.match_percentage
                                  }
                                  topRole={results.best_role}
                                  globalScore={results.global_market_match}
                                />
                              )}

                              <ScoreRing
                                score={results.strength_score}
                                label="Resume Strength"
                                icon={Zap}
                                colorClass="stroke-purple-500"
                              />
                              <ScoreRing
                                score={
                                  results.required_skill_count > 0
                                    ? Math.round(
                                        (results.matched_skill_count /
                                          results.required_skill_count) *
                                          100,
                                      )
                                    : Math.round(
                                        Math.min(
                                          100,
                                          ((results.extracted_skills?.length || 0) /
                                            15) *
                                            100,
                                        ),
                                      )
                                }
                                label={
                                  results.required_skill_count > 0
                                    ? "Target Skill Match"
                                    : "Skill Breadth"
                                }
                                icon={CheckCircle2}
                                colorClass="stroke-cyan-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Skills Section */}
                            <div className="solid-card p-8 space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                <Zap className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xl font-bold text-slate-900">
                                  Extracted Skills
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {results.extracted_skills?.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {(!results.extracted_skills ||
                                  results.extracted_skills.length === 0) && (
                                  <p className="text-slate-500 italic text-sm">
                                    No specific skills detected.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Skill Gaps Section */}
                            <div className="solid-card p-8 space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <h3 className="text-xl font-bold text-slate-900">
                                  Skill Gaps
                                </h3>
                              </div>
                              {results.missing_skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {results.missing_skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : results.required_skill_count > 0 ? (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                  <p className="text-emerald-600 text-sm font-medium">
                                    ✨ Your profile matches all target skills
                                    perfectly!
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                                  <p className="text-indigo-700 text-sm font-medium">
                                    💡 General analysis mode active. Select a specific
                                    role above to see targeted skill gaps, or explore
                                    your recommended career roles below!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Experience Section */}
                          {results.experience && (
                            <div className="solid-card p-8 space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                <Briefcase className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xl font-bold text-slate-900">
                                  Previous Experience
                                </h3>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70 mb-1">
                                    Total Experience
                                  </p>
                                  <p className="text-2xl font-black text-amber-700">
                                    {results.experience.total_years != null
                                      ? `${results.experience.total_years} year${results.experience.total_years !== 1 ? "s" : ""}`
                                      : "Not detected"}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                                  <p className="text-xs font-bold uppercase tracking-widest text-violet-600/70 mb-1">
                                    Seniority Level
                                  </p>
                                  <p className="text-2xl font-black text-violet-700">
                                    {results.experience.seniority_level}
                                  </p>
                                </div>
                              </div>
                              {results.experience.positions?.length > 0 && (
                                <div className="space-y-3">
                                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                    Positions Found
                                  </p>
                                  {results.experience.positions.map((pos, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Briefcase className="w-4 h-4 text-indigo-500" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-slate-900">
                                          {pos.title}
                                        </p>
                                        {pos.company && (
                                          <p className="text-xs text-slate-500">
                                            {pos.company}
                                          </p>
                                        )}
                                        {pos.duration && (
                                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />{" "}
                                            {pos.duration}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {(!results.experience.positions ||
                                results.experience.positions.length === 0) &&
                                results.experience.total_years == null && (
                                  <p className="text-slate-400 italic text-sm">
                                    No specific work experience detected in the
                                    resume.
                                  </p>
                                )}
                            </div>
                          )}

                          {/* Role Recommendations */}
                          {results.recommended_roles?.length > 0 && (
                            <div className="solid-card p-8 md:p-10">
                              <div className="flex items-center gap-3 border-b border-slate-200 pb-6 mb-6">
                                <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                                <div>
                                  <h3 className="text-2xl font-bold text-slate-900">
                                    Recommended Career Paths
                                  </h3>
                                  <p className="text-sm text-slate-400">
                                    Based on your current skill set and potential
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {results.recommended_roles.map((role, i) => (
                                  <div
                                    key={i}
                                    className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 transition-all hover:translate-y-[-4px]"
                                  >
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">
                                      Recommendation {i + 1}
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                      {role}
                                    </div>
                                    <div className="mt-4 flex items-center text-xs text-indigo-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                      View Roadmap{" "}
                                      <ArrowRight className="w-3 h-3 ml-2" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pristine Executive Report generated for Print / PDF */}
                        <div className="print-only">
                          <ExecutiveReport
                            results={results}
                            fileName={fileName}
                            jobTitle={currentJobTitle}
                            category={currentCategory}
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">
                Organization Dashboard
              </h1>
              <p className="text-slate-500 text-lg">
                Upload and rank multiple candidate resumes against a specific
                job role.
              </p>
            </div>
            <OrganizationDashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <BrainCircuit className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Astra AI
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2026 Astra AI Resume Analyzer. Built for professionals, by
            professionals.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-500 hover:text-slate-900 transition-colors text-xs"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-slate-900 transition-colors text-xs"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
