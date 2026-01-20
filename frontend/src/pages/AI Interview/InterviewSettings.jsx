// src/components/InterviewSettings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FaPlay, FaChevronDown, FaGraduationCap, 
  FaTerminal, FaCode, FaShieldAlt
} from 'react-icons/fa';
import { ArrowLeft, Sparkles, Briefcase, BarChart3, Target, Search } from 'lucide-react';

const InterviewSettings = ({ onStartInterview }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const roles = [
    "Software Engineer / Software Developer",
    "Graduate Engineer Trainee (GET)",
    "Data Analyst",
    "AI / Machine Learning Engineer",
    "Embedded Software Engineer",
    "QA Engineer / SDET",
    "Customer Success Executive",
    "DevOps Engineer",
    "Java Developer",
    "Python Developer",
    "Cloud Engineer"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level) {
      onStartInterview(role, level);
    } else {
      toast.error('Configuration Incomplete: Please select a role and preparation level.', {
        style: {
          borderRadius: '12px',
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #334155',
          fontWeight: 'bold',
          fontSize: '12px'
        },
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Immersive Background Gradients - Adjusted for tighter view */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,_rgba(79,70,229,0.12),_transparent)] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button - Scaled down for visibility */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em] group cursor-pointer z-50"
      >
        <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-indigo-600 transition-all border border-white/10 cursor-pointer shadow-lg">
          <ArrowLeft size={14} className="cursor-pointer" />
        </div>
        <span className="cursor-pointer">Exit Portal</span>
      </button>

      {/* Main Configuration Card - Tightened for Window visibility */}
      <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] border border-white/10 relative shadow-2xl shadow-black/50 group hover:border-white/20 transition-colors duration-500">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />

        {/* Header Section - Reduced bottom margin */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 border border-white/20 relative group transition-transform hover:scale-105 cursor-pointer">
            <FaGraduationCap className="text-2xl text-white cursor-pointer" />
            <div className="absolute -right-1 -bottom-1 bg-emerald-500 p-1 rounded-lg border-2 border-[#020617] shadow-lg cursor-pointer">
               <Sparkles size={10} className="text-white cursor-pointer" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-1 tracking-tight uppercase italic cursor-pointer">
            Placement <span className="text-indigo-500 cursor-pointer">Portal</span>
          </h2>
          <p className="text-slate-400 text-[11px] font-bold tracking-wide cursor-pointer opacity-80">Ready to initiate your AI-proctored session?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 cursor-pointer">Target Role</label>
                <Briefcase size={12} className="text-indigo-400/50 cursor-pointer" />
            </div>
            <div className="relative group/select">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/select:text-indigo-500 transition-colors pointer-events-none">
                 <Search size={14} />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 text-white py-3.5 pl-11 pr-10 rounded-xl appearance-none focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-xs cursor-pointer hover:bg-black"
              >
                <option value="" className="text-slate-500 cursor-pointer">Select Job Profile</option>
                {roles.map((r) => (
                  <option key={r} value={r} className="text-white bg-slate-900 font-medium cursor-pointer">
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500 cursor-pointer transition-transform group-hover/select:scale-110">
                 <FaChevronDown size={12} className="cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Preparation Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 cursor-pointer">Difficulty</label>
                <Target size={12} className="text-indigo-400/50 cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all cursor-pointer active:scale-95 ${
                    level === lvl 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                    : 'bg-slate-950/30 border-white/5 text-slate-500 hover:border-indigo-500/30 hover:text-indigo-300'
                  }`}
                >
                  <span className="cursor-pointer">{lvl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button - Reduced padding */}
          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full py-4 px-6 bg-white text-black font-black rounded-xl shadow-2xl hover:bg-indigo-50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              <FaPlay className="text-[9px] cursor-pointer group-hover:translate-x-1 transition-transform" />
              <span className="cursor-pointer">Start Interview</span>
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
               <FaTerminal className="text-indigo-500 cursor-pointer" size={10} />
               <p className="text-slate-400 text-[9px] font-bold tracking-[0.1em] uppercase cursor-pointer">
                 CampSync AI Engine v2.0
               </p>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Tags - Stay within Window */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 px-6 relative z-10">
         <div className="flex items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors cursor-pointer group">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse cursor-pointer" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] cursor-pointer">Live Proctoring</span>
         </div>
         <div className="flex items-center gap-2 text-slate-600 hover:text-indigo-400 transition-colors cursor-pointer">
            <FaCode className="text-indigo-500 text-[10px] cursor-pointer" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] cursor-pointer">Logic Engine</span>
         </div>
         <div className="flex items-center gap-2 text-slate-600 hover:text-blue-400 transition-colors cursor-pointer">
            <BarChart3 className="text-blue-500 cursor-pointer" size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] cursor-pointer">Feedback Mapping</span>
         </div>
      </div>
    </div>
  );
};

export default InterviewSettings;