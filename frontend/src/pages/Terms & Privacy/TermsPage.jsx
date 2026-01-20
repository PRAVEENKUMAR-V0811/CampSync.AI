import React from "react";
import { Link } from "react-router-dom";
import { FaGavel, FaArrowLeft, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const lastUpdated = "September 22, 2025";
const contactEmail = "info@campsync.ai";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "definitions", title: "2. Definitions" },
  { id: "usage", title: "3. Platform Usage" },
  { id: "accounts", title: "4. Account Security" },
  { id: "ip", title: "5. Intellectual Property" },
  { id: "ai", title: "6. AI Disclaimer" },
  { id: "copyright", title: "7. Copyright" },
  { id: "termination", title: "8. Termination" },
  { id: "liability", title: "9. Liability" },
  { id: "law", title: "10. Governing Law" },
];

export default function TermsPage() {
  return (
    // pt-28 ensures content is not hidden under the fixed header
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer group w-fit"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="text-sm text-gray-400 bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100 w-fit">
            Last updated: <span className="font-semibold text-gray-600">{lastUpdated}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Navigation Sidebar (Hidden on Mobile) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                Navigate Terms
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200">
                <FaGavel />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-gray-500 mt-1">Please read these terms carefully before using CampSync.AI</p>
              </div>
            </div>

            <div className="space-y-12">
              
              <section id="intro" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms & Conditions ("Terms") govern your access to and use of the platform <strong>CampSync.AI</strong> 
                  ("Platform", "we", "us", or "our"). By accessing or using the Platform, you agree to be bound by these
                  Terms. If you do not agree, you must cease use of the Platform immediately.
                </p>
              </section>

              <section id="definitions" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 block mb-1 uppercase text-xs tracking-widest">The User</span>
                    <p className="text-gray-700 text-sm">Any person accessing the Platform, including students and alumni.</p>
                  </div>
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 block mb-1 uppercase text-xs tracking-widest">The Content</span>
                    <p className="text-gray-700 text-sm">Text, uploads, interview experiences, question papers, and AI-generated outputs.</p>
                  </div>
                </div>
              </section>

              <section id="usage" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of the Platform</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 mb-4">You agree to use the Platform only for lawful educational purposes. <strong>Prohibited actions include:</strong></p>
                  <ul className="space-y-3">
                    {["Sharing defamatory, hateful, or infringing content.", 
                      "Impersonating others or creating multiple accounts.",
                      "Attempting to circumvent Platform security measures."].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="ai" className="scroll-mt-32">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                  <div className="flex items-center gap-3 mb-3 text-amber-800">
                    <FaExclamationTriangle />
                    <h2 className="text-xl font-bold">6. AI Outputs & Disclaimer</h2>
                  </div>
                  <p className="text-amber-900/80 leading-relaxed text-sm">
                    CampSync.AI uses LLMs and NLP to generate suggestions and interview simulations. 
                    <strong> AI outputs are for guidance only </strong> and may be incorrect or outdated. 
                    We disclaim all liability for decisions made based on AI-generated content.
                  </p>
                </div>
              </section>

              <section id="ip" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content & IP</h2>
                <p className="text-gray-600 leading-relaxed">
                  By submitting content, you grant CampSync.AI a worldwide, royalty-free license to host, store, and reproduce 
                  your content to improve our services (including anonymized use for AI model training).
                </p>
              </section>

              <section id="law" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in your territory.
                </p>
              </section>

            </div>

            {/* Support Footer */}
            <div className="mt-20 pt-10 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-gray-500 text-sm text-center md:text-left">
                  Questions regarding these terms? <br className="hidden md:block" />
                  Email us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 font-bold cursor-pointer hover:underline">{contactEmail}</a>
                </p>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  Accept & Close
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}