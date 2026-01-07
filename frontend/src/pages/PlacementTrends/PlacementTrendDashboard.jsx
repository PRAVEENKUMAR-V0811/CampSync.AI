// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
// } from 'recharts';
// import { 
//   Building2, 
//   Users, 
//   TrendingUp, 
//   Award, 
//   Filter, 
//   Calendar, 
//   Briefcase,
//   ChevronRight
// } from 'lucide-react';
// import { API_BASE_URL } from '../../api';
// import CompanyScroller from '../CompanyScroller';

// // Modern Professional Palette
// const COLORS = {
//   primary: '#6366f1', // Indigo
//   success: '#10b981', // Emerald
//   warning: '#f59e0b', // Amber
//   danger: '#ef4444',  // Red
//   info: '#3b82f6',    // Blue
//   chart: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4']
// };

// const CustomTooltip = ({ active, payload, label, unit, dataKey }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl ring-1 ring-black/5">
//         <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
//         {payload.map((p, index) => (
//           <div key={index} className="flex items-center gap-2 mb-1">
//             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
//             <p className="text-slate-600 text-sm">
//               <span className="font-medium">{p.name}:</span> {p.value}{unit || ''}
//             </p>
//           </div>
//         ))}
//         {dataKey === "companiesVisited" && data.companiesList?.length > 0 && (
//           <div className="mt-3">
//             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Top Recruiters</p>
//             <div className="flex flex-wrap gap-1 max-w-[200px]">
//               {data.companiesList.slice(0, 5).map((company, index) => (
//                 <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px]">
//                   {company}
//                 </span>
//               ))}
//               {data.companiesList.length > 5 && <span className="text-[11px] text-slate-400">+{data.companiesList.length - 5} more</span>}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// const PlacementTrendDashboard = () => {
//   const [rawPlacements, setRawPlacements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//   const [selectedDepartment, setSelectedDepartment] = useState('All');

//   const allDepartments = ['All', 'CSE', 'CSE AIML', 'CSE IoT', 'CSE Cyber Security', 'AIDS', 'IT', 'EEE', 'ECE', 'CIVIL', 'MECHANICAL'];

//   useEffect(() => {
//     const fetchPlacements = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`${API_BASE_URL}/api/placements/all-placements`);
//         setRawPlacements(data);
//       } catch (error) {
//         console.error("Error fetching placement analytics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlacements();
//   }, []);

//   const filteredRecords = useMemo(() => {
//     return rawPlacements.filter(item =>
//       (selectedYear === 'All' || item.year.toString() === selectedYear) &&
//       (selectedDepartment === 'All' || item.department === selectedDepartment)
//     );
//   }, [rawPlacements, selectedYear, selectedDepartment]);

//   const allYears = useMemo(() => {
//     const years = new Set(rawPlacements.map(d => d.year.toString()));
//     return ['All', ...Array.from(years).sort((a, b) => b - a)];
//   }, [rawPlacements]);

//   const summaryData = useMemo(() => {
//     const placedOnes = filteredRecords.filter(r => r.status === 'Placed');
//     const companies = new Set(placedOnes.map(r => r.company));
//     const packages = placedOnes.map(r => r.lpa).filter(l => l > 0);

//     return {
//       totalCompanies: companies.size,
//       totalPlaced: placedOnes.length,
//       avgLPA: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0,
//       highestLPA: packages.length ? Math.max(...packages).toFixed(2) : 0
//     };
//   }, [filteredRecords]);

