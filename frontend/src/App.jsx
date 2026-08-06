import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

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
          onClick={() => setMode('individual')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'individual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Individual
        </button>
        <button 
          onClick={() => setMode('organization')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'organization' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Organization
        </button>
      </div>
    </div>
  </nav>
);

  const ScoreRing = ({ score, label, icon: Icon, colorClass }) => {

  const isNA = score === null || score === undefined;

  const displayScore = isNA
    ? 0
    : Math.min(100, Math.max(0, score));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            className="stroke-slate-200"
            strokeWidth="8" fill="none"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            className={colorClass}
            strokeWidth="8" fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className="text-xl font-black text-slate-900">
          {isNA ? "N/A" : `${Math.round(displayScore)}%`}
        </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
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
          cx="24" cy="24" r={radius}
          className="stroke-slate-200"
          strokeWidth="4" fill="none"
        />
        <motion.circle
          cx="24" cy="24" r={radius}
          className={colorClass}
          strokeWidth="4" fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <span className="text-[11px] font-bold text-slate-700 relative z-10">{displayScore}</span>
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Your Profile</h3>
        <p className="text-slate-400 text-sm">Our AI is extracting skills and mapping career paths...</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="solid-card p-8 h-48 shimmer" />
      ))}
    </div>
  </div>
);

