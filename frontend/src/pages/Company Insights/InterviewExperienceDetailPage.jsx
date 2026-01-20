// src/components/InterviewExperienceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FaArrowLeft, FaSpinner, FaThumbsUp, FaThumbsDown, FaCalendarAlt, 
  FaUserTie, FaBriefcase, FaMoneyBillWave, FaLightbulb, FaCode, 
  FaCommentDots, FaLayerGroup, FaSmile, FaCheckCircle 
} from 'react-icons/fa';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../api';

const InterviewExperienceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperience = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
      if (!response.ok) throw new Error('Failed to fetch detailed interview experience.');
      const data = await response.json();
      setExperience(data);
    } catch (err) {
      setError('Could not load experience details.');
      toast.error('Failed to load experience details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperience(); }, [id]);

  const handleVote = async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to ${type} experience.`);
      const updatedExperience = await response.json();
      setExperience(updatedExperience.experience);
      toast.success(`Experience ${type}d successfully!`);
    } catch (err) {
      toast.error(`Failed to ${type}. Please try again.`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4 cursor-pointer" />
      <p className="text-lg font-medium text-slate-600">Fetching experience details...</p>
    </div>
  );

  if (error || !experience) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-red-500 text-5xl mb-4 flex justify-center">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || "Experience Not Found"}</h2>
        <button onClick={() => navigate('/company-insights')} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-2">
          <FaArrowLeft className="cursor-pointer" /> Back to Insights
        </button>
      </div>
    </div>
  );

  const {
    name, anonymous, passOutYear, department, yearOfStudy, companyName, interviewType, 
    role, package: experiencePackage, focusSkills, roundsFaced, otherRound, 
    unexpectedQuestions, codingQuestions, interviewTopics, comfortLevel, outcome,
    feedback, resources, experienceRating, additionalComments, createdAt, votes
  } = experience;

  const displayRounds = roundsFaced.includes("Other") ? [...roundsFaced.filter(r => r !== "Other"), otherRound] : roundsFaced;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* <Toaster position="top-center" /> */}
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/company-insights')}
          className="group flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-bold cursor-pointer"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform cursor-pointer" /> Back to Company Insights
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 md:p-10 border-b border-slate-100 bg-gradient-to-br from-white to-indigo-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {companyName} <span className="text-indigo-600">/ {role}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 pt-2">
                  <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm cursor-pointer">
                    <FaUserTie className="text-indigo-500 cursor-pointer" /> {anonymous === "Yes" ? "Anonymous" : name}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm cursor-pointer">
                    <FaCalendarAlt className="text-indigo-500 cursor-pointer" /> {format(new Date(createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className={`px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm cursor-pointer ${outcome?.toLowerCase() === 'selected' ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}>
                  {outcome}
                </div>
                <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-lg cursor-pointer">
                  <span className="text-yellow-600 font-black">{experienceRating}/5</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 cursor-pointer ${i < experienceRating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-12">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Type', value: interviewType, icon: <FaBriefcase />, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Package', value: experiencePackage, icon: <FaMoneyBillWave />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Dept', value: department, icon: <FaUserTie />, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Comfort', value: comfortLevel, icon: <FaSmile />, color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-5 rounded-[24px] border border-white shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
                  <div className={`${stat.color} text-xl mb-2 cursor-pointer`}>{stat.icon}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter cursor-pointer">{stat.label}</p>
                  <p className="text-slate-900 font-bold truncate cursor-pointer">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Rounds Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase text-sm tracking-widest cursor-pointer">
                <FaLayerGroup className="text-indigo-600 cursor-pointer" /> Recruitment Rounds
              </h3>
              <div className="flex flex-wrap gap-3">
                {displayRounds.map((round, index) => (
                  <div key={index} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-2xl shadow-md shadow-indigo-100 font-bold text-sm cursor-pointer hover:bg-indigo-700 transition-colors">
                    <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer">{index + 1}</span>
                    {round}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section title="Focus Skills" icon={<FaCheckCircle />} content={focusSkills} color="indigo" />
              <Section title="Interview Topics" icon={<FaCommentDots />} content={interviewTopics} color="blue" />
              <Section title="Coding Questions" icon={<FaCode />} content={codingQuestions} color="emerald" />
              <Section title="Unexpected Questions" icon={<FaLightbulb />} content={unexpectedQuestions} color="rose" />
              <Section title="Resources" icon={<FaLayerGroup />} content={resources} color="slate" />
              <Section title="Advice & Feedback" icon={<FaSmile />} content={feedback} color="cyan" />
            </div>

            {additionalComments && (
              <Section title="Additional Comments" icon={<FaCommentDots />} content={additionalComments} color="indigo" />
            )}

            {/* Voting Footer */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center gap-8">
              <div className="text-center">
                <h4 className="text-2xl font-black text-slate-900 cursor-pointer">Was this helpful?</h4>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleVote('upvote')}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 hover:border-green-500 text-slate-600 hover:text-green-600 rounded-[20px] transition-all font-black cursor-pointer group shadow-xl active:scale-95"
                >
                  <FaThumbsUp className="text-xl group-hover:scale-125 transition-transform cursor-pointer" /> 
                  <span className="text-lg cursor-pointer">{votes?.upvotes || 0}</span>
                </button>
                <button
                  onClick={() => handleVote('downvote')}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 hover:border-red-500 text-slate-600 hover:text-red-600 rounded-[20px] transition-all font-black cursor-pointer group shadow-xl active:scale-95"
                >
                  <FaThumbsDown className="text-xl group-hover:scale-125 transition-transform cursor-pointer" /> 
                  <span className="text-lg cursor-pointer">{votes?.downvotes || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, content, color }) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    slate: 'text-slate-600 bg-slate-50 border-slate-200'
  };

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] cursor-pointer ${colorMap[color].split(' ')[0]}`}>
        {icon} {title}
      </div>
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm text-slate-700 leading-relaxed min-h-[100px] cursor-pointer hover:border-slate-300 transition-colors">
        {content || "Not specified."}
      </div>
    </div>
  );
};

export default InterviewExperienceDetailPage;