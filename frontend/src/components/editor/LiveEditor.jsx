import React, { useState } from "react";
import { Edit3, Play, RotateCcw } from "lucide-react";

const LiveEditor = ({ initialText, onReAnalyze, isLoading }) => {
  const [text, setText] = useState(initialText || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleRunAnalysis = () => {
    setIsEditing(false);
    onReAnalyze(text);
  };

  if (!isEditing) {
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Edit3 className="w-4 h-4" />
          Edit Parsed Resume & Re-Analyze
        </button>
      </div>
    );
  }

  return (
    <div className="solid-card bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-500" />
            Live Resume Editor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Make quick adjustments to your resume text and re-run the ATS engine immediately.
          </p>
        </div>
        <button
          onClick={() => {
            setText(initialText || "");
            setIsEditing(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Cancel
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-200 text-sm font-medium transition-all font-mono resize-y"
        placeholder="Resume text..."
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleRunAnalysis}
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          Re-Analyze Text
        </button>
      </div>
    </div>
  );
};

export default LiveEditor;
