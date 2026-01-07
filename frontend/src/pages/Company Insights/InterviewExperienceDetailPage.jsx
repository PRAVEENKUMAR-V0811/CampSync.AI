// // src/components/InterviewExperienceDetailPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaArrowLeft, FaSpinner, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
// import { format } from 'date-fns';
// import { API_BASE_URL } from '../../api';

// const InterviewExperienceDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [experience, setExperience] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchExperience = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch detailed interview experience.');
//       }
//       const data = await response.json();
//       setExperience(data);
//     } catch (err) {
//       console.error('Error fetching detailed experience:', err);
//       setError('Could not load experience details. It might not exist or there was a network error.');
//       toast.error('Failed to load experience details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExperience();
//   }, [id]);

//   const handleVote = async (type) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/experiences/${id}/${type}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${type} experience.`);
//       }

//       const updatedExperience = await response.json();
//       setExperience(updatedExperience.experience); // Update with the new vote counts
//       toast.success(`Experience ${type}d successfully!`);
//     } catch (err) {
//       console.error(`Error ${type}ing experience:`, err);
//       toast.error(`Failed to ${type}. Please try again.`);
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//           <FaSpinner className="animate-spin text-indigo-500 text-5xl mb-4" />
//           <p className="text-xl text-indigo-600">Loading experience details...</p>
//         </div>
         
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//           <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg border border-red-200 shadow-md">
//             <p className="text-2xl font-semibold mb-3">{error}</p>
//             <button
//               onClick={() => navigate('/company-insights')}
//               className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center mx-auto"
//             >
//               <FaArrowLeft className="mr-2" /> Back to Insights
//             </button>
//           </div>
//         </div>
         
//       </div>
//     );
//   }

//   if (!experience) {
//     return (
//       <div>
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//             <div className="text-center text-gray-600 p-8 bg-white rounded-lg border border-gray-200 shadow-md">
//                 <p className="text-2xl font-semibold mb-3">Experience Not Found</p>
//                 <p className="text-lg">The interview experience you are looking for does not exist.</p>
//                 <button
//                     onClick={() => navigate('/company-insights')}
//                     className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center mx-auto"
//                 >
//                     <FaArrowLeft className="mr-2" /> Back to Insights
//                 </button>
//             </div>
//         </div>
         
//       </div>
//     );
//   }

//   const {
//     name, anonymous, passOutYear, department, yearOfStudy,
//     companyName, interviewType, role, package: experiencePackage,
//     focusSkills, roundsFaced, otherRound, unexpectedQuestions,
//     codingQuestions, interviewTopics, comfortLevel, outcome,
//     feedback, resources, experienceRating, additionalComments,
//     createdAt, votes
//   } = experience;

//   const displayRounds = roundsFaced.includes("Other") ? [...roundsFaced.filter(r => r !== "Other"), otherRound] : roundsFaced;

//   return (
//     <div>
//       <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center py-10 px-4 md:px-8">
//         <Toaster />
//         <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-200">
//           <button
//             onClick={() => navigate('/company-insights')}
//             className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-200 mb-6 font-semibold"
//           >
//             <FaArrowLeft className="mr-2" /> Back to Company Insights
//           </button>

//           <div className="border-b-2 border-indigo-200 pb-4 mb-6">
//             <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
//               {companyName} - {role}
//             </h1>
//             <p className="text-xl text-gray-700">
//               <span className="font-semibold">Candidate:</span>{" "}
//               {anonymous === "Yes" ? "Anonymous" : name} ({department}, {yearOfStudy} - {passOutYear})
//             </p>
//             <p className="text-md text-gray-600 mt-1">
//               Shared on: {format(new Date(createdAt), 'MMM dd, yyyy')}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
//             <div>
//               <p className="font-semibold text-gray-700">Interview Type:</p>
//               <p className="text-gray-600">{interviewType}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-gray-700">Package:</p>
//               <p className="text-gray-600">{experiencePackage}</p>
//             </div>
//             <div>
//                 <p className="font-semibold text-gray-700">Overall Experience Rating:</p>
//                 <div className="flex items-center">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                     <svg
//                         key={i}
//                         className={`w-5 h-5 ${i < experienceRating ? 'text-yellow-400' : 'text-gray-300'}`}
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                     >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                     ))}
//                     <span className="ml-2 text-gray-700 font-bold">{experienceRating}/5</span>
//                 </div>
//             </div>
//             <div>
//                 <p className="font-semibold text-gray-700">Outcome:</p>
//                 <p className="text-gray-600">{outcome}</p>
//             </div>
//           </div>


//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">Experience Breakdown:</h3>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Focus Skills:</p>
//                 <p className="text-gray-800 leading-relaxed">{focusSkills}</p>
//             </div>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Rounds Faced:</p>
//                 <div className="flex flex-wrap gap-2">
//                     {displayRounds.map((round, index) => (
//                     <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
//                         {round}
//                     </span>
//                     ))}
//                 </div>
//             </div>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Unexpected Questions/Rounds:</p>
//                 <p className="text-gray-800 leading-relaxed">{unexpectedQuestions}</p>
//             </div>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Coding Questions/Topics:</p>
//                 <p className="text-gray-800 leading-relaxed">{codingQuestions}</p>
//             </div>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Interview Topics/Questions:</p>
//                 <p className="text-gray-800 leading-relaxed">{interviewTopics}</p>
//             </div>

//             <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                 <p className="font-semibold text-gray-700 mb-1">Comfort Level:</p>
//                 <p className="text-gray-800">{comfortLevel}</p>
//             </div>

//             {feedback && (
//                 <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                     <p className="font-semibold text-gray-700 mb-1">Feedback (if rejected):</p>
//                     <p className="text-gray-800 leading-relaxed">{feedback}</p>
//                 </div>
//             )}

