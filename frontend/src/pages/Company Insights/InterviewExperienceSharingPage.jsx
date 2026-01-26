// src/components/InterviewExperienceSharingPage.jsx
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../api';

const InterviewExperienceSharingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", 
    anonymous: "No", 
    passOutYear: "", 
    department: "", 
    yearOfStudy: "",
    companyName: "", 
    interviewType: "", 
    role: "", 
    package: "", 
    focusSkills: "",
    roundsFaced: [], 
    otherRound: "", 
    unexpectedQuestions: "", // Added to match schema
    codingQuestions: "",
    interviewTopics: "", 
    comfortLevel: "", // Added to match schema
    outcome: "", 
    feedback: "", // Added to match schema
    resources: "", // Added to match schema
    features: "", 
    experienceRating: 3, 
    additionalComments: "", // Added to match schema
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
                    {["B.E CSE", "B.E CSE AIML", "B.E CSE IoT", "B.E CSE CYS", "B.Tech AIDS", "B.Tech IT", "B.E ECE", "B.E EEE", "B.E Civil", "B.E Mechanical"].map(dept => <option key={dept} value={dept}>{dept}</option>)}
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
                  {["Aptitude", "Technical Quiz", "Coding round", "Communication Round", "Group Discussion", "Hackathon", "Technical Interview", "HR interview", "Other"].map((round) => (
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
                { name: "unexpectedQuestions", label: "Any Unexpected Questions? *", placeholder: "Questions that caught you off guard..." },
                { name: "codingQuestions", label: "Coding Questions/Topics Faced *", placeholder: "Eg: Print prime numbers till N..." },
                { name: "interviewTopics", label: "Technical/HR Topics Discussed *", placeholder: "Pillars of OOPs, Project details..." }
              ].map(field => (
                <div key={field.name}>
                  <label className={labelClasses}>{field.label}</label>
                  <textarea name={field.name} value={formData[field.name]} onChange={handleChange} rows="3" className={inputClasses} placeholder={field.placeholder} required />
                </div>
              ))}

              <div>
                <label className={labelClasses}>How comfortable did you feel? *</label>
                <select name="comfortLevel" value={formData.comfortLevel} onChange={handleChange} className={inputClasses} required>
                    <option value="">Select Level</option>
                    {["Very Comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>

            {/* Outcome & Suggestions */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-4">Outcome & Recommendations</h2>
              
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
                    {["Selected", "Rejected", "Waiting for the results", "Not willing to disclose"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {[
                { name: "feedback", label: "Feedback received (If rejected)", placeholder: "Any specific areas mentioned for improvement..." },
                { name: "resources", label: "Recommended Resources/Strategies", placeholder: "Links, YouTube channels, or prep strategies..." },
                { name: "features", label: "Desired Placement Platform Features *", placeholder: "What else should CampSync.AI have?", required: true },
                { name: "additionalComments", label: "Any Additional Comments?", placeholder: "Tips for juniors..." }
              ].map(field => (
                <div key={field.name}>
                  <label className={labelClasses}>{field.label}</label>
                  <textarea name={field.name} value={formData[field.name]} onChange={handleChange} rows="2" className={inputClasses} placeholder={field.placeholder} required={field.required} />
                </div>
              ))}
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