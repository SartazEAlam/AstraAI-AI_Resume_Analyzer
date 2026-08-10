import React from "react";
import { Layers } from "lucide-react";

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

export default LoadingOverlay;
