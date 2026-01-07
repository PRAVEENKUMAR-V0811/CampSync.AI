import React from 'react';
import { format } from 'date-fns';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Target, TrendingUp, ChevronRight, Star } from 'lucide-react';

const InterviewExperienceCard = ({ experience, onVote }) => {
  const navigate = useNavigate();
  const {
    _id,
    name, anonymous, department, yearOfStudy, passOutYear,
    companyName, interviewType, role, package: experiencePackage,
    outcome, experienceRating, createdAt, votes
  } = experience;

  const handleViewMore = () => {
    navigate(`/company-insights/${_id}`);
  };

  return (
    <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-white p-6 md:p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-2">
            {interviewType}
          </div>
          <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {companyName}
          </h2>
          <p className="text-slate-500 font-bold">{role}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-slate-400 text-xs font-medium mb-1">
            <Calendar size={12} className="mr-1" />
            {format(new Date(createdAt), 'MMM dd, yyyy')}
          </div>
          <div className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter shadow-sm ${
            outcome?.toLowerCase() === 'selected' || outcome?.toLowerCase() === 'placed'
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-100 text-slate-500'
          }`}>
            {outcome}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
          <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <User size={12} className="mr-1" /> Candidate
          </div>
          <p className="text-xs font-black text-slate-700 truncate">
            {anonymous === "Yes" ? "Anonymous Student" : name}
          </p>
        </div>
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
          <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Target size={12} className="mr-1" /> Batch
          </div>
          <p className="text-xs font-black text-slate-700">
             {department} • {passOutYear}
          </p>
        </div>
      </div>

      {/* Rating & Package Row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${i < experienceRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
            />
          ))}
          <span className="ml-1 text-slate-900 text-sm font-black">{experienceRating}/5</span>
        </div>
        
        {experiencePackage && (
          <div className="flex items-center text-indigo-600 font-black">
            <span className="text-xs mr-1 text-slate-400 font-bold uppercase">Package:</span>
            <span className="text-sm">{experiencePackage}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onVote(_id, 'upvote')}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-sm cursor-pointer group/btn"
          >
            <div className="p-2 bg-slate-50 rounded-xl group-hover/btn:bg-emerald-50 transition-colors">
              <FaThumbsUp />
            </div>
            <span>{votes?.upvotes || 0}</span>
          </button>
          
          <button
            onClick={() => onVote(_id, 'downvote')}
            className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors font-bold text-sm cursor-pointer group/btn"
          >
            <div className="p-2 bg-slate-50 rounded-xl group-hover/btn:bg-red-50 transition-colors">
              <FaThumbsDown />
            </div>
            <span>{votes?.downvotes || 0}</span>
          </button>
        </div>

        <button
          onClick={handleViewMore}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95 cursor-pointer"
        >
          <span>View More</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default InterviewExperienceCard;