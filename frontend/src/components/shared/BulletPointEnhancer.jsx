import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Wand2, ArrowRight } from "lucide-react";

const BulletPointEnhancer = () => {
  const [bullet, setBullet] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnhance = async () => {
    if (!bullet.trim()) {
      setError("Please paste a bullet point to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await axios.post("http://localhost:5000/api/enhance-bullet", { text: bullet });
      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to reach enhancement service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solid-card bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Wand2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Bullet Point Enhancer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Paste a resume bullet point to check its impact, metrics, and action verbs.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="e.g. Worked on the frontend team to build a dashboard that was used by clients..."
          className="w-full h-24 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-900 dark:text-slate-100 text-sm font-medium transition-all shadow-inner resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-rose-500 font-bold">{error}</div>
          <button
            onClick={handleEnhance}
            disabled={loading || !bullet.trim()}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-md shadow-purple-500/20 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Analyze Impact <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Feedback & Enhancements
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    analysis.score >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : analysis.score >= 50
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                  }`}
                >
                  Score: {analysis.score}/100
                </div>
              </div>

              <div className="space-y-3">
                {analysis.feedback.length > 0 ? (
                  analysis.feedback.map((fb, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${
                        fb.includes("✨") || fb.includes("Perfect") || fb.includes("Strong")
                          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {fb.includes("✨") || fb.includes("Perfect") || fb.includes("Strong") ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {fb}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No specific feedback generated.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulletPointEnhancer;
