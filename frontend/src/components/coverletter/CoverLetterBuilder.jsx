import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoverLetterForm from './CoverLetterForm';
import CoverLetterPreview from './CoverLetterPreview';

export default function CoverLetterBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetRole: '',
    targetCompany: '',
    hiringManager: '',
    tone: 'Professional',
    letterContent: '',
    skills: [],
    experienceHighlights: []
  });

  const [customization, setCustomization] = useState({
    templateId: 'classic',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: 'default',
    accentColor: '#4f46e5'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing user data from localStorage on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem('resumeData');
      if (savedResume) {
        const parsed = JSON.parse(savedResume);
        setFormData(prev => ({
          ...prev,
          name: parsed.personalInfo?.fullName || '',
          email: parsed.personalInfo?.email || '',
          phone: parsed.personalInfo?.phone || '',
          skills: parsed.skills || [],
          experienceHighlights: parsed.experience?.map(e => e.description) || []
        }));
      }
    } catch (e) {
      console.error("Error loading resume data for cover letter", e);
    }
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/generate-cover-letter`, {
        name: formData.name,
        target_role: formData.targetRole,
        target_company: formData.targetCompany,
        hiring_manager: formData.hiringManager,
        tone: formData.tone,
        skills: formData.skills,
        experience_highlights: formData.experienceHighlights
      });

      if (response.data && response.data.letter) {
        setFormData(prev => ({
          ...prev,
          letterContent: response.data.letter
        }));
      }
    } catch (error) {
      console.error("Error generating cover letter", error);
      alert("Failed to generate cover letter. Please check backend connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-[#070b14]">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 z-10 transition-all duration-300">
        <CoverLetterForm 
          formData={formData} 
          setFormData={setFormData}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {/* Right Panel: Preview */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-100/50 dark:bg-black/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="absolute inset-0 z-0">
          <CoverLetterPreview 
            formData={formData} 
            customization={customization} 
            setCustomization={setCustomization} 
          />
        </div>
      </div>
    </div>
  );
}
