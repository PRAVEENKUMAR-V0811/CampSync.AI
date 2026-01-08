// frontend/src/components/Interview/FeedbackReport.jsx
import React from 'react';
import { CheckCircle, Award, BarChart3, ArrowLeft, AlertCircle } from 'lucide-react';

const FeedbackReport = ({ data, onBack }) => {
  if (!data) return null;

  // Map the new JSON schema to display metrics
  const metrics = [
    { label: "Technical", value: data.technicalSkills },
    { label: "Communication", value: data.communicationSkills },
    { label: "Problem Solving", value: data.problemSolving },
    { label: "Coding Quality", value: data.codingQuality },
    { label: "Behavioral", value: data.behavioralSkills },
  ];

  return (
    <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-3xl animate-in fade-in zoom-in duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 font-black uppercase text-sm tracking-widest hover:text-white transition-colors cursor-pointer pb-5">
                <ArrowLeft size={18} /> Return to Dashboard
        </button>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Interview Summary</h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Comprehensive Performance Analysis</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="p-4 bg-indigo-600 rounded-3xl text-white font-black text-3xl shadow-xl shadow-indigo-500/20">
            {data.overallScore}%
            </div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Overall Score</span>
        </div>
      </div>

      {data.autoSubmitted && (
        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4">
            <AlertCircle className="text-rose-500" />
            <div>
                <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">Session Auto-Submitted</p>
                <p className="text-slate-300 text-sm">{data.autoSubmitReason}</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
            <div className="text-xl font-black text-white">{m.value}%</div>
            <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-tighter">
                <CheckCircle className="text-emerald-500" /> Key Strengths
            </h3>
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2rem]">
                <ul className="text-sm text-slate-300 space-y-3">
                {data.strengths?.map((s, i) => <li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                </ul>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-tighter">
                <Award className="text-rose-500" /> Areas to Improve
            </h3>
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2rem]">
                <ul className="text-sm text-slate-300 space-y-3">
                {data.areasForImprovement?.map((im, i) => <li key={i} className="flex gap-2"><span>•</span> {im}</li>)}
                </ul>
            </div>
        </div>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2rem] mb-12">
          <h4 className="text-indigo-400 font-black uppercase text-xs tracking-widest mb-4">Final Recommendation</h4>
          <p className="text-white text-lg font-bold italic mb-4">"{data.recommendation}"</p>
          <p className="text-slate-400 text-sm leading-relaxed">{data.summary}</p>
      </div>
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2rem] mb-12">
          <h4 className="text-white font-black text-xs tracking-widest italic text-lg">" Success in interviews is rarely luck; it is structured preparation. "</h4>
      </div>

      
    </div>
  );
};

export default FeedbackReport;