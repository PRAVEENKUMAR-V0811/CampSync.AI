import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCcw, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden text-slate-100 font-sans">
      
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        
        {/* Floating Icon */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-32 h-32 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-indigo-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Search size={60} className="text-indigo-500 relative z-10" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 text-rose-500"
          >
            <AlertCircle size={32} />
          </motion.div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12rem] font-black leading-none tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-black uppercase tracking-widest mb-4">
            Not found
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-12 font-medium leading-relaxed">
            The page you are looking for has been relocated or deleted from the mainframe. Please re-check the URL you entered.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-50 transition-all cursor-pointer shadow-xl"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Return to Mainframe
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="group flex items-center gap-3 px-8 py-4 bg-slate-900/50 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            Refresh Browser
          </button>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Online</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em]">Error Code: CS_VOID_0x04</span>
      </div>
    </div>
  );
};

export default NotFound;