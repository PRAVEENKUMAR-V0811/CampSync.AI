import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faSearch, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../api';

const QuestionBank = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    exam_name: '',
    year: '',
  });

  const fetchApprovedPapers = async () => {
    setLoading(true);
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
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to fetch question papers. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching approved papers:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedPapers();
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApprovedPapers();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-28">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading question bank...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-28 px-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
          <strong className="block text-xl font-bold text-gray-900 mb-2">Error!</strong>
          <span className="text-gray-600"> {error}</span>
          <button onClick={() => window.location.reload()} className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold cursor-pointer hover:bg-gray-800 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    // Added pt-28 to avoid header overlap
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Question Bank
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Browse and download a wide collection of approved question papers. Use the filters below to find exactly what you need.
          </p>
        </header>

        {/* Search and Filter Section - Refined Glassmorphism Style */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-gray-100 mb-12">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 ml-1">
                Search Database
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                  placeholder="Title, Subject, or Tags..."
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none cursor-text"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label htmlFor="exam_name" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Exam Name</label>
              <input
                type="text"
                name="exam_name"
                id="exam_name"
                value={filters.exam_name}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none cursor-text"
                placeholder="Midterm, GATE"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Year</label>
              <input
                type="number"
                name="year"
                id="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none cursor-text"
                placeholder="2024"
              />
            </div>
          </form>
        </div>

        {papers.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
               <FontAwesomeIcon icon={faFolderOpen} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">No Papers Found</p>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any approved papers matching your current filters. Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {papers.map((paper) => (
              <div 
                key={paper._id} 
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faFilePdf} />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                        {paper.year}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2" title={paper.title}>
                    {paper.title}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-tight">{paper.subject}</p>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{paper.exam_name}</p>
                  </div>

                  {paper.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {paper.description}
                    </p>
                  )}
                  
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {paper.tags.map((tag, index) => (
                        <span key={index} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-tighter">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50/80 px-8 py-5 flex justify-between items-center backdrop-blur-sm border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Added on</span>
                    <span className="text-xs font-bold text-gray-600">
                      {format(new Date(paper.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <a
                    href={paper.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all cursor-pointer group/btn active:scale-95"
                    download={paper.original_filename}
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2 group-hover/btn:animate-bounce" /> 
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;