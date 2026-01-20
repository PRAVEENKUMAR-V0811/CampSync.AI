// src/components/InterviewExperienceCard.jsx
import React from 'react';
import { format } from 'date-fns';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Target, ChevronRight, Briefcase } from 'lucide-react';

const InterviewExperienceCard = ({ experience, onVote }) => {
  const navigate = useNavigate();
  const {
    _id, name, anonymous, department, passOutYear, companyName, 
    interviewType, role, package: experiencePackage, outcome, 
    experienceRating, createdAt, votes
  } = experience;

  return (
    <div 
      className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-5 md:p-8 flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 group cursor-pointer relative overflow-hidden" 
      onClick={() => navigate(`/company-insights/${_id}`)}
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100/80 transition-colors duration-500" />

      {/* Top Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.1em] mb-4 cursor-pointer border border-indigo-100/50">
            <Briefcase size={10} className="cursor-pointer" />
            {interviewType}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer tracking-tight">
            {companyName}
          </h2>
          <p className="text-slate-500 font-bold text-lg mt-1 cursor-pointer">{role}</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center text-slate-400 text-[11px] font-bold cursor-pointer bg-slate-50 px-2 py-1 rounded-lg">
            <Calendar size={12} className="mr-1.5 cursor-pointer text-indigo-400" />
            {format(new Date(createdAt), 'MMM dd, yyyy')}
          </div>
          <div className={`text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm cursor-pointer transition-transform group-hover:scale-105 ${
            outcome?.toLowerCase() === 'selected' || outcome?.toLowerCase() === 'placed'
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-800 text-white'
          }`}>
            {outcome}
          </div>
        </div>
      </div>

      {/* Info Grid - Visual Enhancement with subtle backgrounds */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-[24px] border border-white transition-all hover:bg-white hover:border-indigo-100 hover:shadow-md cursor-pointer group/item">
          <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 cursor-pointer group-hover/item:text-indigo-400 transition-colors">
            <User size={12} className="mr-2 cursor-pointer" /> Candidate
          </div>
          <p className="text-sm font-bold text-slate-700 truncate cursor-pointer">
            {anonymous === "Yes" ? "Anonymous Student" : name}
          </p>
        </div>
        
        <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-[24px] border border-white transition-all hover:bg-white hover:border-indigo-100 hover:shadow-md cursor-pointer group/item">
          <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 cursor-pointer group-hover/item:text-indigo-400 transition-colors">
            <Target size={12} className="mr-2 cursor-pointer" /> Batch
          </div>
          <p className="text-sm font-bold text-slate-700 cursor-pointer">
             {department} • {passOutYear}
          </p>
        </div>
      </div>

      {/* Rating & Package Row */}
      <div className="flex items-center justify-between mb-8 px-2 relative z-10">
        <div className="flex items-center gap-1.5 cursor-pointer bg-amber-50/50 px-3 py-1.5 rounded-xl border border-amber-100/50">
          <div className="flex gap-0.5 cursor-pointer">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={`cursor-pointer ${i < experienceRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-slate-900 text-xs font-black cursor-pointer">{experienceRating}/5</span>
        </div>
        
        {experiencePackage && (
          <div className="flex items-center gap-2 cursor-pointer bg-indigo-50/50 px-4 py-1.5 rounded-xl border border-indigo-100/50">
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider cursor-pointer">Package:</span>
            <span className="text-sm text-indigo-600 font-black cursor-pointer">{experiencePackage}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onVote(_id, 'upvote'); }}
            className="flex items-center gap-2.5 text-slate-400 hover:text-green-600 transition-all font-black text-sm cursor-pointer group/up"
          >
            <div className="p-3 bg-slate-50 rounded-2xl group-hover/up:bg-green-50 group-hover/up:text-green-600 transition-all cursor-pointer border border-transparent group-hover/up:border-green-100 shadow-sm">
              <FaThumbsUp className="cursor-pointer group-active/up:scale-125 transition-transform" />
            </div>
            <span className="cursor-pointer min-w-[12px]">{votes?.upvotes || 0}</span>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onVote(_id, 'downvote'); }}
            className="flex items-center gap-2.5 text-slate-400 hover:text-red-600 transition-all font-black text-sm cursor-pointer group/down"
          >
            <div className="p-3 bg-slate-50 rounded-2xl group-hover/down:bg-red-50 group-hover/down:text-red-600 transition-all cursor-pointer border border-transparent group-hover/down:border-red-100 shadow-sm">
              <FaThumbsDown className="cursor-pointer group-active/down:scale-125 transition-transform" />
            </div>
            <span className="cursor-pointer min-w-[12px]">{votes?.downvotes || 0}</span>
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/company-insights/${_id}`); }}
          className="flex items-center gap-3 bg-slate-900 text-white px-7 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 cursor-pointer shadow-xl shadow-slate-200 group/btn"
        >
          <span className="cursor-pointer">View Details</span>
          <ChevronRight size={16} className="cursor-pointer group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default InterviewExperienceCard;