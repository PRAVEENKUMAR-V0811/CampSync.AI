import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faSearch, faFolderOpen, faEye, faTimes, faUpload, faUserClock, faGraduationCap, faShield, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Loader2 } from 'lucide-react'; 
import { API_BASE_URL } from '../../api';
import AuthContext from '../Auth/AuthContext';

const QuestionBank = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    exam_name: '',
    year: '',
  });

  const [previewData, setPreviewData] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  const fetchApprovedPapers = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.exam_name) queryParams.append('exam_name', filters.exam_name);
      if (filters.year) queryParams.append('year', filters.year);

      const response = await axios.get(`${API_BASE_URL}/api/question-papers?${queryParams.toString()}`);
      setPapers(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch question papers.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchApprovedPapers();
    }, 300); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApprovedPapers(true);
  };

  const getRoleStyles = (role) => {
    const r = role?.toLowerCase();
    if (r === 'admin') {
      return {
        border: 'border-indigo-200',
        bg: 'bg-indigo-50/40',
        accent: 'text-indigo-600',
        ribbon: 'bg-indigo-600',
        label: 'ADMIN',
        icon: faShield,
        hasRibbon: true
      };
    } else if (r === 'faculty') {
      return {
        border: 'border-emerald-200',
        bg: 'bg-emerald-50/40',
        accent: 'text-emerald-600',
        ribbon: 'bg-emerald-600',
        label: 'FACULTY',
        icon: faChalkboardTeacher,
        hasRibbon: true
      };
    } else {
      return {
        border: 'border-slate-200',
        bg: 'bg-white',
        accent: 'text-sky-600',
        label: 'STUDENT',
        icon: faGraduationCap,
        hasRibbon: false
      };
    }
  };

  const openPreview = (paper) => {
    setPreviewData(paper);
    setIsPreviewLoading(true);
  };

  if (loading && papers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-28">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg font-black text-gray-600 uppercase tracking-widest">Accessing Academic Bank...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tight">
              Academic Bank
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">
              Centralized Educational Resource Repository
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate("/my-uploads")}
                className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-sky-500 hover:text-sky-600 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <FontAwesomeIcon icon={faUserClock} /> My Uploads
              </button>
              
              <button 
                onClick={() => navigate("/academic-papers-upload")} 
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faUpload} /> Upload Resource
              </button>
          </div>
        </header>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 ml-1">Global Search</label>
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-700 font-bold placeholder:text-gray-400"
                  placeholder="Subject, Title or Exam Type..."
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-5 rounded-xl font-black text-xs cursor-pointer hover:bg-indigo-700 transition-all">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
            {['subject', 'exam_name', 'year'].map((f) => (
              <div key={f}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">{f.replace('_', ' ')}</label>
                <input 
                  type={f === 'year' ? 'number' : 'text'} 
                  name={f} 
                  value={filters[f]} 
                  onChange={handleFilterChange} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 outline-none font-bold focus:border-indigo-500 transition-all" 
                  placeholder={`Filter...`}
                />
              </div>
            ))}
          </form>
        </div>

        {/* DOCUMENTS GRID */}
        {papers.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
            <FontAwesomeIcon icon={faFolderOpen} className="text-5xl text-slate-200 mb-4" />
            <p className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Repository Empty</p>
            <p className="text-slate-400 font-bold text-sm">No documents match your current filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {papers.map((paper) => {
              const role = paper.uploaded_by_role || 'user';
              const styles = getRoleStyles(role);

              return (
                <div key={paper._id} className={`group relative overflow-hidden ${styles.bg} rounded-[2.5rem] border-2 ${styles.border} ${styles.hover} shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col`}>
                  
                  {/* RIBBON ONLY FOR ADMIN/FACULTY */}
                  {styles.hasRibbon && (
                    <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-10">
                        <div className={`absolute top-[20px] left-[-35px] w-[140px] ${styles.ribbon} text-white text-[9px] font-black py-1 shadow-lg text-center -rotate-45 uppercase tracking-[0.2em]`}>
                            {styles.label}
                        </div>
                    </div>
                  )}

                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 bg-white ${styles.accent} rounded-2xl flex items-center justify-center shadow-sm border border-slate-50`}>
                          <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                            {paper.year}
                        </span>
                        {/* STUDENT TAG (instead of ribbon) */}
                        {!styles.hasRibbon && (
                            <span className="text-[8px] font-black bg-sky-100 text-sky-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                Student Shared
                            </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {paper.title}
                    </h3>
                    
                    <div className="space-y-1 mb-6">
                      <p className={`text-xs font-black ${styles.accent} uppercase tracking-[0.1em] flex items-center gap-2`}>
                        <FontAwesomeIcon icon={styles.icon} className="text-[10px]" />
                        {paper.subject}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paper.exam_name}</p>
                    </div>

                    {paper.tags && paper.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {paper.tags.map((tag, index) => (
                          <span key={index} className="text-[9px] font-black bg-white/80 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-tighter">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/70 px-6 py-5 flex flex-col gap-4 border-t border-slate-100 backdrop-blur-md">
                    {/* Fixed Name Truncation to prevent overlapping */}
                    <div className="flex justify-between items-center gap-4 px-1">
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[8px] uppercase font-black text-slate-400 tracking-[0.15em] leading-none mb-1">Contributor</span>
                            <span className="text-xs font-black text-slate-600 truncate">
                                {paper.uploaded_by_user?.name || 'Anonymous'}
                            </span>
                        </div>
                        <button 
                            onClick={() => openPreview(paper)} 
                            className="shrink-0 text-indigo-600 hover:text-indigo-800 text-[10px] font-black flex items-center gap-2 transition-all cursor-pointer uppercase tracking-widest group/btn"
                        >
                            <FontAwesomeIcon icon={faEye} className="group-hover/btn:scale-125 transition-transform" /> Preview
                        </button>
                    </div>
                    
                    <a 
                      href={paper.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full inline-flex justify-center items-center px-5 py-3.5 bg-slate-900 text-white text-[10px] font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 cursor-pointer uppercase tracking-[0.2em]" 
                      download={paper.original_filename}
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-3" /> Download Paper
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewData && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md cursor-pointer" onClick={() => setPreviewData(null)}></div>
          <div className="relative bg-white w-full max-w-6xl h-full rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-5 min-w-0">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-black text-slate-900 text-sm md:text-lg truncate uppercase tracking-tight">{previewData.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{previewData.subject}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{previewData.year} Batch</span>
                        </div>
                    </div>
                </div>
                
                {/* ACTION BUTTONS IN HEADER */}
                <div className="flex items-center gap-3 ml-4">
                    <a 
                        href={previewData.file_url} 
                        download={previewData.original_filename}
                        className="hidden sm:flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
                    >
                        <FontAwesomeIcon icon={faDownload} /> Download
                    </a>
                    <button 
                        onClick={() => setPreviewData(null)} 
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Modal Body */}
            <div className="flex-grow bg-slate-100 relative">
                {isPreviewLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="mt-6 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Initializing Secure PDF Viewer</p>
                    </div>
                )}
                <iframe 
                    src={`${previewData.file_url}#toolbar=0&navpanes=0`} 
                    className={`w-full h-full border-none transition-opacity duration-700 ${isPreviewLoading ? 'opacity-0' : 'opacity-100'}`}
                    title="Document Preview"
                    onLoad={() => setIsPreviewLoading(false)}
                ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;