import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../Auth/AuthContext';
import { API_BASE_URL } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, XCircle, Clock, 
  AlertCircle, Eye, Info, BookOpen, GraduationCap, 
  Layers, Calendar, ChevronRight, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyUploads = () => {
  const { user } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/question-papers/my-uploads`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) { 
      toast.error("Database connection error"); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredData = uploads.filter(doc => doc.status === activeTab);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Resource Vault...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans antialiased">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-widest">Student Portal</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{uploads.length} Total Contributions</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Resource Tracking</h1>
            <p className="text-slate-500 font-medium max-w-md">Monitor the approval lifecycle and receive direct feedback from faculty on your submissions.</p>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex bg-slate-200/60 backdrop-blur-sm p-1.5 rounded-[2rem] gap-1 shadow-inner border border-white">
            {['Pending', 'Approved', 'Rejected'].map(status => (
              <button 
                key={status} 
                onClick={() => setActiveTab(status)} 
                className={`relative px-8 py-3 rounded-[1.5rem] text-xs font-black transition-all duration-300 ${
                    activeTab === status ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
                {uploads.filter(d => d.status === status).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        {uploads.filter(d => d.status === status).length}
                    </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* CONTENT GRID */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredData.map((doc) => (
              <div key={doc._id} className="bg-white group rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 overflow-hidden">
                <div className="p-8">
                  {/* CARD TOP */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl shadow-inner ${
                        activeTab === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                        activeTab === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-amber-50 text-amber-600'
                    }`}>
                      {activeTab === 'Approved' ? <CheckCircle size={24}/> : 
                       activeTab === 'Rejected' ? <XCircle size={24}/> : 
                       <Clock size={24} className="animate-pulse" />}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Uploaded On</p>
                        {/* FORMATTED DATE: DD/MM/YYYY */}
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                        </p>
                    </div>
                  </div>

                  {/* INFO SECTION */}
                  <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><BookOpen size={14}/></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter leading-none">Subject</p>
                            <p className="text-xs font-bold text-slate-600">{doc.subject}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><GraduationCap size={14}/></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter leading-none">Category</p>
                            <p className="text-xs font-bold text-slate-600">{doc.exam_name} ({doc.year})</p>
                        </div>
                    </div>
                  </div>
                  
                  {/* REJECTION FEEDBACK - VISIBLE IN UI */}
                  {activeTab === 'Rejected' && doc.rejection_reason && (
                    <div className="mt-8 p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100 relative overflow-hidden group/feedback">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/feedback:opacity-20 transition-opacity">
                        <MessageCircle size={40} className="text-rose-900"/>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                        <AlertCircle size={14}/> Faculty Rejection Reason
                      </div>
                      <p className="text-xs font-bold text-rose-700 leading-relaxed italic relative z-10">
                        "{doc.rejection_reason}"
                      </p>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTION */}
                <div className="px-8 pb-8">
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    <Eye size={16}/> Preview Document
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* EMPTY STATE */}
        {filteredData.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-12 p-32 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 shadow-inner"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Layers size={40}/>
            </div>
            <p className="font-black text-slate-300 tracking-[0.3em] uppercase text-xs">No resources currently in {activeTab} status</p>
            <p className="text-slate-400 text-sm mt-2 font-medium">Your contributions help the entire community grow.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyUploads;