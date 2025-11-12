// // src/components/CompanyInsightsPage.jsx
// import React, { useState, useEffect } from 'react';
// // import Header from '../Header'; // Adjust path
// // import Footer from '../Footer'; // Adjust path
// import InterviewExperienceCard from './InterviewExperienceCard'; // Adjust path
// import { Toaster, toast } from 'react-hot-toast';
// import { FaFilter, FaSearch, FaSpinner } from 'react-icons/fa'; // For icons

// const CompanyInsightsPage = () => {
//   const [experiences, setExperiences] = useState([]);
//   const [filteredExperiences, setFilteredExperiences] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchExperiences = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`http://localhost:5000/api/experiences${selectedCompany ? `?companyName=${selectedCompany}` : ''}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch interview experiences');
//       }
//       const data = await response.json();
//       setExperiences(data);
//       setFilteredExperiences(data); // Initialize filtered with all experiences
//     } catch (err) {
//       console.error('Error fetching experiences:', err);
//       setError('Could not load interview experiences. Please try again later.');
//       toast.error('Failed to load experiences.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUniqueCompanies = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/experiences/companies');
//       if (!response.ok) {
//         throw new Error('Failed to fetch unique companies');
//       }
//       const data = await response.json();
//       setCompanies(data);
//     } catch (err) {
//       console.error('Error fetching companies:', err);
//       toast.error('Failed to load company filter options.');
//     }
//   };

//   useEffect(() => {
//     fetchExperiences();
//     fetchUniqueCompanies();
//   }, [selectedCompany]); // Refetch when selectedCompany changes

//   useEffect(() => {
//     // Apply search term filtering to the currently fetched experiences
//     const lowerCaseSearchTerm = searchTerm.toLowerCase();
//     const results = experiences.filter(exp =>
//       exp.companyName.toLowerCase().includes(lowerCaseSearchTerm) ||
//       exp.role.toLowerCase().includes(lowerCaseSearchTerm) ||
//       exp.focusSkills.toLowerCase().includes(lowerCaseSearchTerm) ||
//       exp.interviewTopics.toLowerCase().includes(lowerCaseSearchTerm) ||
//       (exp.anonymous === "No" && exp.name.toLowerCase().includes(lowerCaseSearchTerm))
//     );
//     setFilteredExperiences(results);
//   }, [searchTerm, experiences]); // Re-filter when search term or experiences change

//   const handleCompanyChange = (e) => {
//     setSelectedCompany(e.target.value);
//     setSearchTerm(''); // Clear search when company filter changes
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div>
//       {/* <Header /> */}
//       <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center py-10 px-4 md:px-8">
//         <Toaster />
//         <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-200">
//           <h1 className="text-5xl font-extrabold mb-8 text-center text-indigo-700">
//             Company Insights
//           </h1>

//           {/* Filter and Search Section */}
//           <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-indigo-50 rounded-lg shadow-sm">
//             <div className="flex-1 relative">
//               <label htmlFor="company-filter" className="sr-only">Filter by Company</label>
//               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <select
//                 id="company-filter"
//                 value={selectedCompany}
//                 onChange={handleCompanyChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm appearance-none"
//               >
//                 <option value="">All Companies</option>
//                 {companies.map((company) => (
//                   <option key={company} value={company}>
//                     {company}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex-1 relative">
//               <label htmlFor="search-input" className="sr-only">Search Experiences</label>
//               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 id="search-input"
//                 placeholder="Search by company, role, skills..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <FaSpinner className="animate-spin text-indigo-500 text-4xl mr-3" />
//               <p className="text-xl text-indigo-600">Loading experiences...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg border border-red-200">
//               <p className="text-xl font-semibold">{error}</p>
//               <p className="mt-2">Please check your network connection or try again later.</p>
//             </div>
//           ) : filteredExperiences.length === 0 ? (
//             <div className="text-center text-gray-600 p-6 bg-gray-50 rounded-lg border border-gray-200">
//               <p className="text-2xl font-semibold mb-2">No Interview Experiences Found</p>
//               <p className="text-lg">
//                 {selectedCompany
//                   ? `There are no experiences for "${selectedCompany}" yet.`
//                   : searchTerm
//                   ? `No experiences match your search term "${searchTerm}".`
//                   : "Be the first to share an experience!"}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredExperiences.map((experience) => (
//                 <InterviewExperienceCard key={experience._id} experience={experience} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default CompanyInsightsPage;


// src/components/CompanyInsightsPage.jsx
import React, { useState, useEffect } from 'react';
import InterviewExperienceCard from './InterviewExperienceCard'; // Adjust path
import { Toaster, toast } from 'react-hot-toast';
import { FaFilter, FaSearch, FaSpinner } from 'react-icons/fa'; // For icons

const CompanyInsightsPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/experiences${selectedCompany ? `?companyName=${selectedCompany}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interview experiences');
      }
      const data = await response.json();
      setExperiences(data);
      setFilteredExperiences(data); // Initialize filtered with all experiences
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Could not load interview experiences. Please try again later.');
      toast.error('Failed to load experiences.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniqueCompanies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/experiences/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch unique companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load company filter options.');
    }
  };

  useEffect(() => {
    fetchExperiences();
    fetchUniqueCompanies();
  }, [selectedCompany]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = experiences.filter(exp =>
      exp.companyName.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.role.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.focusSkills.toLowerCase().includes(lowerCaseSearchTerm) ||
      exp.interviewTopics.toLowerCase().includes(lowerCaseSearchTerm) ||
      (exp.anonymous === "No" && exp.name.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredExperiences(results);
  }, [searchTerm, experiences]);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // New: Handle voting directly from this page for immediate UI update
  const handleVote = async (experienceId, type) => {
    try {
      const response = await fetch(`http://localhost:5000/api/experiences/${experienceId}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${type} experience.`);
      }

      const updatedData = await response.json();
      // Update the experiences state to reflect the new vote count
      setExperiences(prevExperiences =>
        prevExperiences.map(exp =>
          exp._id === experienceId ? updatedData.experience : exp
        )
      );
      toast.success(`${type}d successfully!`);
    } catch (err) {
      console.error(`Error ${type}ing experience:`, err);
      toast.error(`Failed to ${type}. Please try again.`);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center py-10 px-4 md:px-8">
        <Toaster />
        <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-200">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-indigo-700">
            Company Insights
          </h1>

          {/* Filter and Search Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-indigo-50 rounded-lg shadow-sm">
            <div className="flex-1 relative">
              <label htmlFor="company-filter" className="sr-only">Filter by Company</label>
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                id="company-filter"
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm appearance-none"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative">
              <label htmlFor="search-input" className="sr-only">Search Experiences</label>
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="search-input"
                placeholder="Search by company, role, skills..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-indigo-500 text-4xl mr-3" />
              <p className="text-xl text-indigo-600">Loading experiences...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xl font-semibold">{error}</p>
              <p className="mt-2">Please check your network connection or try again later.</p>
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center text-gray-600 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-semibold mb-2">No Interview Experiences Found</p>
              <p className="text-lg">
                {selectedCompany
                  ? `There are no experiences for "${selectedCompany}" yet.`
                  : searchTerm
                  ? `No experiences match your search term "${searchTerm}".`
                  : "Be the first to share an experience!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredExperiences.map((experience) => (
                <InterviewExperienceCard
                  key={experience._id}
                  experience={experience}
                  onVote={handleVote} // Pass the voting function
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInsightsPage;