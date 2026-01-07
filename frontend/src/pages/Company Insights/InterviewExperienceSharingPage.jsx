// // src/components/InterviewExperienceSharingPage.jsx
// import React, { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from '../../api';
// // import Header from "../Header"; // Adjust path as per your project
// // import Footer from "../Footer"; // Adjust path as per your project

// const InterviewExperienceSharingPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     anonymous: "No", // Default to No
//     passOutYear: "",
//     department: "",
//     yearOfStudy: "",
//     companyName: "",
//     interviewType: "",
//     role: "",
//     package: "", // Added package field
//     focusSkills: "",
//     roundsFaced: [],
//     otherRound: "",
//     unexpectedQuestions: "",
//     codingQuestions: "",
//     interviewTopics: "",
//     comfortLevel: "",
//     outcome: "",
//     feedback: "",
//     resources: "",
//     features: "",
//     experienceRating: 3,
//     additionalComments: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => {
//         const updatedRounds = checked
//           ? [...prev.roundsFaced, value]
//           : prev.roundsFaced.filter((r) => r !== value);
//         return { ...prev, roundsFaced: updatedRounds };
//       });
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/experiences`, { // Your backend API endpoint
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Something went wrong!");
//       }

//       await response.json(); // If you need to read the response data

//       toast.success("Interview experience submitted successfully!");
//       // Reset form
//       setFormData({
//         name: "",
//         anonymous: "No",
//         passOutYear: "",
//         department: "",
//         yearOfStudy: "",
//         companyName: "",
//         interviewType: "",
//         role: "",
//         package: "",
//         focusSkills: "",
//         roundsFaced: [],
//         otherRound: "",
//         unexpectedQuestions: "",
//         codingQuestions: "",
//         interviewTopics: "",
//         comfortLevel: "",
//         outcome: "",
//         feedback: "",
//         resources: "",
//         features: "",
//         experienceRating: 3,
//         additionalComments: "",
//       });
//     } catch (err) {
//       console.error("Submission error:", err);
//       toast.error(err.message || "Failed to submit. Please try again!");
//     }
//   };

//   return (
//     <div>
//       {/* <Header /> */}
//       <div className="min-h-screen bg-white text-black flex flex-col items-center p-4 md:p-8 lg:p-16 xl:p-20">
//         <Toaster />
//         <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-200">
//           <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-600">
//             Share Your Interview Experience
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="font-semibold block mb-1">Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 placeholder="Eg : Praveen Kumar"
//                 required
//               />
//             </div>

//             {/* Anonymous */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Are you willing to stay anonymous?<span className='text-red-600 ml-1'>*</span>
//               </label>
//               <div className="flex gap-6 mt-2">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="anonymous"
//                     value="Yes"
//                     checked={formData.anonymous === "Yes"}
//                     onChange={handleChange}
//                     className="form-radio text-indigo-600 h-4 w-4"
//                     required
//                   />{" "}
//                   <span className="ml-2">Yes</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="anonymous"
//                     value="No"
//                     checked={formData.anonymous === "No"}
//                     onChange={handleChange}
//                     className="form-radio text-indigo-600 h-4 w-4"
//                   />{" "}
//                   <span className="ml-2">No</span>
//                 </label>
//               </div>
//             </div>

//             {/* Pass out year, dept, year of study */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="font-semibold block mb-1">Pass out year <span className='text-red-600 ml-1'>*</span></label>
//                 <input
//                   type="text"
//                   name="passOutYear"
//                   value={formData.passOutYear}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                   placeholder="Eg : 2026"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="font-semibold block mb-1">Department <span className='text-red-600 ml-1'>*</span></label>
//                 <select
//                   name="department" // Changed name to 'department'
//                   value={formData.department}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded bg-white"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="B.E CSE">B.E CSE</option>
//                   <option value="B.E CSE AIML">B.E CSE AIML</option>
//                   <option value="B.E CSE IoT">B.E CSE IoT</option>
//                   <option value="B.E CSE CYS">B.E CSE CYS</option>
//                   <option value="B.Tech AIDS">B.Tech AIDS</option>
//                   <option value="B.Tech IT">B.Tech IT</option>
//                   <option value="B.E ECE">B.E ECE</option>
//                   <option value="B.E EEE">B.E EEE</option>
//                   <option value="B.E Civil">B.E Civil</option>
//                   <option value="B.E Mechanical">B.E Mechanical</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-semibold block mb-1">Year of Study <span className='text-red-600 ml-1'>*</span></label>
//                 <select
//                   name="yearOfStudy" // Changed name to 'yearOfStudy'
//                   value={formData.yearOfStudy}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded bg-white"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="I Year">I Year</option>
//                   <option value="II Year">II Year</option>
//                   <option value="III Year">III Year</option>
//                   <option value="IV Year">IV Year</option>
//                 </select>
//               </div>
//             </div>

//             {/* Company & Type */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="font-semibold block mb-1">Company Name <span className='text-red-600 ml-1'>*</span></label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="font-semibold block mb-1">Type of Interview <span className='text-red-600 ml-1'>*</span></label>
//                 <select
//                   name="interviewType"
//                   value={formData.interviewType}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded bg-white"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="Internship">Internship</option>
//                   <option value="Full Time">Full Time</option>
//                   <option value="Internship + Full Time">
//                     Internship + Full Time
//                   </option>
//                 </select>
//               </div>
//             </div>

//             {/* Role & Package */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="font-semibold block mb-1">Role/Position Applied For <span className='text-red-600 ml-1'>*</span></label>
//                 <input
//                   type="text"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                   placeholder="Eg : AI Engineer / Software Engineer"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="font-semibold block mb-1">Package *</label>
//                 <input
//                   type="text"
//                   name="package" // Corrected name to 'package'
//                   value={formData.package}
//                   onChange={handleChange}
//                   className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                   placeholder="Eg : 12 LPA"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Focus Skills */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Which topics/skills did company focus on the most? *
//               </label>
//               <textarea
//                 name="focusSkills"
//                 value={formData.focusSkills}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 placeholder="Eg : DSA (Array, String) / System Design / OOPs"
//                 required
//               ></textarea>
//             </div>

//             {/* Rounds Faced */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 What type of rounds you faced? *
//               </label>
//               <div className="grid grid-cols-2 gap-2 mt-2">
//                 {[
//                   "Aptitude",
//                   "Technical Quiz",
//                   "Coding round",
//                   "Group Discussion",
//                   "Hackathon",
//                   "Case Study round",
//                   "Technical Interview",
//                   "HR interview",
//                   "Long coding round",
//                   "Other",
//                 ].map((round) => (
//                   <label key={round} className="inline-flex items-center">
//                     <input
//                       type="checkbox"
//                       value={round}
//                       checked={formData.roundsFaced.includes(round)}
//                       onChange={handleChange}
//                       className="form-checkbox text-indigo-600 h-4 w-4"
//                     />{" "}
//                     <span className="ml-2">{round}</span>
//                   </label>
//                 ))}
//               </div>
//               {formData.roundsFaced.includes("Other") && (
//                 <input
//                   type="text"
//                   name="otherRound"
//                   value={formData.otherRound}
//                   onChange={handleChange}
//                   placeholder="Please specify"
//                   className="w-full mt-2 p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 />
//               )}
//             </div>

//             {/* Unexpected questions */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Were there any unexpected questions or rounds? <span className='text-red-600 ml-1'>*</span>
//               </label>
//               <textarea
//                 name="unexpectedQuestions"
//                 value={formData.unexpectedQuestions}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 required
//               ></textarea>
//             </div>

//             {/* Coding questions */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Coding round questions/topics you faced <span className='text-red-600 ml-1'>*</span>
//               </label>
//               <textarea
//                 name="codingQuestions"
//                 value={formData.codingQuestions}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 placeholder="Eg : Write a Program to print Prime Numbers till N"
//                 required
//               ></textarea>
//             </div>

//             {/* Interview topics */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Topics/Questions asked in interview rounds <span className='text-red-600 ml-1'>*</span>
//               </label>
//               <textarea
//                 name="interviewTopics"
//                 value={formData.interviewTopics}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 placeholder="Eg : What are the pillars of OOPs ?"
//                 required
//               ></textarea>
//             </div>

//             {/* Comfort Level */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 How comfortable did you feel? <span className='text-red-600 ml-1'>*</span>
//               </label>
//               <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
//                 {[
//                   "Very Comfortable",
//                   "Comfortable",
//                   "Neutral",
//                   "Uncomfortable",
//                   "Very uncomfortable",
//                 ].map((level) => (
//                   <label key={level} className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="comfortLevel"
//                       value={level}
//                       checked={formData.comfortLevel === level}
//                       onChange={handleChange}
//                       className="form-radio text-indigo-600 h-4 w-4"
//                       required
//                     />{" "}
//                     <span className="ml-2">{level}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Outcome */}
//             <div>
//               <label className="font-semibold block mb-1">Outcome of Interview <span className='text-red-600 ml-1'>*</span></label>
//               <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
//                 {[
//                   "Selected",
//                   "Rejected",
//                   "Waiting for the results",
//                   "Not willing to disclose",
//                 ].map((outcome) => (
//                   <label key={outcome} className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="outcome"
//                       value={outcome}
//                       checked={formData.outcome === outcome}
//                       onChange={handleChange}
//                       className="form-radio text-indigo-600 h-4 w-4"
//                       required
//                     />{" "}
//                     <span className="ml-2">{outcome}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Feedback if rejected */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 If rejected, did you receive feedback? Please describe
//               </label>
//               <textarea
//                 name="feedback"
//                 value={formData.feedback}
//                 onChange={handleChange}
//                 rows="2"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//               ></textarea>
//             </div>

//             {/* Resources */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Would you recommend any specific resources/strategies?
//               </label>
//               <textarea
//                 name="resources"
//                 value={formData.resources}
//                 onChange={handleChange}
//                 rows="2"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//               ></textarea>
//             </div>

//             {/* Features */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 What features would you like to see in a Placement Platform? <span className='text-red-600 ml-1'>*</span>
//               </label>
//               <textarea
//                 name="features"
//                 value={formData.features}
//                 onChange={handleChange}
//                 rows="2"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//                 required
//               ></textarea>
//             </div>

//             {/* Rating */}
//             <div>
//               <label className="font-semibold block mb-1">Overall Interview Experience <span className='text-red-600 ml-1'>*</span></label>
//               <input
//                 type="range"
//                 min="1"
//                 max="5"
//                 step="1"
//                 name="experienceRating"
//                 value={formData.experienceRating}
//                 onChange={handleChange}
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-600"
//               />
//               <p className="text-center mt-2">Rating: <span className="font-bold text-indigo-600">{formData.experienceRating}/5</span></p>
//             </div>

//             {/* Additional */}
//             <div>
//               <label className="font-semibold block mb-1">
//                 Any additional comments or suggestions?
//               </label>
//               <textarea
//                 name="additionalComments"
//                 value={formData.additionalComments}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none transition-all duration-200 rounded"
//               ></textarea>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full px-6 py-3 font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md"
//             >
//               Submit Experience
//             </button>
//           </form>
//         </div>
//       </div>
//       <div>
//         {/* <Footer /> */}
//       </div>
//     </div>
//   );
// };

// export default InterviewExperienceSharingPage;


// src/components/InterviewExperienceSharingPage.jsx
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../api';

const InterviewExperienceSharingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", anonymous: "No", passOutYear: "", department: "", yearOfStudy: "",
    companyName: "", interviewType: "", role: "", package: "", focusSkills: "",
    roundsFaced: [], otherRound: "", unexpectedQuestions: "", codingQuestions: "",
    interviewTopics: "", comfortLevel: "", outcome: "", feedback: "",
    resources: "", features: "", experienceRating: 3, additionalComments: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedRounds = checked ? [...prev.roundsFaced, value] : prev.roundsFaced.filter((r) => r !== value);
        return { ...prev, roundsFaced: updatedRounds };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Something went wrong!");
      toast.success("Interview experience submitted successfully!");
      navigate('/company-insights');
    } catch (err) {
      toast.error(err.message || "Failed to submit.");
    }
  };

  const inputClasses = "w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none bg-slate-50/50";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 pt-25">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center text-white">
            <h1 className="text-3xl font-black mb-2">Share Your Journey</h1>
            <p className="text-indigo-100">Help others by sharing your interview experience</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            {/* Personal Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="John Doe" required />
                </div>
                <div>
                  <label className={labelClasses}>Stay Anonymous? *</label>
                  <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
                    {["Yes", "No"].map(opt => (
                      <label key={opt} className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition-all font-bold text-sm ${formData.anonymous === opt ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                        <input type="radio" name="anonymous" value={opt} checked={formData.anonymous === opt} onChange={handleChange} className="hidden" /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Pass out year *</label>
                  <input type="text" name="passOutYear" value={formData.passOutYear} onChange={handleChange} className={inputClasses} placeholder="2026" required />
                </div>
                <div>
                  <label className={labelClasses}>Department *</label>
                  <select name="department" value={formData.department} onChange={handleChange} className={inputClasses} required>
                    <option value="">Select</option>
                    {["B.E CSE", "B.E CSE AIML", "B.Tech AIDS", "B.Tech IT", "B.E ECE"].map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Year of Study *</label>
                  <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className={inputClasses} required>
                    <option value="">Select</option>
                    {["I Year", "II Year", "III Year", "IV Year"].map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-4">Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} placeholder="Google" required />
                </div>
                <div>
                  <label className={labelClasses}>Interview Type *</label>
                  <select name="interviewType" value={formData.interviewType} onChange={handleChange} className={inputClasses} required>
                    <option value="">Select</option>
                    {["Internship", "Full Time", "Internship + Full Time"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Role *</label>
                  <input type="text" name="role" value={formData.role} onChange={handleChange} className={inputClasses} placeholder="Software Engineer" required />
                </div>
                <div>
                  <label className={labelClasses}>Package *</label>
                  <input type="text" name="package" value={formData.package} onChange={handleChange} className={inputClasses} placeholder="12 LPA" required />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-4">Interview Breakdown</h2>
              
              <div>
                <label className={labelClasses}>Rounds Faced *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Aptitude", "Technical Quiz", "Coding round", "Group Discussion", "Technical Interview", "HR interview", "Other"].map((round) => (
                    <label key={round} className={`flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer text-sm font-semibold ${formData.roundsFaced.includes(round) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                      <input type="checkbox" value={round} checked={formData.roundsFaced.includes(round)} onChange={handleChange} className="mr-2 h-4 w-4 accent-indigo-600" />
                      {round}
                    </label>
                  ))}
                </div>
                {formData.roundsFaced.includes("Other") && (
                  <input type="text" name="otherRound" value={formData.otherRound} onChange={handleChange} placeholder="Please specify round name" className={`${inputClasses} mt-4`} />
                )}
              </div>

              {[
                { name: "focusSkills", label: "Core Skills Focused *", placeholder: "DSA, OOPs, React..." },
                { name: "codingQuestions", label: "Coding Questions/Topics *", placeholder: "Explain your best code..." },
                { name: "interviewTopics", label: "Technical Topics Discussed *", placeholder: "Pillars of OOPs..." }
              ].map(field => (
                <div key={field.name}>
                  <label className={labelClasses}>{field.label}</label>
                  <textarea name={field.name} value={formData[field.name]} onChange={handleChange} rows="3" className={inputClasses} placeholder={field.placeholder} required />
                </div>
              ))}
            </div>

            {/* Experience & Outcome */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-4">Outcome & Rating</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>Overall Experience (1-5) *</label>
                  <input type="range" min="1" max="5" name="experienceRating" value={formData.experienceRating} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="text-center font-black text-indigo-600 mt-2 text-xl">{formData.experienceRating} / 5</div>
                </div>
                <div>
                  <label className={labelClasses}>Outcome *</label>
                  <select name="outcome" value={formData.outcome} onChange={handleChange} className={inputClasses} required>
                    <option value="">Select Outcome</option>
                    {["Selected", "Rejected", "Waiting", "Undisclosed"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Desired Platform Features *</label>
                <textarea name="features" value={formData.features} onChange={handleChange} rows="2" className={inputClasses} placeholder="Mock interviews, company-wise filters..." required />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all cursor-pointer active:scale-95">
              Submit My Experience
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewExperienceSharingPage;