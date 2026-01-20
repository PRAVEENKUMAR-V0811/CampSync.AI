import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaEnvelope } from "react-icons/fa";

const lastUpdated = "September 22, 2025";
const contactEmail = "info@campsync.ai";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "collect", title: "2. Information We Collect" },
  { id: "use", title: "3. How We Use Information" },
  { id: "ai", title: "4. AI Processing" },
  { id: "sharing", title: "5. Data Sharing" },
  { id: "retention", title: "6. Data Retention" },
  { id: "security", title: "7. Security" },
  { id: "rights", title: "8. Your Rights" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "changes", title: "10. Changes" },
];

export default function PrivacyPage() {
  return (
    // pt-28 ensures content starts below your fixed header
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation Row */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors cursor-pointer group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="hidden sm:block text-sm text-gray-400">
            Last updated: <span className="font-medium text-gray-600">{lastUpdated}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar - Table of Contents (Hidden on Mobile) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-4">
                Contents
              </h3>
              <nav>
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Card */}
          <main className="flex-1 bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl">
                <FaShieldAlt />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                Privacy Policy
              </h1>
            </div>
            
            <p className="text-gray-500 sm:hidden mb-8 italic">Last updated: {lastUpdated}</p>

            <div className="prose prose-indigo max-w-none space-y-10">
              
              <section id="intro" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  1. Introduction
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  CampSync.AI respects your privacy. This Privacy Policy explains what information we collect, how we
                  use it, and the choices you have. By using the Platform, you consent to the practices described here.
                </p>
              </section>

              <section id="collect" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                <div className="grid gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                    <strong className="text-indigo-700 block mb-1">Account Information</strong>
                    <p className="text-gray-600 text-sm">Name, email, role (student or alumni), profile picture (if provided).</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                    <strong className="text-indigo-700 block mb-1">User Content</strong>
                    <p className="text-gray-600 text-sm">Interview experiences, uploaded question papers, comments, and any other materials you submit.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                    <strong className="text-indigo-700 block mb-1">Usage Data</strong>
                    <p className="text-gray-600 text-sm">Device and browser info, IP address, pages visited, and feature usage collected through logs.</p>
                  </div>
                </div>
              </section>

              <section id="use" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <ul className="space-y-3">
                  {["Provide and maintain the Platform and its features.", 
                    "Personalize recommendations, dashboards, and mock interview prompts.",
                    "Analyze aggregate trends to improve service quality and perform research.",
                    "Communicate with you about your account and important updates."].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="ai" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">4. AI Processing & Third-Party Services</h2>
                <p className="text-gray-600 leading-relaxed bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  Some features (e.g., Mock Interview Bot, auto-tagging) may process text using third-party AI services or
                  internal ML models. Text submitted to such features may be transmitted to those services for processing.
                  We take steps to minimize personal data in such requests.
                </p>
              </section>

              <section id="sharing" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Sharing & Disclosure</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell personal data. We may share aggregated or anonymized analytics publicly. We may disclose
                  information when required by law, to protect rights, or to comply with legal processes.
                </p>
              </section>

              <section id="retention" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
                <p className="text-gray-600 leading-relaxed">
                  We retain personal information as long as needed to provide the Platform.
                  You may request deletion of your account; some copies may remain in backups for a limited time.
                </p>
              </section>

              <section id="security" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">7. Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We take reasonable technical measures to protect personal data. However, no system is
                  completely secure. Do not share sensitive personal information in public uploads.
                </p>
              </section>

              <section id="rights" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-indigo-50 rounded-2xl">
                  <p className="text-gray-700 flex-1">
                    You can access, correct, or request deletion of your personal data.
                  </p>
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition cursor-pointer shrink-0"
                  >
                    <FaEnvelope /> Contact Us
                  </a>
                </div>
              </section>

              <section id="children" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Platform is not intended for users under the age of 13. If we discover information from a child under 13,
                  we will take steps to delete it.
                </p>
              </section>

              <section id="changes" className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may modify this Privacy Policy. We will post updates on this page with a revised "Last updated" date.
                  Continued use after changes indicates acceptance.
                </p>
              </section>
            </div>
            
            {/* Footer help area */}
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

        {/* Bottom CTA for Mobile */}
        <div className="mt-12 flex justify-center lg:hidden">
          <Link
            to="/"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}