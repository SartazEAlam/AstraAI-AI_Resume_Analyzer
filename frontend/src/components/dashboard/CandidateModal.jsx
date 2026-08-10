import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Download,
} from "lucide-react";
import { ScoreRing, DualScoreRing } from "../shared/ScoreRing";
import ExecutiveReport from "../report/ExecutiveReport";

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

export default CandidateModal;
