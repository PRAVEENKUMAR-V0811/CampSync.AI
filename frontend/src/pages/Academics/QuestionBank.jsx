// src/pages/Academics/QuestionBank.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns'; // For date formatting
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
  }, [searchTerm, filters]); // Re-fetch when search term or filters change

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApprovedPapers(); // Trigger fetch with current searchTerm
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading question bank...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Question Bank
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Browse and download a wide collection of approved question papers. Use the filters below to find what you need.
        </p>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search by Title, Description, Subject, Exam Name, Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 px-3 py-2"
                  placeholder="e.g., Data Structures, GATE, 2023"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label htmlFor="exam_name" className="block text-sm font-medium text-gray-700">Exam Name</label>
              <input
                type="text"
                name="exam_name"
                id="exam_name"
                value={filters.exam_name}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., Midterm, GATE"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                id="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 2023"
              />
            </div>
          </form>
        </div>


        {papers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600">No approved question papers found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {papers.map((paper) => (
              <div key={paper._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={paper.title}>
                    {paper.title}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-1">{paper.subject}</p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">{paper.exam_name}</span> - {paper.year}
                  </p>
                  {paper.description && (
                    <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                      {paper.description}
                    </p>
                  )}
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {paper.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Uploaded: {format(new Date(paper.createdAt), 'dd MMM yyyy')}
                  </span>
                  <a
                    href={paper.file_url} // This will be the Cloudinary URL or your static server URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    download={paper.original_filename} // Suggest original filename for download
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
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