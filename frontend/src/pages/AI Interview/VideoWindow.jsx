import React, { useEffect, useRef } from 'react';
import { Cpu, Aperture, UserCheck } from 'lucide-react';

const VideoWindow = ({ type, isAISpeaking, stream, transcript }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (type === 'user' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [type, stream]);

  return (
    <div className={`relative h-full w-full bg-[#020617] rounded-[2rem] border transition-all duration-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer
      ${type === 'ai' && isAISpeaking ? 'border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]' : 'border-white/5'}`}>
      
      {type === 'user' ? (
        <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror brightness-90" />
            
            {transcript && (
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 z-30 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs text-emerald-300 font-medium text-center italic">
                  <span className="opacity-50 mr-2">●</span> {transcript}
                </p>
              </div>
            )}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
              <UserCheck size={12} /> Candidate
            </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020617]">
          <div className="relative flex flex-col items-center justify-center">
            {isAISpeaking && <div className="absolute w-64 h-64 rounded-full border border-indigo-500/20 animate-pulse" />}
            
            <div className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-slate-900 border-2 transition-all duration-500 
              ${isAISpeaking ? 'border-indigo-500' : 'border-white/10'}`}>
               <div className="flex gap-8 mb-4">
                  <div className={`w-3 h-3 rounded-full bg-indigo-400 ${isAISpeaking ? 'animate-bounce' : 'opacity-40'}`} />
                  <div className={`w-3 h-3 rounded-full bg-indigo-400 ${isAISpeaking ? 'animate-bounce' : 'opacity-40'}`} style={{animationDelay: '0.1s'}} />
               </div>
               <div className={`w-12 rounded-full bg-indigo-500 transition-all duration-150 ${isAISpeaking ? 'h-6 animate-pulse' : 'h-1 opacity-40'}`} />
               <Cpu size={24} className={`mt-4 transition-all ${isAISpeaking ? 'text-indigo-400' : 'text-slate-700'}`} />
            </div>
          </div>

          {transcript && isAISpeaking && (
            <div className="absolute inset-x-6 bottom-8 p-4 bg-indigo-500/10 backdrop-blur-xl border border-indigo-400/20 rounded-2xl animate-in zoom-in-95 z-30 shadow-2xl">
                <p className="text-indigo-100 text-[13px] leading-relaxed text-center font-medium italic">"{transcript}"</p>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-lg">
             <Aperture size={12} /> AI Interrogator
          </div>
        </div>
      )}
      <style jsx>{` .mirror { transform: scaleX(-1); } `}</style>
    </div>
  );
};

export default VideoWindow;