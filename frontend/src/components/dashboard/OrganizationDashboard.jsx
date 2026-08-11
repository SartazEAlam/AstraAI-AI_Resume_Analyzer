import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Briefcase,
  ChevronDown,
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
import { MiniScoreRing } from "../shared/ScoreRing";
import CandidateModal from "./CandidateModal";

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
];

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

  const roleDistribution = useMemo(() => {
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
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedJobId("");
                    }}
                    className="appearance-none w-full p-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium transition-all shadow-sm cursor-pointer"
                  >
                    <option value="">🌐 All Sectors (Cross-Industry Evaluation)</option>
                    {[...new Set(jobs.map((j) => j.category || "Other"))].map(
                      (category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Dropdown 2: Target Opening */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  🎯 2. Target Job Opening
                </label>
                <div className="relative">
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="appearance-none w-full p-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium transition-all shadow-sm cursor-pointer"
                  >
                    <option value="">General Analysis (Universal Profile Readiness)</option>
                    {filteredJobs.map((job) => (
                      <option key={job.id} value={String(job.id)}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
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

export default OrganizationDashboard;
