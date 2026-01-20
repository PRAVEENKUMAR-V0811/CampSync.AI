import React from 'react';
import { Clock, ShieldAlert, Loader2, ArrowRightCircle } from 'lucide-react';

const PlacementUpdateOverlay = ({ endTime, message }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-white p-10 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Decorative Background Icon */}
        <ShieldAlert className="absolute -right-10 -bottom-10 text-slate-50 w-64 h-64 rotate-12" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Clock size={40} className="animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
            Placement Records Update in Progress
          </h2>
          
          <p className="text-slate-500 font-bold leading-relaxed mb-8 px-6">
            {message}
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center gap-2 mb-10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Completion</span>
            <span className="text-xl font-black text-indigo-600">
              {new Date(endTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-indigo-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-xs font-black uppercase tracking-widest">System Synchronizing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementUpdateOverlay;