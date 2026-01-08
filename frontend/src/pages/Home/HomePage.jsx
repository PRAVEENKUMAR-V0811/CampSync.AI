import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import {
  BarChart3,
  Brain,
  FileText,
  Users,
  Building2,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

// Import the new Chatbot component
import Chatbot from './Chatbot';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  // Dummy Data
  const companyVisits = [
    { month: "Jan", visits: 12 },
    { month: "Feb", visits: 18 },
    { month: "Mar", visits: 25 },
    { month: "Apr", visits: 20 },
    { month: "May", visits: 30 },
  ];

  const topicFrequency = [
    { topic: "DSA", frequency: 40 },
    { topic: "OOPs", frequency: 25 },
    { topic: "DBMS", frequency: 20 },
    { topic: "OS", frequency: 15 },
  ];

  const difficultyTrends = [
    { year: "2021", easy: 30, medium: 50, hard: 20 },
    { year: "2022", easy: 25, medium: 55, hard: 20 },
    { year: "2023", easy: 20, medium: 60, hard: 20 },
  ];

  const modules = [
    {
      title: "Placement Trends",
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      desc: "Visualize company visits, hiring patterns & difficulty levels.",
      path: "/placements/data",
    },
    {
      title: "Mock Interview Bot",
      icon: <Brain className="w-6 h-6 text-indigo-600" />,
      desc: "Simulate HR & technical interviews with our AI bot.",
      path: "/interview",
    },
    {
      title: "Company Insights",
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      desc: "Explore FAQs, alumni experiences & interview difficulty by company.",
      path: "/company-insights",
    },
    {
      title: "Academic Papers",
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      desc: "Browse previous question papers with smart filters.",
      path: "/question-bank",
    },
    {
      title: "Upload Academic Papers",
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      desc: "Learn from alumni stories and interview experiences.",
      path: "/academic-papers-upload",
    },
    {
      title: "Share your experience",
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      desc: "Share your personal interview experiences.",
      path: "/share-experience",
    },
  ];

  const handleModuleClick = (module) => {
    // Check only for Mock Interview Bot
    if (module.title === "Mock Interview Bot") {
      const isLargeScreen = window.innerWidth >= 1024;

      if (!isLargeScreen) {
      toast.error(
        "This is enabled only for larger device like laptop or desktop",
        {
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            fontWeight: '500'
          }
        }
      );
        return;
      }
    }

    navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 pt-20">
      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Overview Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Quick Overview
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Visits */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Monthly Company Visits
              </h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={companyVisits}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="visits" stroke="#4F46E5" strokeWidth={3} dot={{fill: '#4F46E5', r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Frequency */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Topic Frequency
              </h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicFrequency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="frequency" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficulty Trends */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Difficulty Trends
              </h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="easy" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={30} />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={30} />
                    <Bar dataKey="hard" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Modules
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div
                key={i}
                onClick={() => handleModuleClick(m)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-8 flex flex-col transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="mb-6 w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {React.cloneElement(m.icon, { className: "w-7 h-7 transition-colors duration-300 group-hover:text-white" })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  {m.desc}
                </p>
                <div className="flex items-center text-indigo-600 font-bold text-sm uppercase tracking-wider">
                  <span>Open Module</span>
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chat Bot Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:scale-110 transition-all active:scale-95 cursor-pointer z-50"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Render the new Chatbot component */}
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default HomePage;