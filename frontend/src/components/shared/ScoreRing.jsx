import React from "react";
import { motion } from "framer-motion";

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
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 max-w-[140px] truncate">
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
  const displayGlobal = isGlobalNA ? 0 : globalScore;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const topOffset = circumference - (displayTop / 100) * circumference;
  const globalOffset = circumference - (Math.min(displayGlobal, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center h-full col-span-1 sm:col-span-1">
      <div className="flex items-center gap-6">
        {/* Primary Role Fit Ring */}
        <div className="flex flex-col items-center">
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
                className="stroke-indigo-500 dark:stroke-indigo-400"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: topOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {isTopNA ? "N/A" : `${Math.round(displayTop)}%`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
              Single Best Fit
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 max-w-[120px] truncate"
              title={topRole || "Best match"}
            >
              🏆 {topRole || "Best match"}
            </span>
          </div>
        </div>

        {/* Global Market Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="22"
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

export { ScoreRing, DualScoreRing, MiniScoreRing };
