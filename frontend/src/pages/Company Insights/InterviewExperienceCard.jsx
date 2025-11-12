// // src/components/InterviewExperienceCard.jsx
// import React from 'react';
// import { format } from 'date-fns';

// const InterviewExperienceCard = ({ experience }) => {
//   const {
//     name, anonymous, passOutYear, department, yearOfStudy,
//     companyName, interviewType, role, package: experiencePackage,
//     focusSkills, roundsFaced, otherRound, unexpectedQuestions,
//     codingQuestions, interviewTopics, comfortLevel, outcome,
//     feedback, resources, features, experienceRating, additionalComments,
//     createdAt
//   } = experience;

//   const displayRounds = roundsFaced.includes("Other") ? [...roundsFaced.filter(r => r !== "Other"), otherRound] : roundsFaced;

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
//       <div className="flex justify-between items-start mb-4">
//         <h2 className="text-2xl font-bold text-indigo-700">
//           {companyName} - {role}
//         </h2>
//         <span className="text-sm text-gray-500">
//           {format(new Date(createdAt), 'MMM dd, yyyy')}
//         </span>
//       </div>

//       <p className="text-gray-700 mb-2">
//         <span className="font-semibold">Candidate:</span>{" "}
//         {anonymous === "Yes" ? "Anonymous" : name} ({department}, {yearOfStudy} - {passOutYear})
//       </p>
//       <p className="text-gray-700 mb-2">
//         <span className="font-semibold">Interview Type:</span> {interviewType}
//       </p>
//       {experiencePackage && (
//         <p className="text-gray-700 mb-2">
//           <span className="font-semibold">Package:</span> {experiencePackage}
//         </p>
//       )}

//       <div className="mt-4 border-t border-gray-200 pt-4">
//         <h3 className="text-xl font-semibold text-gray-800 mb-3">Experience Details:</h3>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Focus Skills:</p>
//           <p className="text-gray-600">{focusSkills}</p>
//         </div>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Rounds Faced:</p>
//           <div className="flex flex-wrap gap-2">
//             {displayRounds.map((round, index) => (
//               <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                 {round}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Unexpected Questions/Rounds:</p>
//           <p className="text-gray-600">{unexpectedQuestions}</p>
//         </div>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Coding Questions/Topics:</p>
//           <p className="text-gray-600">{codingQuestions}</p>
//         </div>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Interview Topics/Questions:</p>
//           <p className="text-gray-600">{interviewTopics}</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-3">
//           <div>
//             <p className="font-semibold text-gray-700">Comfort Level:</p>
//             <p className="text-gray-600">{comfortLevel}</p>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-700">Outcome:</p>
//             <p className="text-gray-600">{outcome}</p>
//           </div>
//         </div>

//         {feedback && (
//           <div className="mb-3">
//             <p className="font-semibold text-gray-700">Feedback (if rejected):</p>
//             <p className="text-gray-600">{feedback}</p>
//           </div>
//         )}

//         {resources && (
//           <div className="mb-3">
//             <p className="font-semibold text-gray-700">Recommended Resources/Strategies:</p>
//             <p className="text-gray-600">{resources}</p>
//           </div>
//         )}

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Desired Platform Features:</p>
//           <p className="text-gray-600">{features}</p>
//         </div>

//         <div className="mb-3">
//           <p className="font-semibold text-gray-700">Overall Experience Rating:</p>
//           <div className="flex items-center">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <svg
//                 key={i}
//                 className={`w-5 h-5 ${i < experienceRating ? 'text-yellow-400' : 'text-gray-300'}`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             ))}
//             <span className="ml-2 text-gray-700 font-bold">{experienceRating}/5</span>
//           </div>
//         </div>

//         {additionalComments && (
//           <div className="mb-3">
//             <p className="font-semibold text-gray-700">Additional Comments:</p>
//             <p className="text-gray-600">{additionalComments}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewExperienceCard;

// src/components/InterviewExperienceCard.jsx
import React from 'react';
import { format } from 'date-fns';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InterviewExperienceCard = ({ experience, onVote }) => { // onVote prop added
  const navigate = useNavigate();
  const {
    _id, // Important for navigation and voting
    name, anonymous, department, yearOfStudy, passOutYear,
    companyName, interviewType, role, package: experiencePackage,
    outcome, experienceRating, createdAt, votes
  } = experience;

  const handleViewMore = () => {
    navigate(`/company-insights/${_id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-2xl font-bold text-indigo-700 flex-1 pr-4">
          {companyName} - {role}
        </h2>
        <span className="text-sm text-gray-500 flex-shrink-0">
          {format(new Date(createdAt), 'MMM dd, yyyy')}
        </span>
      </div>

      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Candidate:</span>{" "}
        {anonymous === "Yes" ? "Anonymous" : name} ({department}, {yearOfStudy} - {passOutYear})
      </p>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Interview Type:</span> {interviewType}
      </p>
      {experiencePackage && (
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Package:</span> {experiencePackage}
        </p>
      )}
      <p className="text-gray-700 mb-3">
        <span className="font-semibold">Outcome:</span> {outcome}
      </p>

      {/* Rating Display */}
      <div className="flex items-center mb-4">
        <p className="font-semibold text-gray-700 mr-2">Rating:</p>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < experienceRating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-700 text-sm font-bold">{experienceRating}/5</span>
        </div>
      </div>

      {/* Voting and View More */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote(_id, 'upvote')}
            className="flex items-center text-green-600 hover:text-green-700 transition duration-200"
            aria-label="Upvote"
          >
            <FaThumbsUp className="mr-1" /> {votes?.upvotes || 0}
          </button>
          <button
            onClick={() => onVote(_id, 'downvote')}
            className="flex items-center text-red-600 hover:text-red-700 transition duration-200"
            aria-label="Downvote"
          >
            <FaThumbsDown className="mr-1" /> {votes?.downvotes || 0}
          </button>
        </div>
        <button
          onClick={handleViewMore}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-300 shadow-sm"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default InterviewExperienceCard;