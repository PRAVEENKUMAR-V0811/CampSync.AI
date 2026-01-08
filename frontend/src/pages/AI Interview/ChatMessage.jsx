import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Cpu, Activity } from 'lucide-react'; // Added missing imports

const ChatMessage = ({ text, isUserMessage }) => {
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} w-full group animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] px-6 py-5 rounded-[2rem] shadow-2xl border relative transition-all
        ${isUserMessage 
          ? 'bg-slate-900 border-white/10 text-slate-200 rounded-tr-none' 
          : 'bg-indigo-600 border-indigo-400/30 text-white rounded-tl-none shadow-indigo-500/20'}`}
      >
        <div className={`flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest ${isUserMessage ? 'text-indigo-400' : 'text-indigo-200'}`}>
          {isUserMessage ? <Activity size={12} /> : <Cpu size={12} />}
          {isUserMessage ? 'Candidate Transcript' : 'AI Interrogator'}
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-relaxed font-medium">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;