const CandidateModal = ({ candidate, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{candidate.fileName}</h2>
            <p className="text-slate-500 mt-1">Detailed Analysis Results</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {candidate.error ? (
          <div className="py-12 flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
            <p className="text-slate-500 max-w-md">{candidate.error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
              <ScoreRing score={candidate.match_percentage} label="Job Match" icon={Target} colorClass="stroke-indigo-500" />
              <ScoreRing score={candidate.strength_score} label="Resume Strength" icon={Zap} colorClass="stroke-purple-500" />
             <ScoreRing
                score={
                  candidate.required_skill_count > 0
                    ? Math.round(
                        (candidate.matched_skill_count /
                          candidate.required_skill_count) * 100
                      )
                    : null
                }
                label={
                  candidate.required_skill_count > 0
                    ? "Skill Coverage"
                    : "Profile Analysis"
                }
                icon={CheckCircle2}
                colorClass="stroke-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="solid-card p-6 shadow-none">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-lg font-bold text-slate-900">Extracted Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.extracted_skills?.map((skill, i) => (
                    <span key={i} className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                  {(!candidate.extracted_skills || candidate.extracted_skills.length === 0) && (
                    <p className="text-slate-500 italic text-sm">No specific skills detected.</p>
                  )}
                </div>
              </div>
              <div className="solid-card p-6 shadow-none">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-slate-900">Skill Gaps</h3>
                </div>
                {candidate.missing_skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.missing_skills.map((skill, i) => (
                      <span key={i} className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-emerald-600 text-sm font-medium">✨ Your profile matches all target skills perfectly!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Section */}
            {candidate.experience && (
              <div className="solid-card p-6 shadow-none mb-8">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900">Previous Experience</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70 mb-1">Total Experience</p>
                    <p className="text-2xl font-black text-amber-700">
                      {candidate.experience.total_years != null ? `${candidate.experience.total_years} year${candidate.experience.total_years !== 1 ? 's' : ''}` : 'Not detected'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-600/70 mb-1">Seniority Level</p>
                    <p className="text-2xl font-black text-violet-700">{candidate.experience.seniority_level}</p>
                  </div>
                </div>
                {candidate.experience.positions?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Positions Found</p>
                    {candidate.experience.positions.map((pos, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{pos.title}</p>
                          {pos.company && <p className="text-xs text-slate-500">{pos.company}</p>}
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
                {(!candidate.experience.positions || candidate.experience.positions.length === 0) && candidate.experience.total_years == null && (
                  <p className="text-slate-400 italic text-sm">No specific work experience detected in the resume.</p>
                )}
              </div>
            )}

            {candidate.recommended_roles?.length > 0 && (
              <div className="solid-card p-6 shadow-none bg-slate-50 border-slate-200">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-indigo-500"/> Recommended Alternative Roles</h3>
                 <div className="flex gap-4 flex-wrap">
                   {candidate.recommended_roles.map((role, i) => (
                     <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm">{role}</span>
                   ))}
                 </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

const OrganizationDashboard = () => {
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
      axios.get('http://localhost:5000/api/jobs')
        .then(res => {
          setJobs(res.data);

          if (res.data.length > 0) {
            setSelectedJobId(String(res.data[0].id));
          }
        })
        .catch(err => console.error('Error fetching jobs:', err));
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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf') || f.name.endsWith('.docx'));
      setFiles(droppedFiles);
      setResults([]);
    }
  }, []);

  const handleUpload = async () => {
  if (files.length === 0) return;

  if (!selectedJobId) {
    alert("Please select a job role");
    return;
  }

  console.log("Selected Job:", selectedJobId);

  setLoading(true);
  setResults([]);

    // Process files sequentially to avoid overwhelming the ML service
    const batchResults = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobId', selectedJobId);
      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // 60 second timeout per file
        });
        batchResults.push({ fileName: file.name, ...response.data });
      } catch (err) {
        console.error('Error uploading', file.name, err);
        batchResults.push({ fileName: file.name, error: err.response?.data?.error || 'Failed to analyze' });
      }
    }

    setResults(batchResults.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0)));
    setLoading(false);
  };

  const roleDistribution = React.useMemo(() => {
    if (results.length === 0) return [];
    const counts = {};
    results.forEach(res => {
      if (res.recommended_roles) {
        res.recommended_roles.forEach(role => {
          counts[role] = (counts[role] || 0) + 1;
        });
      }
    });
    return Object.keys(counts).map(role => ({
      name: role,
      count: counts[role]
    })).sort((a, b) => b.count - a.count);
  }, [results]);

  return (
    <div className="space-y-8 relative">
      {results.length === 0 && !loading && (
        <div className="solid-card p-8 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Bulk Resume Analysis</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Description</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
            {jobs.length === 0 && <option value="1">Default Software Engineer Role</option>}
          </select>
        </div>

        <div
          className={`upload-zone min-h-[200px] flex flex-col items-center justify-center p-8 cursor-pointer ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
            accept=".pdf,.docx"
          />
          <Upload className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">
            {files.length > 0 ? `${files.length} resumes selected` : 'Drop multiple resumes here'}
          </h3>
          <p className="text-slate-400">or click to browse your files</p>
        </div>

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || loading}
          className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold text-lg transition-all"
        >
          {loading ? 'Analyzing Batch...' : 'Start Bulk Analysis'}
        </button>
      </div>
      )}

      {loading && (
        <div className="solid-card p-12 flex flex-col items-center justify-center mt-8">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold text-slate-700">Analyzing {files.length} candidates against the job description...</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="space-y-8 mt-8">
          <div className="flex items-center justify-between bg-white solid-card p-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Batch Analysis Complete</h2>
              <p className="text-slate-500">Successfully analyzed {results.length} candidate{results.length !== 1 && 's'}.</p>
            </div>
            <button 
              onClick={() => { setResults([]); setFiles([]); }}
              className="text-sm font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100"
            >
              Analyze New Batch →
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <div className="xl:col-span-1">
            <div className="solid-card p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recommended Career Paths</h3>
              <p className="text-sm text-slate-500 mb-8">Role Distribution Based on Candidate Profiles of {results.length} candidates.</p>
              
              {roleDistribution.length > 0 ? (
                <div style={{ height: `${Math.max(150, roleDistribution.length * 80)}px` }} className="w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 'bold'}} width={100} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                 <div className="flex items-center justify-center h-[300px] text-slate-400 italic">No roles recommended</div>
              )}
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="solid-card p-8 bg-white h-full overflow-hidden flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Ranked Candidates</h3>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Candidate File</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Match %</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Strength</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Key Skills</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Top Role</th>
                      <th className="p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900 flex items-center gap-3 whitespace-nowrap">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          <span className="truncate max-w-[200px]" title={res.fileName}>{res.fileName}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            {res.error ? '-' : <MiniScoreRing score={res.match_percentage} colorClass="stroke-indigo-500" />}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            {res.error ? '-' : <MiniScoreRing score={res.strength_score} colorClass="stroke-purple-500" />}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-sm whitespace-nowrap">
                          {res.error ? '-' : (
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-amber-400" />
                              <span className="font-semibold">
                                {res.experience?.total_years != null ? `${res.experience.total_years} yr${res.experience.total_years !== 1 ? 's' : ''}` : '—'}
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
                          {res.error ? '-' : (res.extracted_skills?.slice(0, 3).join(', ') || 'None')}
                        </td>
                        <td className="p-4 text-slate-600 text-sm font-semibold max-w-[150px] truncate">
                          {res.error ? '-' : (res.recommended_roles?.[0] || 'No matching role')}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <button 
                            onClick={() => setSelectedCandidate(res)}
                            className={`text-sm font-bold transition-colors px-4 py-2 rounded-full ${
                              res.error 
                                ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' 
                                : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
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
          <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Application ── */

function App() {
  const [mode, setMode] = useState('individual');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/jobs')
      .then((res) => setJobs(res.data))
      .catch(console.error);
  }, []);
  
  // Single upload state
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setError('');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
      setFileName(dropped.name);
      setError('');
    } else {
      setError('Please upload a PDF or DOCX file.');
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file to analyze.');
      return;
    }

    setLoading(true);
    setResults(null);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    if (selectedJobId) {
      formData.append('jobId', selectedJobId);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Service connection failed. Ensure backend and ML services are running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar mode={mode} setMode={setMode} />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px] animate-float" style={{ animationDelay: '-10s' }} />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {mode === 'individual' ? (
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
                  Optimize Your <span className="text-gradient">Career Path</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Upload your resume and let Astra analyze your skills, identify gaps, and recommend 
                  the best roles tailored to your unique profile.
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
                        className={`upload-zone min-h-[300px] flex flex-col items-center justify-center p-10 cursor-pointer ${dragOver ? 'drag-over' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.docx"
                        />
                        
                        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                          <Upload className="w-10 h-10 text-indigo-400" />
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {fileName ? fileName : 'Drop your resume here'}
                          </h3>
                          <p className="text-slate-400">
                            {fileName ? 'Ready for analysis' : 'or click to browse your files'}
                          </p>
                          <p className="text-xs text-slate-500 pt-4 uppercase tracking-widest">
                            Supported formats: PDF, DOCX
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
                      {/* Job Selection */}
                      <div className="mt-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Select Target Job (Optional)
                        </label>

                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(String(e.target.value))}
                            className="w-full md:w-1/2 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="">
                              Select a Job Role
                            </option>

                            {jobs.map(job => (
                              <option
                                key={job.id}
                                value={String(job.id)}
                              >
                                {job.title}
                              </option>
                            ))}
                          </select>
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
                  <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
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
                    {/* Score Overview */}
                    <div className="solid-card p-8 md:p-12 glow-primary">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900">Analysis Results</h2>
                          <p className="text-slate-400">Comprehensive breakdown of your professional profile</p>
                        </div>
                        <button 
                          onClick={() => { setResults(null); setFile(null); setFileName(''); }}
                          className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Analyze New →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-6">
                        <ScoreRing 
                          score={results.match_percentage} 
                          label="Job Match" 
                          icon={Target}
                          colorClass="stroke-indigo-500"
                        />
                        <ScoreRing 
                          score={results.strength_score} 
                          label="Resume Strength" 
                          icon={Zap}
                          colorClass="stroke-purple-500"
                        />
                        <ScoreRing
                          score={Math.round(Math.min(
                            100,
                            ((results.extracted_skills?.length || 0) / 15) * 100
                          ))}
                          label="Skill Coverage"
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
                          <h3 className="text-xl font-bold text-slate-900">Extracted Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {results.extracted_skills?.map((skill, i) => (
                            <span key={i} className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {skill}
                            </span>
                          ))}
                          {(!results.extracted_skills || results.extracted_skills.length === 0) && (
                            <p className="text-slate-500 italic text-sm">No specific skills detected.</p>
                          )}
                        </div>
                      </div>

                      {/* Skill Gaps Section */}
                      <div className="solid-card p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <h3 className="text-xl font-bold text-slate-900">Skill Gaps</h3>
                        </div>
                        {results.missing_skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {results.missing_skills.map((skill, i) => (
                              <span key={i} className="skill-tag px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <p className="text-emerald-600 text-sm font-medium">✨ Your profile matches all target skills perfectly!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience Section */}
                    {results.experience && (
                      <div className="solid-card p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                          <Briefcase className="w-5 h-5 text-amber-500" />
                          <h3 className="text-xl font-bold text-slate-900">Previous Experience</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70 mb-1">Total Experience</p>
                            <p className="text-2xl font-black text-amber-700">
                              {results.experience.total_years != null ? `${results.experience.total_years} year${results.experience.total_years !== 1 ? 's' : ''}` : 'Not detected'}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                            <p className="text-xs font-bold uppercase tracking-widest text-violet-600/70 mb-1">Seniority Level</p>
                            <p className="text-2xl font-black text-violet-700">{results.experience.seniority_level}</p>
                          </div>
                        </div>
                        {results.experience.positions?.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Positions Found</p>
                            {results.experience.positions.map((pos, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Briefcase className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{pos.title}</p>
                                  {pos.company && <p className="text-xs text-slate-500">{pos.company}</p>}
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
                        {(!results.experience.positions || results.experience.positions.length === 0) && results.experience.total_years == null && (
                          <p className="text-slate-400 italic text-sm">No specific work experience detected in the resume.</p>
                        )}
                      </div>
                    )}

                    {/* Role Recommendations */}
                    {results.recommended_roles?.length > 0 && (
                      <div className="solid-card p-8 md:p-10">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-6 mb-6">
                          <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">Recommended Career Paths</h3>
                            <p className="text-sm text-slate-400">Based on your current skill set and potential</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {results.recommended_roles.map((role, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 transition-all hover:translate-y-[-4px]">
                              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Recommendation {i+1}</div>
                              <div className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{role}</div>
                              <div className="mt-4 flex items-center text-xs text-indigo-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                View Roadmap <ArrowRight className="w-3 h-3 ml-2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="max-w-[1400px] mx-auto w-full">
             <div className="text-center mb-12">
               <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Organization Dashboard</h1>
               <p className="text-slate-500 text-lg">Upload and rank multiple candidate resumes against a specific job role.</p>
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
            <span className="text-sm font-bold tracking-tight text-slate-900">Astra AI</span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2026 Astra AI Resume Analyzer. Built for professionals, by professionals.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-xs">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
