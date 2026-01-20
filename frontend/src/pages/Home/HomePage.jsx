import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Brain,
  FileText,
  Users,
  Building2,
  MessageCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { API_BASE_URL } from '../../api';

// Import the new Chatbot component
import Chatbot from './Chatbot';
import CompanyScroller from '../CompanyScroller';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  // Fetch Trends for the Monthly Hiring Visual
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await axios.get(`${API_BASE_URL}/api/auth/trends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrendData(response.data);
      } catch (err) {
        console.error("Failed to load trends for homepage", err);
      } finally {
        setLoadingTrends(false);
      }
    };
    fetchTrends();
  }, []);

  // Process data for the monthly visual
  const monthlyHiring = useMemo(() => {
    const placed = trendData.filter(r => r.placementStatus === 'Placed');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const map = months.map(m => ({ name: m, hires: 0 }));

    placed.forEach(r => {
      const dateSource = r.placedDate ? new Date(r.placedDate) : new Date(r.createdAt);
      const mIdx = dateSource.getMonth();
      map[mIdx].hires += 1;
    });
    return map;
  }, [trendData]);

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
        
        {/* Updated Overview Section with Hiring Visual and Scroller */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Placement Momentum
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Hiring Trends Visual */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Monthly Hiring Velocity
                </h3>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="h-[220px] w-full">
                {loadingTrends ? (
                  <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse text-slate-400 font-bold">Loading Trends...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyHiring}>
                      <defs>
                        <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="hires" stroke="#4F46E5" fillOpacity={1} fill="url(#colorHires)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Industry Partners / Company Scroller */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Zap className="w-20 h-20 text-indigo-400 rotate-12" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
                  Top Recruiters
                </h3>
                <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
                  Connected with <br />Global Leaders
                </h2>
                
                <div className="space-y-6">
                   <CompanyScroller direction="ltr" speed="medium" theme="dark" />
                </div>
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