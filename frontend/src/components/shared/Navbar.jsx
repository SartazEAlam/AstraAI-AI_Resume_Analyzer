import React from "react";
import {
  Layers,
  Sun,
  Moon,
} from "lucide-react";

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

export default Navbar;
