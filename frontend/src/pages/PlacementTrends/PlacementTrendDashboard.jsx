import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, TrendingUp, Award, Target, Briefcase, 
  Activity, Globe, Zap, BarChart3, ChevronRight,
  TrendingDown, CalendarDays, Building2, ArrowUpRight, Clock, ShieldAlert, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../../api';

// --- Local Maintenance Overlay Component ---
const PlacementUpdateOverlay = ({ endTime, message }) => (
<div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
  <div className="bg-white rounded-[3.5rem] shadow-2xl border border-white p-10 max-w-2xl w-full text-center relative overflow-hidden">
    <ShieldAlert className="absolute -right-10 -bottom-10 text-slate-50 w-64 h-64 rotate-12" />
    <div className="relative z-10">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Clock size={40} className="animate-pulse" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Placement Records Update in Progress</h2>
      <p className="text-slate-500 font-bold leading-relaxed mb-8 px-6">{message}</p>
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center gap-2 mb-8">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Completion</span>
        <span className="text-xl font-black text-indigo-600">
          {endTime ? new Date(endTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }) : "Coming Soon"}
        </span>
      </div>
      
      {/* Navigation Button */}
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.15em] cursor-pointer mb-8"
      >
        Take Back to Home
      </button>

      <div className="flex items-center justify-center gap-3 text-indigo-400">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-xs font-black uppercase tracking-widest">System Synchronizing...</span>
      </div>
    </div>
  </div>
</div>
);

const COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  chart: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4']
};

const PlacementTrendDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default to 'All' or a current year to see initial data
  const [selectedYear, setSelectedYear] = useState('2026'); 
  const [selectedDept, setSelectedDept] = useState('All');
// --- Updated State ---
const [updateStatus, setUpdateStatus] = useState({ isActive: false, message: "" });

