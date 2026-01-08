import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlay, FaChevronDown, FaGraduationCap, 
  FaTerminal, FaCode, FaShieldAlt
} from 'react-icons/fa';
import { ArrowLeft, Sparkles, Briefcase, BarChart3, Target } from 'lucide-react';

const InterviewSettings = ({ onStartInterview }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level) {
      onStartInterview(role, level);
    } else {
      alert('Please select both a role and your preparation level.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.12),_transparent)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold uppercase text-[10px] tracking-[0.2em] group cursor-pointer"
      >
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 border border-white/10 transition-all">
          <ArrowLeft size={16} />
        </div>
        Back to Home
      </button>

      {/* Main Configuration Card */}
      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] shadow-3xl border border-white/10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 border border-white/10 relative group">
            <FaGraduationCap className="text-4xl text-white" />
            <div className="absolute -right-1 -bottom-1 bg-emerald-500 p-1.5 rounded-full border-4 border-[#020617]">
               <Sparkles size={12} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Placement Portal</h2>
          <p className="text-slate-400 text-sm font-medium">Configure your session for upcoming campus recruitment drives.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Role Selection - Visual Polish */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Target Campus Role</label>
                <Briefcase size={14} className="text-indigo-400/50" />
            </div>
            <div className="relative group cursor-pointer">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-white py-5 px-6 rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-sm cursor-pointer hover:bg-black"
              >
                <option value="" className="text-slate-500 cursor-pointer">Select Job Profile</option>
                <optgroup label="Core Technical" className="bg-slate-950 text-indigo-400 font-bold cursor-pointer">
                  <option value="SDE Intern" className="text-white cursor-pointer">SDE Intern / PPO Track</option>
                  <option value="Graduate Engineer Trainee" className="text-white cursor-pointer">Graduate Engineer Trainee (GET)</option>
                  <option value="Associate Developer" className="text-white cursor-pointer">Associate Software Developer</option>
                </optgroup>
                <optgroup label="Specialized Tracks" className="bg-slate-950 text-indigo-400 font-bold cursor-pointer">
                  <option value="Data Science Trainee" className="text-white cursor-pointer">Data Science / Analytics Trainee</option>
                  <option value="Cyber Security Intern" className="text-white cursor-pointer">Information Security Associate</option>
                  <option value="Cloud Consultant" className="text-white cursor-pointer">Cloud Support Engineer Intern</option>
                </optgroup>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500 cursor-pointer">
                 <FaChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Preparation Level Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Preparation Level</label>
                <Target size={14} className="text-indigo-400/50" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                    level === lvl 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full py-6 px-6 bg-white text-black font-black rounded-2xl shadow-2xl hover:bg-indigo-50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs cursor-pointer"
            >
              <FaPlay className="text-[10px]" />
              Initialize AI Interviewer
            </button>
            <p className="text-center text-slate-500 text-[12px] mt-6 font-bold tracking-widest flex items-center justify-center gap-2">
               <FaTerminal className="text-indigo-500" /> Powered By CampSync.AI
            </p>
          </div>
        </form>
      </div>

      {/* Enhanced Footer Tags */}
      <div className="mt-8 flex gap-10">
         <div className="flex items-center gap-2 text-slate-600">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live Proctoring</span>
         </div>
         <div className="flex items-center gap-2 text-slate-600">
            <FaCode className="text-indigo-500 text-xs" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Logic Analysis</span>
         </div>
         <div className="flex items-center gap-2 text-slate-600">
            <BarChart3 className="text-blue-500" size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Detailed Feedback</span>
         </div>
      </div>
    </div>
  );
};

export default InterviewSettings;