//   const monthWiseData = useMemo(() => {
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const stats = monthNames.map(name => ({
//       monthYear: name,
//       companiesList: new Set(),
//       studentsHired: 0,
//       lpaSum: 0,
//       lpaCount: 0
//     }));

//     filteredRecords.forEach(record => {
//       const date = new Date(record.createdAt);
//       const mIdx = date.getMonth(); 
//       if (record.status === 'Placed') {
//         stats[mIdx].studentsHired += 1;
//         stats[mIdx].companiesList.add(record.company);
//         if (record.lpa > 0) {
//           stats[mIdx].lpaSum += record.lpa;
//           stats[mIdx].lpaCount += 1;
//         }
//       }
//     });

//     return stats.map(item => ({
//       ...item,
//       companiesVisited: item.companiesList.size,
//       companiesList: Array.from(item.companiesList),
//       averagePackage: item.lpaCount > 0 ? parseFloat((item.lpaSum / item.lpaCount).toFixed(2)) : 0
//     }));
//   }, [filteredRecords]);

//   const deptData = useMemo(() => {
//     const map = {};
//     filteredRecords.forEach(r => {
//       if (r.status === 'Placed') map[r.department] = (map[r.department] || 0) + 1;
//     });
//     return Object.keys(map).map(dept => ({ name: dept, value: map[dept] }));
//   }, [filteredRecords]);

//   const topCompanies = useMemo(() => {
//     const map = {};
//     filteredRecords.forEach(r => {
//       if (r.status === 'Placed') map[r.company] = (map[r.company] || 0) + 1;
//     });
//     return Object.keys(map)
//       .map(name => ({ name, studentsHired: map[name] }))
//       .sort((a, b) => b.studentsHired - a.studentsHired)
//       .slice(0, 5);
//   }, [filteredRecords]);

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm"></div>
//       <p className="text-slate-500 font-medium animate-pulse">Analyzing Placement Data...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 pb-40">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <header className="mb-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Placement Insights</h1>
//               <p className="text-slate-500 mt-1 font-medium italic flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//                 Live data tracking faculty-updated records
//               </p>
//             </div>
            
//             {/* Professional Filters */}
//             <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
//               <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//                 <Calendar className="w-4 h-4 text-slate-400" />
//                 <select 
//                   value={selectedYear} 
//                   onChange={(e) => setSelectedYear(e.target.value)} 
//                   className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
//                 >
//                   {allYears.map(y => <option key={y} value={y}>{y}</option>)}
//                 </select>
//               </div>
//               <div className="flex items-center gap-2 px-3">
//                 <Filter className="w-4 h-4 text-slate-400" />
//                 <select 
//                   value={selectedDepartment} 
//                   onChange={(e) => setSelectedDepartment(e.target.value)} 
//                   className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
//                 >
//                   {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 cursor-pointer">
//           <StatCard title="Total Recruiters" count={summaryData.totalCompanies} icon={<Building2 />} color="indigo" />
//           <StatCard title="Placed Students" count={summaryData.totalPlaced} icon={<Users />} color="emerald" />
//           <StatCard title="Average Package" count={`₹${summaryData.avgLPA} LPA`} icon={<TrendingUp />} color="amber" />
//           <StatCard title="Highest Package" count={`₹${summaryData.highestLPA} LPA`} icon={<Award />} color="rose" />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 cursor-pointer">
//           <ChartContainer title="Recruitment Pipeline" subtitle="Monthly company visits">
//             <BarChart data={monthWiseData}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//               <XAxis dataKey="monthYear" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
//               <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
//               <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip unit=" companies" dataKey="companiesVisited" />} />
//               <Bar dataKey="companiesVisited" fill={COLORS.primary} radius={[6, 6, 0, 0]} barSize={30} />
//             </BarChart>
//           </ChartContainer>

//           <ChartContainer title="Hiring Velocity" subtitle="Student placement rate per month">
//             <LineChart data={monthWiseData}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//               <XAxis dataKey="monthYear" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
//               <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
//               <Tooltip content={<CustomTooltip unit=" students" />} />
//               <Line type="monotone" dataKey="studentsHired" stroke={COLORS.success} strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: COLORS.success }} activeDot={{ r: 6, strokeWidth: 0 }} />
//             </LineChart>
//           </ChartContainer>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 cursor-pointer">
//           <ChartContainer title="Salary Growth Trend" subtitle="Average package progression">
//             <AreaChart data={monthWiseData}>
//               <defs>
//                 <linearGradient id="colorLpa" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//               <XAxis dataKey="monthYear" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
//               <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
//               <Tooltip content={<CustomTooltip unit=" LPA" />} />
//               <Area type="monotone" dataKey="averagePackage" stroke={COLORS.warning} fillOpacity={1} fill="url(#colorLpa)" strokeWidth={3} />
//             </AreaChart>
//           </ChartContainer>

//           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center cursor-pointer">
//              <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h2 className="text-xl font-bold text-slate-800">Industry Partners</h2>
//                     <p className="text-slate-400 text-sm font-medium">Top global firms hiring our talent</p>
//                 </div>
//                 <Briefcase className="w-6 h-6 text-slate-300" />
//              </div>
//              <div className="space-y-8">
//                <CompanyScroller direction="ltr" speed="medium" />
//                <CompanyScroller direction="rtl" speed="medium" />
//              </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 cursor-pointer">
//           <ChartContainer title="Departmental Split" subtitle="Distribution of placed students">
//             <PieChart>
//               <Pie
//                 data={deptData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%" cy="50%"
//                 innerRadius={70}
//                 outerRadius={100}
//                 paddingAngle={8}
//               >
//                 {deptData.map((_, i) => <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} stroke="none" />)}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//               <Legend verticalAlign="bottom" iconType="circle" />
//             </PieChart>
//           </ChartContainer>

//           <ChartContainer title="Market Leaders" subtitle="Top 5 recruiting entities">
//             <BarChart data={topCompanies} layout="vertical" margin={{ left: 30, right: 30 }}>
//               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
//               <XAxis type="number" hide />
//               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{fontSize: '11px', fontWeight: '700', fill: '#64748b'}} />
//               <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip unit=" Students" />} />
//               <Bar dataKey="studentsHired" fill={COLORS.danger} radius={[0, 20, 20, 0]} barSize={20} />
//             </BarChart>
//           </ChartContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Modern Sub-Components ---

// const StatCard = ({ title, count, icon, color }) => {
//   const colorMap = {
//     indigo: "text-indigo-600 bg-indigo-50",
//     emerald: "text-emerald-600 bg-emerald-50",
//     amber: "text-amber-600 bg-amber-50",
//     rose: "text-rose-600 bg-rose-50"
//   };

//   return (
//     <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md group cursor-pointer">
//       <div className="flex items-center gap-4">
//         <div className={`p-3 rounded-2xl transition-colors ${colorMap[color]}`}>
//           {React.cloneElement(icon, { size: 24 })}
//         </div>
//         <div>
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
//           <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{count}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChartContainer = ({ title, subtitle, children }) => (
//   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 cursor-pointer">
//     <div className="mb-6">
//       <h2 className="text-xl font-bold text-slate-800 leading-none mb-1 cursor-pointer">{title}</h2>
//       <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
//     </div>
//     <div className="h-[300px] w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         {children}
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// export default PlacementTrendDashboard;

// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import { Building2, Users, TrendingUp, Award, Filter, Calendar, Briefcase } from 'lucide-react';
// import { API_BASE_URL } from '../../api';

// const COLORS = { chart: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'] };

// const PlacementTrendDashboard = () => {
//   const [rawPlacements, setRawPlacements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState('All');
//   const [selectedDepartment, setSelectedDepartment] = useState('All');

//   useEffect(() => {
//     const fetchPlacements = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/placements/all-placements`);
//         setRawPlacements(data);
//       } catch (error) { console.error("Error:", error); } 
//       finally { setLoading(false); }
//     };
//     fetchPlacements();
//   }, []);

//   const filteredRecords = useMemo(() => {
//     return rawPlacements.filter(item =>
//       (selectedYear === 'All' || item.year.toString() === selectedYear) &&
//       (selectedDepartment === 'All' || item.department === selectedDepartment)
//     );
//   }, [rawPlacements, selectedYear, selectedDepartment]);

//   const summaryData = useMemo(() => {
//     const placed = filteredRecords.filter(r => r.status === 'Placed');
//     const packages = placed.map(r => r.lpa).filter(l => l > 0);
//     return {
//       totalCompanies: new Set(placed.map(r => r.company)).size,
//       totalPlaced: placed.length,
//       avgLPA: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0,
//       highestLPA: packages.length ? Math.max(...packages).toFixed(2) : 0
//     };
//   }, [filteredRecords]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
//       <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <h1 className="text-4xl font-black text-slate-900">Placement Insights</h1>
//           <p className="text-slate-500 italic">Live tracking of institutional hiring trends</p>
//         </div>
//         <div className="flex bg-white p-2 rounded-2xl shadow-sm border">
//           <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="p-2 text-sm font-bold border-r">
//             <option value="All">All Years</option>
//             {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
//           </select>
//           <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="p-2 text-sm font-bold">
//             <option value="All">All Departments</option>
//             {['CSE','ECE','IT','MECH'].map(d => <option key={d} value={d}>{d}</option>)}
//           </select>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         <StatCard title="Recruiters" count={summaryData.totalCompanies} icon={<Building2 />} color="indigo" />
//         <StatCard title="Placed" count={summaryData.totalPlaced} icon={<Users />} color="emerald" />
//         <StatCard title="Avg Package" count={`₹${summaryData.avgLPA} LPA`} icon={<TrendingUp />} color="amber" />
//         <StatCard title="Highest" count={`₹${summaryData.highestLPA} LPA`} icon={<Award />} color="rose" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <ChartContainer title="Recruitment Stats"><ResponsiveContainer><BarChart data={filteredRecords}><XAxis dataKey="studentName" hide /><YAxis /><Tooltip /><Bar dataKey="lpa" fill="#6366f1" /></BarChart></ResponsiveContainer></ChartContainer>
//         <ChartContainer title="Department Distribution"><ResponsiveContainer><PieChart><Pie data={[{name: 'Placed', value: summaryData.totalPlaced}]} innerRadius={60} outerRadius={80} dataKey="value"><Cell fill="#10b981"/></Pie><Tooltip /></PieChart></ResponsiveContainer></ChartContainer>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, count, icon, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
//     <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>{icon}</div>
//     <div><p className="text-xs font-bold text-gray-400 uppercase">{title}</p><p className="text-2xl font-black">{count}</p></div>
//   </div>
// );

// const ChartContainer = ({ title, children }) => (
//   <div className="bg-white p-8 rounded-[2rem] shadow-sm border h-[400px]">
//     <h2 className="text-xl font-bold mb-6 text-slate-800">{title}</h2>
//     {children}
//   </div>
// );

// export default PlacementTrendDashboard;



import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  AreaChart, Area 
} from 'recharts';
import { 
  Building2, Users, TrendingUp, Award, Filter, 
  Calendar, Briefcase, ChevronRight, PieChart as PieIcon 
} from 'lucide-react';
import { API_BASE_URL } from '../../api';

const COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  chart: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4']
};

const PlacementTrendDashboard = () => {
  const [rawPlacements, setRawPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/placements/all-placements`);
        setRawPlacements(data);
      } catch (error) { 
        console.error("Error fetching data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchPlacements();
  }, []);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return rawPlacements.filter(item =>
      (selectedYear === 'All' || item.year.toString() === selectedYear) &&
      (selectedDepartment === 'All' || item.department === selectedDepartment)
    );
  }, [rawPlacements, selectedYear, selectedDepartment]);

  // Analytics Logic
  const summaryData = useMemo(() => {
    const placed = filteredRecords.filter(r => r.status === 'Placed');
    const packages = placed.map(r => r.lpa).filter(l => l > 0);
    return {
      totalCompanies: new Set(placed.map(r => r.company)).size,
      totalPlaced: placed.length,
      avgLPA: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0,
      highestLPA: packages.length ? Math.max(...packages).toFixed(2) : 0
    };
  }, [filteredRecords]);

  const deptData = useMemo(() => {
    const map = {};
    filteredRecords.filter(r => r.status === 'Placed').forEach(r => {
      map[r.department] = (map[r.department] || 0) + 1;
    });
    return Object.keys(map).map(dept => ({ name: dept, value: map[dept] }));
  }, [filteredRecords]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-24">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold animate-pulse">Syncing Placement Analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      {/* Background Decor Consistency */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[100%] bg-sky-100/50 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 -right-[10%] w-[50%] h-[80%] bg-indigo-100/50 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content with pt-24 to avoid header overlap */}
      <div className="relative z-10 container mx-auto px-4 pt-28 lg:pt-32 max-w-7xl">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Placement Insights</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live institutional hiring trends and analytics
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center px-3 border-r border-slate-100 gap-2">
              <Calendar size={16} className="text-slate-400" />
              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)} 
                className="p-2 text-sm font-bold bg-transparent outline-none cursor-pointer text-slate-700"
              >
                <option value="All">All Years</option>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center px-3 gap-2">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={selectedDepartment} 
                onChange={e => setSelectedDepartment(e.target.value)} 
                className="p-2 text-sm font-bold bg-transparent outline-none cursor-pointer text-slate-700"
              >
                <option value="All">All Departments</option>
                {['CSE','ECE','IT','MECH','CIVIL','AIDS'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Recruiters" count={summaryData.totalCompanies} icon={<Building2 />} color="indigo" />
          <StatCard title="Placed Students" count={summaryData.totalPlaced} icon={<Users />} color="emerald" />
          <StatCard title="Avg Package" count={`₹${summaryData.avgLPA} LPA`} icon={<TrendingUp />} color="amber" />
          <StatCard title="Highest Package" count={`₹${summaryData.highestLPA} LPA`} icon={<Award />} color="rose" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer title="Salary Distribution" subtitle="Package range vs Students">
            <BarChart data={filteredRecords.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="studentName" hide />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="lpa" fill={COLORS.primary} radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ChartContainer>

          <ChartContainer title="Departmental Split" subtitle="Distribution of placements">
            <PieChart>
              <Pie
                data={deptData.length ? deptData : [{name: 'No Data', value: 1}]}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
                {deptData.length === 0 && <Cell fill="#f1f5f9" />}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Bottom decorative section */}
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
           <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Need detailed reports?</h3>
              <p className="text-indigo-100 font-medium">Download the comprehensive placement report for the selected criteria.</p>
           </div>
           <button className="relative z-10 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer">
              Download Report
           </button>
           <Briefcase className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, count, icon, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900">{count}</p>
        </div>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, subtitle, children }) => (
  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white cursor-pointer hover:shadow-lg transition-shadow">
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
    </div>
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default PlacementTrendDashboard;