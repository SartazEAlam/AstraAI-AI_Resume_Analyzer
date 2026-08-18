import React, { useRef, useEffect, useState } from 'react';
import { Download, FileText, Settings2, CheckCircle2, ChevronDown } from 'lucide-react';
import { generateCoverLetterPDF } from '../../utils/pdfGenerator';

const TEMPLATES = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' }
];

const FONTS = [
  { id: "'Inter', 'Segoe UI', sans-serif", label: "Inter (Clean)" },
  { id: "'Outfit', 'Inter', sans-serif", label: "Outfit (Modern)" },
  { id: "'Georgia', 'Times New Roman', serif", label: "Georgia (Serif)" },
  { id: "'Roboto Mono', monospace", label: "Mono (Technical)" }
];

const SIZES = [
  { id: "small", label: "Small" },
  { id: "default", label: "Standard" },
  { id: "large", label: "Large" }
];

export default function CoverLetterPreview({ formData, customization, setCustomization }) {
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const letterRef = useRef(null);

  // Auto-scale the A4 preview to fit the container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && letterRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; 
        const a4Width = 794; 
        const newScale = Math.min(1, containerWidth / a4Width);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({ ...prev, [name]: value }));
  };

  const handleExportPDF = async () => {
    try {
      setDownloading(true);
      const pdfBytes = await generateCoverLetterPDF(formData, customization);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formData.name || 'Candidate'}_Cover_Letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formData.letterContent);
    alert("Cover Letter copied to clipboard!");
  };

  const getTemplateStyles = () => {
    switch(customization.templateId) {
      case 'modern':
        return {
          container: "flex bg-white",
          sidebar: `w-1/3 p-8 border-r-4 text-white`,
          main: "w-2/3 p-8",
          header: "border-b-2 pb-4 mb-6",
        };
      case 'minimal':
        return {
          container: "bg-white p-12 text-left",
          sidebar: "hidden",
          main: "w-full",
          header: "mb-8",
        };
      case 'classic':
      default:
        return {
          container: "bg-white p-12",
          sidebar: "hidden",
          main: "w-full",
          header: "border-b-2 pb-4 mb-8 text-center",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#070b14] overflow-hidden">
      {/* Customization Toolbar */}
      <div className="bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 shadow-sm z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-slate-400" />
          
          <select 
            name="templateId" 
            value={customization.templateId} 
            onChange={handleCustomizationChange}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none rounded-md px-3 py-1.5 focus:ring-0 cursor-pointer"
          >
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label} Layout</option>)}
          </select>

          <select 
            name="fontFamily" 
            value={customization.fontFamily} 
            onChange={handleCustomizationChange}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none rounded-md px-3 py-1.5 focus:ring-0 cursor-pointer max-w-[120px]"
          >
            {FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>

          <select 
            name="fontSize" 
            value={customization.fontSize} 
            onChange={handleCustomizationChange}
            className="hidden sm:block text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none rounded-md px-3 py-1.5 focus:ring-0 cursor-pointer"
          >
            {SIZES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>

          <div className="flex items-center gap-2 px-2 border-l border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Accent</span>
            <input 
              type="color" 
              name="accentColor" 
              value={customization.accentColor} 
              onChange={handleCustomizationChange}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            Copy Text
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={downloading}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {downloading ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloading ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* A4 Scaled Preview Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 flex justify-center items-start custom-scrollbar">
        <div 
          ref={letterRef}
          className="shadow-xl ring-1 ring-black/5 bg-white transition-all transform origin-top"
          style={{ 
            width: '794px', 
            minHeight: '1123px', 
            transform: `scale(${scale})`, 
            marginBottom: `${-(1 - scale) * 1123}px`,
            fontFamily: customization.fontFamily,
          }}
        >
          <div className={`${styles.container} w-full h-full text-slate-800`}>
            
            {/* Sidebar (Modern Template Only) */}
            {customization.templateId === 'modern' && (
              <div className={styles.sidebar} style={{ backgroundColor: customization.accentColor, borderColor: customization.accentColor }}>
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-6">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'C'}
                </div>
                <h1 className="text-2xl font-bold leading-tight mb-2">{formData.name || 'Your Name'}</h1>
                <div className="w-8 h-1 bg-white/40 mb-6"></div>
                <div className="space-y-4 text-sm text-white/90">
                  <p>{formData.email || 'Email Address'}</p>
                  <p>{formData.phone || 'Phone Number'}</p>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className={styles.main}>
              
              {/* Header (Classic & Minimal) */}
              {customization.templateId !== 'modern' && (
                <div className={styles.header} style={customization.templateId === 'classic' ? { borderBottomColor: customization.accentColor } : {}}>
                  <h1 className="text-4xl font-bold mb-2" style={{ color: customization.templateId === 'minimal' ? customization.accentColor : '#1e293b' }}>
                    {formData.name || 'Your Name'}
                  </h1>
                  <p className="text-slate-500 font-medium tracking-wide">
                    {formData.email || 'Email'} • {formData.phone || 'Phone'}
                  </p>
                </div>
              )}

              {/* Letter Body */}
              <div className="mt-8 space-y-6 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                <p className="font-semibold text-slate-900">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                
                <div className="font-medium text-slate-800">
                  <p>{formData.hiringManager || 'Hiring Manager'}</p>
                  <p>{formData.targetRole || 'Target Role'}</p>
                  <p>{formData.targetCompany || 'Target Company'}</p>
                </div>

                <div className="pt-2">
                  {formData.letterContent || 'Your tailored cover letter will appear here when generated...'}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
