// src/components/CompanyInsightsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewExperienceCard from './InterviewExperienceCard';
import { Toaster, toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../api';
import { 
  Search, 
  Filter, 
  Briefcase, 
  MessageSquare, 
  Loader2, 
  PlusCircle, 
  Video, 
  Sparkles,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';

const CompanyInsightsPage = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences${selectedCompany ? `?companyName=${selectedCompany}` : ''}`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err) {
      setError('Could not load experiences.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniqueCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/companies`);
      const data = await response.json();
      setCompanies(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchExperiences();
    fetchUniqueCompanies();
  }, [selectedCompany]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = experiences.filter(exp =>
      exp.companyName.toLowerCase().includes(term) ||
      exp.role.toLowerCase().includes(term) ||
      exp.focusSkills.toLowerCase().includes(term) ||
      exp.interviewTopics.toLowerCase().includes(term)
    );
    setFilteredExperiences(results);
  }, [searchTerm, experiences]);

  const handleVote = async (experienceId, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${experienceId}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedData = await response.json();
      setExperiences(prev => prev.map(exp => exp._id === experienceId ? updatedData.experience : exp));
      toast.success(`${type}d successfully!`);
    } catch (err) { toast.error(`Failed.`); }
  };

  // Added handleMockInterview with strict screen size check and specific toast UI
  const handleMockInterview = () => {
    const isLargeScreen = window.innerWidth >= 1024;

    if (!isLargeScreen) {
      toast.error(
        "This is enabled only for larger device like laptop or desktop",
        {
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            fontWeight: '500'
          }
        }
      );
      return;
    }
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      {/* <Toaster position="top-right" /> */}
      
      {/* Dynamic Background Decor - Slightly reduced opacity */}
      <div className="absolute top-0 left-0 w-full h-[400px] z-0 pointer-events-none">
        <div className="absolute -top-[5%] -left-[5%] w-[50%] h-[100%] bg-indigo-100/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-0 -right-[5%] w-[40%] h-[80%] bg-blue-100/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 md:pt-24 max-w-7xl">
        
        {/* Compact Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 mb-4 cursor-pointer hover:shadow-md transition-shadow">
             <Sparkles size={14} className="text-amber-500 cursor-pointer" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">Platform Insights</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4 cursor-pointer">
            Company <span className="text-indigo-600 cursor-pointer">Insights</span>
          </h1>
          
          <p className="text-slate-500 font-bold text-base md:text-lg max-w-xl mx-auto mb-8 cursor-pointer">
            Real interview questions and outcomes from the community.
          </p>

          {/* Compact Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button 
              onClick={() => navigate('/share-experience')}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 cursor-pointer shadow-md group"
            >
              <PlusCircle size={16} className="cursor-pointer group-hover:rotate-90 transition-transform" />
              <span className="cursor-pointer">Share Experience</span>
            </button>
            
            <button 
              onClick={handleMockInterview}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Video size={16} className="cursor-pointer" />
              <span className="cursor-pointer">Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Unified Search & Filter Row */}
        <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 mb-12 flex flex-row items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
              <Search size={18} className="cursor-pointer" />
            </div>
            <input
              type="text"
              placeholder="Search by company, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-bold text-slate-700 hover:cursor-text text-sm placeholder:text-slate-400"
            />
          </div>

          <div className="w-1/3 md:w-1/4 relative group hidden sm:block">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full pl-4 pr-10 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none appearance-none font-black text-slate-700 cursor-pointer text-xs uppercase tracking-tighter"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company} className="cursor-pointer font-bold">{company}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} className="cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-4 cursor-pointer" size={50} />
            <p className="text-lg font-black text-slate-300 animate-pulse tracking-widest uppercase cursor-pointer">Loading...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20 bg-white/40 rounded-[40px] border-2 border-dashed border-slate-200">
            <MessageSquare size={50} className="text-slate-200 mx-auto mb-4 cursor-pointer" />
            <p className="text-xl font-black text-slate-800 cursor-pointer">No Results Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {filteredExperiences.map((experience) => (
              <InterviewExperienceCard
                key={experience._id}
                experience={experience}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInsightsPage;