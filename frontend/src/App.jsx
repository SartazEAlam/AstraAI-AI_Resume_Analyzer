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
  Layers,
  ShieldCheck,
  Compass,
  FileCheck2,
  Sun,
  Moon,
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
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
];

/* ── Components ── */

const Navbar = ({ mode, setMode, theme, toggleTheme }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 solid-panel px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center shadow-sm transition-colors">
          <Layers className="text-white w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Astra<span className="text-indigo-600 dark:text-indigo-400 font-semibold ml-0.5">ATS</span>
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
            Enterprise
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            onClick={() => setMode("individual")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "individual"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Candidate Audit
          </button>
          <button
            onClick={() => setMode("organization")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "organization"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Recruiter Pool
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
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
            className="stroke-slate-200 dark:stroke-slate-800"
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
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {isNA ? "N/A" : `${Math.round(displayScore)}%`}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 mt-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
          </span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm max-w-[200px] truncate bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
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
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-indigo-500 dark:stroke-indigo-400"
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
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {isTopNA ? "N/A" : `${Math.round(displayTop)}%`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
              Single Best
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 max-w-[120px] truncate"
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
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-emerald-500 dark:stroke-emerald-400"
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
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {isGlobalNA ? "N/A" : `${displayGlobal}%`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
              Overall Market
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 max-w-[120px] truncate"
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
          className="stroke-slate-200 dark:stroke-slate-800"
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
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 relative z-10">
        {displayScore}
      </span>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="solid-card p-6 flex flex-col gap-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
    </div>
    <div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

const LoadingOverlay = () => (
  <div className="space-y-8 py-12">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-800" />
        <div className="absolute inset-0 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
        <Layers className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Executing Resume & ATS Audit
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          Extracting competencies, calculating TF-IDF vectors, and verifying timeline records...
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="solid-card p-6 h-40 shimmer border border-slate-200 dark:border-slate-800 rounded-2xl" />
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

const CandidateModal = ({ candidate, onClose, jobTitle, category }) => {
  const [modalTab, setModalTab] = useState("breakdown"); // "breakdown" or "report"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm no-print"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
      >
        <div className="flex flex-wrap items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 gap-4 no-print">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {candidate.fileName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Detailed Candidate Analysis</p>
          </div>

          <div className="flex items-center gap-3">
            {!candidate.error && (
              <>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setModalTab("breakdown")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modalTab === "breakdown"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    Breakdown
                  </button>
                  <button
                    onClick={() => setModalTab("report")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modalTab === "report"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Analysis Failed
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">{candidate.error}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                {candidate.required_skill_count > 0 ? (
                  <ScoreRing
                    score={candidate.match_percentage}
                    label="Target Job Match"
                    badge="🎯 Target Opening"
                    icon={Target}
                    colorClass="stroke-indigo-500 dark:stroke-indigo-400"
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
                  colorClass="stroke-purple-500 dark:stroke-purple-400"
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
                  colorClass="stroke-cyan-500 dark:stroke-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="solid-card p-6 shadow-none bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                    <Zap className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Extracted Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.extracted_skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!candidate.extracted_skills ||
                      candidate.extracted_skills.length === 0) && (
                      <p className="text-slate-500 dark:text-slate-400 italic text-sm">
                        No specific skills detected.
                      </p>
                    )}
                  </div>
                </div>
                <div className="solid-card p-6 shadow-none bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Skill Gaps
                    </h3>
                  </div>
                  {candidate.missing_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 dark:bg-rose-950/50 text-red-600 dark:text-rose-300 border border-red-100 dark:border-rose-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : candidate.required_skill_count > 0 ? (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-emerald-600 dark:text-emerald-300 text-sm font-medium">
                        ✨ Candidate profile matches all target job skills!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                        💡 General market screening active. Select a specific role
                        to analyze required skill gaps.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              {candidate.experience && (
                <div className="solid-card p-6 shadow-none mb-8 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                    <Briefcase className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Previous Experience
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/60">
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70 dark:text-amber-400 mb-1">
                        Total Experience
                      </p>
                      <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                        {candidate.experience.total_years != null
                          ? `${candidate.experience.total_years} year${candidate.experience.total_years !== 1 ? "s" : ""}`
                          : "Not detected"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/60">
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-600/70 dark:text-violet-400 mb-1">
                        Seniority Level
                      </p>
                      <p className="text-2xl font-black text-violet-700 dark:text-violet-300">
                        {candidate.experience.seniority_level}
                      </p>
                    </div>
                  </div>
                  {candidate.experience.positions?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Positions Found
                      </p>
                      {candidate.experience.positions.map((pos, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {pos.title}
                            </p>
                            {pos.company && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {pos.company}
                              </p>
                            )}
                            {pos.duration && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
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
                <div className="solid-card p-6 shadow-none bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-500" />{" "}
                    Recommended Alternative Roles
                  </h3>
                  <div className="flex gap-4 flex-wrap">
                    {candidate.recommended_roles.map((role, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm"
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

const OrganizationDashboard = ({ theme }) => {
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
        <div className="solid-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Bulk Resume Analysis
          </h2>

          {/* 2-Dropdown Cascading Job Selector for Organization */}
          <div className="mb-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Dropdown 1: Industry / Sector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  🏢 1. Industry Sector
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedJobId("");
                  }}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium transition-all shadow-sm cursor-pointer"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  🎯 2. Target Job Opening
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium transition-all shadow-sm cursor-pointer"
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
            className={`upload-zone min-h-[200px] flex flex-col items-center justify-center p-8 cursor-pointer bg-slate-50 dark:bg-[#070b14] border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl hover:border-indigo-500 hover:dark:border-indigo-400 hover:bg-indigo-50/20 hover:dark:bg-indigo-950/30 transition-all ${dragOver ? "drag-over border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/50" : ""}`}
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
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 text-slate-700 dark:text-slate-300">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {files.length > 0
                ? `${files.length} resumes selected`
                : "Drop multiple resumes here"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">or click to browse your files</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 pt-2 uppercase tracking-widest font-mono">
              Supported: PDF, DOCX, DOC, TXT, RTF
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
            className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-md shadow-indigo-500/20"
          >
            {loading ? "Analyzing Batch..." : "Start Bulk Analysis"}
          </button>
        </div>
      )}

      {loading && (
        <div className="solid-card p-12 flex flex-col items-center justify-center mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
            Analyzing {files.length} candidates against the job description...
          </p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="space-y-8 mt-8">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 solid-card p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Batch Analysis Complete
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Successfully analyzed {results.length} candidate
                {results.length !== 1 && "s"}.
              </p>
            </div>
            <button
              onClick={() => {
                setResults([]);
                setFiles([]);
              }}
              className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors px-6 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800"
            >
              Analyze New Batch →
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <div className="solid-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Recommended Career Paths
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
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
                          stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"}
                        />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: theme === "dark" ? "#cbd5e1" : "#475569",
                            fontSize: 11,
                            fontWeight: "bold",
                          }}
                          width={100}
                        />
                        <Tooltip
                          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.05)" : "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: theme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
                            backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                            color: theme === "dark" ? "#f8fafc" : "#0f172a",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
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
              <div className="solid-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full overflow-hidden flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Ranked Candidates
                </h3>
                <div className="overflow-x-auto flex-grow">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Candidate File
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                          {selectedJobId ? "Match %" : "Single Best"}
                        </th>
                        {!selectedJobId && (
                          <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                            Overall Market
                          </th>
                        )}
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                          Strength
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Key Skills
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Top Role
                        </th>
                        <th className="p-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3 whitespace-nowrap">
                            <FileText className="w-5 h-5 text-indigo-500" />
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
                                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200/90 dark:border-emerald-800 shadow-sm">
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
                          <td className="p-4 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
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
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-800 font-bold">
                                    {res.experience.seniority_level}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4 max-w-[200px] truncate text-slate-600 dark:text-slate-300 text-sm">
                            {res.error
                              ? "-"
                              : res.extracted_skills?.slice(0, 3).join(", ") ||
                                "None"}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 text-sm font-semibold max-w-[150px] truncate">
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
                                  : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800"
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

  // Theme Management (light / dark) with LocalStorage persistence
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("astra-theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light"; // Default to clean light mode unless toggled
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    localStorage.setItem("astra-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
    <div className={`min-h-screen transition-colors ${theme === "dark" ? "bg-[#0b0f19] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Navbar mode={mode} setMode={setMode} theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {mode === "individual" ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 tracking-wide mb-4 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ATS Parsing Engine Active · 54 Industry Models
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                  Precision Resume & <span className="text-indigo-600 dark:text-indigo-400">ATS Audit</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
                  Audit keyword density, verify experience timelines, and benchmark role readiness with parser-level accuracy.
                </p>
              </motion.div>
            </div>

            {/* Upload & Dashboard Section */}
            <div className="max-w-4xl mx-auto">
              {!results && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  {/* Upload Card */}
                  <div className="solid-card bg-white dark:bg-slate-900 p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div
                      className={`upload-zone min-h-[260px] flex flex-col items-center justify-center p-8 cursor-pointer bg-slate-50 dark:bg-[#070b14] border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl hover:border-indigo-500 hover:dark:border-indigo-400 hover:bg-indigo-50/30 hover:dark:bg-indigo-950/30 transition-all ${dragOver ? "drag-over border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/50" : ""}`}
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

                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center mb-5 text-indigo-600 dark:text-indigo-400">
                        <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>

                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {fileName ? fileName : "Upload Candidate Document"}
                        </h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {fileName
                            ? "File selected — ready for audit"
                            : "Drag and drop your resume file here, or click to browse"}
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-3">
                          {["PDF", "DOCX", "DOC", "TXT", "RTF"].map((ext) => (
                            <span
                              key={ext}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs"
                            >
                              .{ext}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                        {error}
                      </motion.div>
                    )}

                    {/* 2-Dropdown Cascading Job Selector */}
                    <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dropdown 1: Industry / Sector */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            1. Industry Sector
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setSelectedJobId(""); // Reset specific role on category switch
                            }}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 dark:text-slate-100 text-sm font-semibold transition-all shadow-sm cursor-pointer"
                          >
                            <option value="">
                              All Sectors (Cross-Industry Evaluation)
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
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            2. Target Job Role (Optional)
                          </label>
                          <select
                            value={selectedJobId}
                            onChange={(e) =>
                              setSelectedJobId(String(e.target.value))
                            }
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 dark:text-slate-100 text-sm font-semibold transition-all shadow-sm cursor-pointer"
                          >
                            <option value="">
                              General Analysis (Universal Profile Readiness)
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
                      className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 group"
                    >
                      <span>Run ATS Evaluation & Audit</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Features Grid */}
                  <div
                    id="how-it-works"
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6"
                  >
                    <FeatureCard
                      icon={Target}
                      title="Keyword Taxonomy"
                      desc="Direct technical and domain skill extraction from verified industry gazetteers."
                    />
                    <FeatureCard
                      icon={TrendingUp}
                      title="Multi-Sector Alignment"
                      desc="TF-IDF cosine similarity benchmarking across 54+ live market roles."
                    />
                    <FeatureCard
                      icon={ShieldCheck}
                      title="Omission Detection"
                      desc="Pinpoint missing required qualifications before submitting to recruiter ATS."
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
                    <div className="flex flex-wrap items-center justify-between gap-4 no-print bg-white/90 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => setViewMode("dashboard")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            viewMode === "dashboard"
                              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Interactive Dashboard
                        </button>
                        <button
                          onClick={() => setViewMode("report")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            viewMode === "report"
                              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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
                          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
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
                          <div className="solid-card bg-white dark:bg-slate-900 p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-2 mb-8">
                              <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                  Audit & Assessment Scorecard
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  Algorithmic evaluation benchmarked against verified industry models
                                </p>
                              </div>
                              <div className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                                PROFILE AUDIT
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-2">
                              {results.required_skill_count > 0 ? (
                                <ScoreRing
                                  score={results.match_percentage}
                                  label="Target Job Match"
                                  badge="🎯 Specific Target Job"
                                  icon={Target}
                                  colorClass="stroke-indigo-500 dark:stroke-indigo-400"
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
                                colorClass="stroke-purple-500 dark:stroke-purple-400"
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
                                colorClass="stroke-cyan-500 dark:stroke-cyan-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills Section */}
                            <div className="solid-card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2.5">
                                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    Extracted Competencies
                                  </h3>
                                </div>
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {results.extracted_skills?.length || 0} Detected
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {results.extracted_skills?.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {(!results.extracted_skills ||
                                  results.extracted_skills.length === 0) && (
                                  <p className="text-slate-400 italic text-xs">
                                    No specific competencies detected from resume text.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Skill Gaps Section */}
                            <div className="solid-card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2.5">
                                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    Missing Role Keywords
                                  </h3>
                                </div>
                                {results.missing_skills?.length > 0 && (
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                    {results.missing_skills.length} Gaps
                                  </span>
                                )}
                              </div>
                              {results.missing_skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {results.missing_skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : results.required_skill_count > 0 ? (
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                                  <p className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                                    ✓ Perfect Keyword Match: Candidate profile contains all core skills required for this role.
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                  <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">
                                    Universal screening mode active. Select a specific target role above to evaluate exact keyword omissions.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Experience Section */}
                          {results.experience && (
                            <div className="solid-card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2.5">
                                  <Briefcase className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    Experience & Seniority Verification
                                  </h3>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                                  TIMELINE AUDIT
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Total Detected Tenure
                                  </p>
                                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    {results.experience.total_years != null
                                      ? `${results.experience.total_years} Year${results.experience.total_years !== 1 ? "s" : ""}`
                                      : "Not specified"}
                                  </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Seniority Classification
                                  </p>
                                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    {results.experience.seniority_level || "Professional"}
                                  </p>
                                </div>
                              </div>
                              {results.experience.positions?.length > 0 && (
                                <div className="space-y-2.5 pt-2">
                                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Extracted Positions ({results.experience.positions.length})
                                  </p>
                                  {results.experience.positions.map((pos, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-700 dark:text-slate-300">
                                        <Briefcase className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                          {pos.title}
                                        </p>
                                        {pos.company && (
                                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                            {pos.company}
                                          </p>
                                        )}
                                        {pos.duration && (
                                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-mono">
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
                                  <p className="text-slate-400 italic text-xs">
                                    No explicit chronological positions detected in the resume text.
                                  </p>
                                )}
                            </div>
                          )}

                          {/* Role Recommendations */}
                          {results.recommended_roles?.length > 0 && (
                            <div className="solid-card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2.5">
                                  <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                  <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                      Market Role Alignment
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      High-confidence career tracks mapped to candidate skill profile
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {results.recommended_roles.map((role, i) => (
                                  <div
                                    key={i}
                                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="text-slate-400 dark:text-slate-500 text-[10px] font-mono font-bold uppercase mb-1">
                                        RANK #{i + 1}
                                      </div>
                                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                                        {role}
                                      </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                                      <span>Matched Profile</span>
                                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
              <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
                Organization Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Upload and rank multiple candidate resumes against a specific
                job role.
              </p>
            </div>
            <OrganizationDashboard theme={theme} />
          </div>
        )}
      </main>

      {/* Redesigned Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 backdrop-blur-md pt-16 pb-12 px-6 mt-24 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Row: Brand & Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1: Brand & Status */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center shadow-sm">
                  <Layers className="text-white w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Astra<span className="text-indigo-600 dark:text-indigo-400 font-semibold ml-0.5">ATS</span>
                  </span>
                  <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 uppercase tracking-wider">
                    v2.4 Enterprise
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium max-w-md leading-relaxed">
                Next-generation neural resume parser and recruitment screening engine. Benchmarking candidates with verified TF-IDF vector models across 54+ industry roles.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Engine Nodes Active · 54 ML Models Loaded</span>
              </div>
            </div>

            {/* Column 2: Audit Engine */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Core Capabilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <li
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  onClick={() => {
                    setMode("individual");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Candidate Audit (Single)
                </li>
                <li
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  onClick={() => {
                    setMode("organization");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Recruiter Batch Pool
                </li>
                <li>54 Industry Sector Gazetteers</li>
                <li>Chronological Timeline Audit</li>
                <li>Executive PDF Export</li>
              </ul>
            </div>

            {/* Column 3: Standards & Compliance */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Standards & Compliance
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ATS Format Compliant</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>TF-IDF Cosine Matcher</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Sub-15ms Scoring Latency</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Regex Gazetteers v2.4</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Theme quick toggle & Links */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Astra AI Resume Analyzer. Built for professionals.</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-white transition-colors font-bold"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-indigo-600 dark:hover:text-white transition-colors font-bold"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
