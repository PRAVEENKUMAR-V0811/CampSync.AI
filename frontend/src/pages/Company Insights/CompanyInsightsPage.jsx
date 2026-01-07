import React, { useState, useEffect } from 'react';
import InterviewExperienceCard from './InterviewExperienceCard';
import { Toaster, toast } from 'react-hot-toast';
import { FaFilter, FaSearch, FaSpinner } from 'react-icons/fa';
import { API_BASE_URL } from '../../api';
import { Search, Filter, Briefcase, MessageSquare, Sparkles, Loader2 } from 'lucide-react';

const CompanyInsightsPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences${selectedCompany ? `?companyName=${selectedCompany}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch experiences');
      const data = await response.json();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err) {
      setError('Could not load experiences.');
      toast.error('Failed to load experiences.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniqueCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/companies`);
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      toast.error('Failed to load companies.');
    }
  };

  useEffect(() => {
    fetchExperiences();
    fetchUniqueCompanies();
  }, [selectedCompany]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = experiences.filter(exp =>
      exp.companyName.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.role.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.focusSkills.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.interviewTopics.toLowerCase().includes(lowerCaseSearchTerm) ||
      (exp.anonymous === "No" && exp.name.toLowerCase().includes(lowerCaseSearchTerm))
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
    } catch (err) {
      toast.error(`Failed to ${type}.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      <Toaster position="top-right" />
      
      {/* Background Decor Consistency */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[100%] bg-sky-100/50 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 -right-[10%] w-[50%] h-[80%] bg-indigo-100/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-28 md:pt-32 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
             <Briefcase className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Company Insights
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Learn from the experiences of others. Real interview questions, rounds, and outcomes from top-tier recruiters.
          </p>
        </div>

        {/* Floating Search & Filter Console */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[32px] shadow-xl shadow-slate-200/60 border border-white mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by role, skills, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-medium text-slate-700 cursor-pointer shadow-inner"
            />
          </div>

          <div className="md:w-1/3 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-indigo-600 focus:outline-none appearance-none font-bold text-slate-700 cursor-pointer shadow-inner"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-xl font-bold text-slate-400 animate-pulse">Gathering insights...</p>
          </div>
        ) : error ? (
          <div className="text-center bg-white p-12 rounded-[32px] border-2 border-red-50 shadow-lg max-w-lg mx-auto">
            <div className="text-red-500 mb-4 text-4xl font-bold">!</div>
            <p className="text-slate-800 font-bold mb-2">{error}</p>
            <button onClick={fetchExperiences} className="text-indigo-600 font-bold underline cursor-pointer">Try Refreshing</button>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <MessageSquare size={32} className="text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-800 mb-2">No Experiences Found</p>
            <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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