//             {resources && (
//                 <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                     <p className="font-semibold text-gray-700 mb-1">Recommended Resources/Strategies:</p>
//                     <p className="text-gray-800 leading-relaxed">{resources}</p>
//                 </div>
//             )}

//             {additionalComments && (
//                 <div className="mb-4 bg-gray-50 p-4 rounded-md">
//                     <p className="font-semibold text-gray-700 mb-1">Additional Comments:</p>
//                     <p className="text-gray-800 leading-relaxed">{additionalComments}</p>
//                 </div>
//             )}
//             {/* The 'features' field is removed as per request for "no need to showcase the desired feature" */}
//           </div>

//           {/* Voting Section */}
//           <div className="flex items-center justify-center gap-6 mt-8 p-4 bg-indigo-50 rounded-lg shadow-inner">
//             <span className="text-lg font-semibold text-gray-800">Was this helpful?</span>
//             <button
//               onClick={() => handleVote('upvote')}
//               className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 shadow-sm"
//             >
//               <FaThumbsUp className="mr-2" /> {votes?.upvotes || 0}
//             </button>
//             <button
//               onClick={() => handleVote('downvote')}
//               className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-sm"
//             >
//               <FaThumbsDown className="mr-2" /> {votes?.downvotes || 0}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewExperienceDetailPage;

// src/components/InterviewExperienceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaArrowLeft, FaSpinner, FaThumbsUp, FaThumbsDown, FaCalendarAlt, FaUserTie, FaBriefcase, FaMoneyBillWave, FaLightbulb, FaCode, FaCommentDots } from 'react-icons/fa';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../api';

const InterviewExperienceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperience = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
      if (!response.ok) throw new Error('Failed to fetch detailed interview experience.');
      const data = await response.json();
      setExperience(data);
    } catch (err) {
      setError('Could not load experience details.');
      toast.error('Failed to load experience details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperience(); }, [id]);

  const handleVote = async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to ${type} experience.`);
      const updatedExperience = await response.json();
      setExperience(updatedExperience.experience);
      toast.success(`Experience ${type}d successfully!`);
    } catch (err) {
      toast.error(`Failed to ${type}. Please try again.`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
      <p className="text-lg font-medium text-slate-600">Fetching experience details...</p>
    </div>
  );

  if (error || !experience) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-red-500 text-5xl mb-4 flex justify-center">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || "Experience Not Found"}</h2>
        <button onClick={() => navigate('/company-insights')} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-2">
          <FaArrowLeft /> Back to Insights
        </button>
      </div>
    </div>
  );

  const {
    name, anonymous, passOutYear, department, yearOfStudy, companyName, interviewType, 
    role, package: experiencePackage, focusSkills, roundsFaced, otherRound, 
    unexpectedQuestions, codingQuestions, interviewTopics, comfortLevel, outcome,
    feedback, resources, experienceRating, additionalComments, createdAt, votes
  } = experience;

  const displayRounds = roundsFaced.includes("Other") ? [...roundsFaced.filter(r => r !== "Other"), otherRound] : roundsFaced;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/company-insights')}
          className="group flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium cursor-pointer"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Company Insights
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 md:p-10 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {companyName} <span className="text-indigo-600 font-medium">/ {role}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    <FaUserTie className="text-indigo-500" /> {anonymous === "Yes" ? "Anonymous" : name}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    <FaCalendarAlt className="text-indigo-500" /> {format(new Date(createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-center ${outcome === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {outcome}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Interview Type', value: interviewType, icon: <FaBriefcase className="text-blue-500" /> },
                { label: 'Package', value: experiencePackage, icon: <FaMoneyBillWave className="text-emerald-500" /> },
                { label: 'Department', value: department, icon: <FaUserTie className="text-orange-500" /> },
                { label: 'Class', value: `${yearOfStudy} (${passOutYear})`, icon: <FaCalendarAlt className="text-purple-500" /> },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="mb-2">{stat.icon}</div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-slate-800 font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <span className="font-bold text-indigo-900">Experience Rating:</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < experienceRating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 font-black text-indigo-700">{experienceRating}/5</span>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-8">
              <Section title="Focus Skills" icon={<FaLightbulb />} content={focusSkills} />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-sm tracking-widest">
                  <FaBriefcase /> Rounds Faced
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayRounds.map((round, index) => (
                    <span key={index} className="bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                      {round}
                    </span>
                  ))}
                </div>
              </div>

              <Section title="Coding Questions" icon={<FaCode />} content={codingQuestions} />
              <Section title="Interview Topics" icon={<FaCommentDots />} content={interviewTopics} />
              <Section title="Unexpected Questions" icon={<FaLightbulb />} content={unexpectedQuestions} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resources && <Section title="Recommended Resources" icon={<FaLightbulb />} content={resources} />}
                {additionalComments && <Section title="Additional Comments" icon={<FaCommentDots />} content={additionalComments} />}
              </div>
            </div>

            {/* Voting Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
              <h4 className="text-xl font-bold text-slate-800">Was this helpful?</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote('upvote')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-green-500 hover:text-green-600 rounded-2xl transition-all font-bold cursor-pointer group shadow-sm"
                >
                  <FaThumbsUp className="group-active:scale-125 transition-transform" /> {votes?.upvotes || 0}
                </button>
                <button
                  onClick={() => handleVote('downvote')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-red-500 hover:text-red-600 rounded-2xl transition-all font-bold cursor-pointer group shadow-sm"
                >
                  <FaThumbsDown className="group-active:scale-125 transition-transform" /> {votes?.downvotes || 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, content }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-sm tracking-widest">
      {icon} {title}
    </div>
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
      {content}
    </div>
  </div>
);

export default InterviewExperienceDetailPage;