const departments = ['All', 'CSE(AI & ML)', 'CSE(Cyber)', 'CSE(IoT)', 'CSE', 'AIDS', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical'];

useEffect(() => {
  let intervalId;
  const checkStatusAndFetch = async () => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      // Authoritative check of the maintenance toggle
      const statusRes = await axios.get(`${API_BASE_URL}/api/auth/update-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If isActive is true (Toggle is ON), block immediately
      if (statusRes.data.isActive) {
        setUpdateStatus({
            isActive: true,
            message: statusRes.data.message
        });
        setLoading(false);
        return;
      }

      // If Toggle is OFF, ensure dashboard is accessible
      setUpdateStatus({ isActive: false, message: "" });

      const response = await axios.get(`${API_BASE_URL}/api/auth/trends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  checkStatusAndFetch();
  // Polling ensure active sessions are caught instantly when toggle is switched
  intervalId = setInterval(checkStatusAndFetch, 30_000);

  return () => clearInterval(intervalId);
}, []);

  // FIXED: Filtering logic with proper type casting and case-insensitive check
  const filteredRecords = useMemo(() => {
    return data.filter(r => {
      const yearMatch = selectedYear === 'All' || String(r.passingYear) === String(selectedYear);
      const deptMatch = selectedDept === 'All' || String(r.branch).toUpperCase() === String(selectedDept).toUpperCase();
      return yearMatch && deptMatch;
    });
  }, [data, selectedYear, selectedDept]);

  // FIXED: Future-Proof Year Batching (2026, 2027, 2028, 2029, 2030)
  const batches = useMemo(() => {
    const dynamicYears = [2025, 2026, 2027, 2028, 2029, 2030];
    const existingYears = [...new Set(data.map(d => Number(d.passingYear)))].filter(Boolean);
    const combined = [...new Set([...dynamicYears, ...existingYears])];
    return ['All', ...combined.sort((a, b) => a - b)]; // Sorted ascending for clear timeline
  }, [data]);

  const analytics = useMemo(() => {
    const totalUsers = filteredRecords.length;
    const placedOnes = filteredRecords.filter(r => r.placementStatus === 'Placed');
    const placementPercentage = totalUsers > 0 ? ((placedOnes.length / totalUsers) * 100).toFixed(1) : 0;
    const totalOffers = placedOnes.reduce((sum, s) => sum + (Number(s.offersCount) || 0), 0);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = months.map(m => ({ name: m, students: 0, offers: 0, lpaSum: 0, lpaCount: 0, uniqueCompanies: new Set() }));

    placedOnes.forEach(r => {
      const dateSource = r.placedDate ? new Date(r.placedDate) : new Date(r.createdAt);
      const mIdx = dateSource.getMonth();
      monthlyMap[mIdx].students += 1;
      monthlyMap[mIdx].offers += (Number(r.offersCount) || 0);
      if (r.recentCompany) monthlyMap[mIdx].uniqueCompanies.add(r.recentCompany);
      if (r.packageLPA > 0) {
        monthlyMap[mIdx].lpaSum += r.packageLPA;
        monthlyMap[mIdx].lpaCount += 1;
      }
    });

    const branchStrengthMap = {};
    const branchPlacedMap = {};
    filteredRecords.forEach(r => branchStrengthMap[r.branch] = (branchStrengthMap[r.branch] || 0) + 1);
    placedOnes.forEach(r => branchPlacedMap[r.branch] = (branchPlacedMap[r.branch] || 0) + 1);

    const deptPerformanceData = Object.keys(branchStrengthMap).map(branch => ({
      name: branch,
      percentage: ((branchPlacedMap[branch] || 0) / branchStrengthMap[branch] * 100).toFixed(1)
    })).sort((a,b) => b.percentage - a.percentage);

    const companyPackageMap = {};
    placedOnes.forEach(r => { if (r.recentCompany) companyPackageMap[r.recentCompany] = Math.max(companyPackageMap[r.recentCompany] || 0, r.packageLPA || 0); });
    const topPackageCompanies = Object.keys(companyPackageMap).map(name => ({ name, lpa: companyPackageMap[name] })).sort((a, b) => b.lpa - a.lpa).slice(0, 5);

    const companyHiringMap = {};
    placedOnes.forEach(r => { if (r.recentCompany) companyHiringMap[r.recentCompany] = (companyHiringMap[r.recentCompany] || 0) + 1; });
    const topHiringCompanies = Object.keys(companyHiringMap).map(name => ({ name, count: companyHiringMap[name] })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      totalUsers,
      placedCount: placedOnes.length,
      placementPercentage,
      totalOffers,
      avgLPA: placedOnes.length ? (placedOnes.reduce((s, c) => s + (c.packageLPA || 0), 0) / placedOnes.length).toFixed(2) : 0,
      highestLPA: Math.max(...placedOnes.map(r => r.packageLPA || 0), 0),
      monthlyTrend: monthlyMap.map(m => ({ ...m, companyVisits: m.uniqueCompanies.size, avgPkg: m.lpaCount > 0 ? parseFloat((m.lpaSum / m.lpaCount).toFixed(2)) : 0 })),
      deptData: deptPerformanceData,
      topPackageCompanies,
      topHiringCompanies,
      uniqueCompanies: [...new Set(placedOnes.map(r => r.recentCompany).filter(Boolean))]
    };
  }, [filteredRecords]);

  const cloudWords = useMemo(() => {
    return [...analytics.uniqueCompanies]
      .sort(() => Math.random() - 0.5)
      .map((company, index) => ({
        name: company,
        size: Math.floor(Math.random() * (30 - 14 + 1) + 14),
        opacity: Math.random() * (1 - 0.7) + 0.7,
        rotate: Math.floor(Math.random() * 20 - 10),
        delay: index * 0.05,
        color: COLORS.chart[index % COLORS.chart.length]
      }));
  }, [analytics.uniqueCompanies]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-xl"></div>
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Syncing Career Intelligence...</p>
    </div>
  );

  if (updateStatus.isActive) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
         <header className="p-10 opacity-30 pointer-events-none">
            <h1 className="text-4xl font-black text-slate-900">Career Insights</h1>
         </header>
         <PlacementUpdateOverlay endTime={updateStatus.endTime} message={updateStatus.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] p-6 lg:p-20 pb-40">
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(15px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cloud-word {
          animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="relative group">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none transition-all duration-300 group-hover:tracking-tight">Career Insights</h1>
            <div className="flex items-center gap-3 mt-4">
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Live Institutional Hiring Intel</p>
            </div>
          </div>
          <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white">
            <div className="flex items-center px-4 border-r border-slate-200">
                <CalendarDays className="w-4 h-4 text-slate-400 mr-2" />
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-700">
                  {batches.map(y => <option key={y} value={y}>{y === 'All' ? 'All Batches' : `Batch ${y}`}</option>)}
                </select>
            </div>
            <div className="flex items-center px-4">
                <Activity className="w-4 h-4 text-slate-400 mr-2" />
                <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-700">
                  {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Depts' : d}</option>)}
                </select>
            </div>
          </div>
        </header>

        {/* 5-Grid KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard title="Strength" count={analytics.totalUsers} icon={<Users />} color="indigo" subtitle="Total Students" />
          <StatCard title="Placed %" count={`${analytics.placementPercentage}%`} icon={<Target />} color="emerald" subtitle="Placement Success" />
          <StatCard title="Job Offers" count={analytics.totalOffers} icon={<Award />} color="amber" subtitle="Total Offers" />
          <StatCard title="Highest Package" count={`₹${analytics.highestLPA}L`} icon={<Zap />} color="rose" subtitle="Super Dream Package" />
          <StatCard title="Avg Package" count={`₹${analytics.avgLPA}L`} icon={<TrendingUp />} color="cyan" subtitle="Dream Package" />
        </div>

        {/* Charts Rows... (Keeping your existing detailed chart rows) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartWrapper title="Hiring Velocity" sub="Cumulative student intake volume monthly">
            <AreaChart data={analytics.monthlyTrend}>
              <defs><linearGradient id="clr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip unit=" Students" />} />
              <Area type="monotone" dataKey="students" stroke="#6366f1" fill="url(#clr)" strokeWidth={4} />
            </AreaChart>
          </ChartWrapper>

          <ChartWrapper title="Package Growth" sub="Mean salary progression trend cycle">
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <Tooltip content={<CustomTooltip unit=" LPA" />} />
              <Line type="stepAfter" dataKey="avgPkg" stroke="#f59e0b" strokeWidth={4} dot={{r: 4, fill: '#fff', strokeWidth: 3, stroke: '#f59e0b'}} />
            </LineChart>
          </ChartWrapper>
        </div>

        {/* (Additional Charts for Recruitment Dynamics and Branch Success follow same pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartWrapper title="Recruitment Dynamics" sub="Monthly Recruiting Company Presence">
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip unit=" Companies" />} />
              <Bar dataKey="companyVisits" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} />
            </BarChart>
          </ChartWrapper>

          <ChartWrapper title="Branch Success Rate" sub="Departmental placement distribution percentage">
            <BarChart data={analytics.deptData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} domain={[0, 100]} />
              <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip unit="%" />} />
              <Bar dataKey="percentage" fill="#10b981" radius={[12, 12, 0, 0]} barSize={38} />
            </BarChart>
          </ChartWrapper>
        </div>

        {/* Word Cloud */}
        <div className="grid grid-cols-1 gap-8">
          <div className="glass-card p-10 lg:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-white flex flex-col min-h-[500px] group transition-all duration-500 hover:shadow-indigo-100">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-black text-3xl text-slate-900 tracking-tighter">Campus Recruiting Companies</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Campus Recruitment Ecosystem</p>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-500 rounded-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <Globe size={40} className="group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 overflow-hidden flex-1 p-6 relative text-center">
              {cloudWords.map((word, i) => (
                <span 
                  key={`${word.name}-${i}`} 
                  className="cloud-word font-black uppercase tracking-tighter hover:scale-125 transition-all duration-300 cursor-pointer"
                  style={{ 
                    fontSize: `${word.size}px`, 
                    opacity: word.opacity,
                    transform: `rotate(${word.rotate}deg)`,
                    animationDelay: `${word.delay}s`,
                    color: word.color
                  }}
                >
                  {word.name}
                </span>
              ))}
              {cloudWords.length === 0 && (
                <div className="flex flex-col items-center opacity-20">
                    <Building2 size={80} className="mb-4" />
                    <p className="font-black tracking-widest uppercase">No Recruiter Data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Atomic Components ---

const StatCard = ({ title, count, icon, color, subtitle }) => {
  const bgMap = { indigo: 'bg-indigo-600 shadow-indigo-200', emerald: 'bg-emerald-600 shadow-emerald-200', amber: 'bg-amber-500 shadow-amber-200', rose: 'bg-rose-600 shadow-rose-200', cyan: 'bg-cyan-500 shadow-cyan-200' };
  return (
    <div className="glass-card p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
      <div className={`p-4 rounded-[1.8rem] text-white mb-5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${bgMap[color]}`}>
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter group-hover:scale-105 transition-transform">{count}</p>
      <div className="flex items-center gap-1 mt-3">
         <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${bgMap[color]}`} />
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
};

const ChartWrapper = ({ title, sub, children }) => (
  <div className="glass-card p-8 lg:p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white h-[450px] flex flex-col group transition-all duration-500 hover:shadow-indigo-50 hover:border-indigo-100">
    <div className="mb-10 flex justify-between items-start">
      <div className="space-y-2">
        <h3 className="font-black text-2xl text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">{sub}</p>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all duration-500">
        <ArrowUpRight size={20} />
      </div>
    </div>
    <div className="flex-1 w-full h-full pb-4">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-5 py-4 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-2xl">
        <p className="font-black text-slate-800 mb-3 border-b border-slate-100 pb-2 uppercase text-[10px] tracking-[0.2em]">{label}</p>
        {payload.map((p, index) => (
          <div key={index} className="flex items-center gap-4 py-1">
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: p.color }} />
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-tight">
              {p.name}: <span className="text-slate-900 text-sm ml-1">{p.value}{unit || ''}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default PlacementTrendDashboard;