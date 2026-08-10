import React from "react";

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

export default FeatureCard;
