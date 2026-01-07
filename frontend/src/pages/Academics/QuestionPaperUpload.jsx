import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthContext from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import { FaCloudUploadAlt, FaFileAlt, FaTimesCircle } from 'react-icons/fa';

const QuestionPaperUpload = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!user || !user.token) {
    navigate('/login');
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, and DOCX files are allowed.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !subject || !examName || !year || !selectedFile) {
      toast.error('Please fill in all required fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subject', subject);
    formData.append('exam_name', examName);
    formData.append('year', year);
    formData.append('tags', tags);
    formData.append('questionPaperFile', selectedFile);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(`${API_BASE_URL}/api/question-papers/upload`, formData, config);

      toast.success('Question paper uploaded successfully! It is now awaiting admin approval.');
      setTitle('');
      setDescription('');
      setSubject('');
      setExamName('');
      setYear('');
      setTags('');
      setSelectedFile(null);
      if (e.target.elements.questionPaperFile) {
        e.target.elements.questionPaperFile.value = '';
      }

    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to upload question paper. Please try again.';
      
      if (err.response && err.response.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
        return;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    // Added pt-28 to clear the fixed header
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-indigo-600 p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Upload Question Paper
            </h2>
            <p className="text-indigo-100 max-w-md mx-auto">
              Share your question papers with the community. All uploads are subject to admin review and approval.
            </p>
          </div>

          <div className="p-8 md:p-12">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-8" role="alert">
                <FaTimesCircle className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 ml-1">
                    Paper Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    placeholder="e.g., Data Structures Midterm Exam"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Computer Science"
                    required
                  />
                </div>

                {/* Exam Name */}
                <div>
                  <label htmlFor="examName" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Exam Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="examName"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none"
                    placeholder="GATE 2023"
                    required
                  />
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="year" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none"
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none"
                    placeholder="algorithms, prep"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="Provide a brief description of the paper content..."
                ></textarea>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 ml-1">
                  Select Question Paper <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="questionPaperFile"
                  className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group ${
                    selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="space-y-2 text-center">
                    <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-colors ${
                      selectedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-400 group-hover:text-indigo-600'
                    }`}>
                      {selectedFile ? <FaFileAlt /> : <FaCloudUploadAlt />}
                    </div>
                    <div className="flex text-base font-bold text-gray-700">
                      <span className="text-indigo-600 group-hover:underline">Click to upload</span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs font-medium text-gray-400">
                      {selectedFile ? selectedFile.name : 'PDF, DOCX, DOC (Max 10MB)'}
                    </p>
                  </div>
                  <input
                    id="questionPaperFile"
                    name="questionPaperFile"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full flex justify-center py-4 px-6 rounded-2xl text-lg font-black transition-all shadow-xl active:scale-[0.98] cursor-pointer ${
                    uploading 
                      ? 'bg-slate-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </span>
                  ) : 'Upload Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperUpload;