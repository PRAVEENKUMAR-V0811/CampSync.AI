import React, { useState } from 'react';
import { FaUserTie, FaLayerGroup, FaPlay } from 'react-icons/fa';

const InterviewSettings = ({ onStartInterview }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level) {
      onStartInterview(role, level);
    } else {
      alert('Please select both a role and experience level.');
    }
  };

  return (
    // Container ensures the card is centered and doesn't hide under the fixed header
    <div className="min-h-screen pb-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 transform transition-all duration-300 ease-in-out">
        
        {/* Decorative Icon */}
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
          <FaUserTie />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4 tracking-tight">
          Prepare for Your Interview
        </h2>
        
        <p className="text-center text-gray-500 mb-10 text-base md:text-lg leading-relaxed">
          Select your desired role and experience level to start a <span className="text-indigo-600 font-semibold">tailored AI mock interview.</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="relative group">
            <label htmlFor="role" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 mb-3 ml-1">
              <FaUserTie className="text-[10px]" /> Interview Role
            </label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="cursor-pointer block w-full bg-slate-50 border-2 border-slate-100 text-gray-700 py-4 px-5 rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                required
              >
                <option value="">Select a Role</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.707 6.586 4.293 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <div className="relative group">
            <label htmlFor="level" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 mb-3 ml-1">
              <FaLayerGroup className="text-[10px]" /> Experience Level
            </label>
            <div className="relative">
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="cursor-pointer block w-full bg-slate-50 border-2 border-slate-100 text-gray-700 py-4 px-5 rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                required
              >
                <option value="">Select Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Principal">Principal</option>
              </select>
              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.707 6.586 4.293 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="cursor-pointer w-full py-5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaPlay className="text-sm group-hover:scale-110 transition-transform" />
              Start Interview
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-bold">
              Powered by CampSync AI engine
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSettings;