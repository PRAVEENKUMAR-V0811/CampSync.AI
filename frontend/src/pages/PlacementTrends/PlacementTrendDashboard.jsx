// src/pages/PlacementTrends/PlacementTrendDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { API_BASE_URL } from '../../api';
import CompanyScroller from '../CompanyScroller';

// Custom tooltip for Recharts - shows company list on hover
const CustomTooltip = ({ active, payload, label, unit, dataKey }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white border border-gray-300 rounded shadow-lg text-sm z-50">
        <p className="font-bold mb-1 text-gray-800">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}{unit || ''}</span>
          </p>
        ))}
        {/* If we are hovering over "Companies Visited", show the names of those companies */}
        {dataKey === "companiesVisited" && data.companiesList && data.companiesList.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-700">Recruiters:</p>
            <ul className="list-disc list-inside text-gray-600 max-h-32 overflow-y-auto">
              {data.companiesList.map((company, index) => (
                <li key={index}>{company}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const PlacementTrendDashboard = () => {
  const [rawPlacements, setRawPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const allDepartments = ['All', 'CSE', 'CSE AIML', 'CSE IoT', 'CSE Cyber Security', 'AIDS', 'IT', 'EEE', 'ECE', 'CIVIL', 'MECHANICAL'];

  // 1. Fetch all student records from the DB
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        // This endpoint fetches all records from the 'placements' collection
        const { data } = await axios.get(`${API_BASE_URL}/api/placements/all-placements`);
        setRawPlacements(data);
      } catch (error) {
        console.error("Error fetching placement analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  // 2. Filter raw data based on User UI selections
  const filteredRecords = useMemo(() => {
    return rawPlacements.filter(item =>
      (selectedYear === 'All' || item.year.toString() === selectedYear) &&
      (selectedDepartment === 'All' || item.department === selectedDepartment)
    );
  }, [rawPlacements, selectedYear, selectedDepartment]);

  // Dynamically get years available in the DB for the dropdown
  const allYears = useMemo(() => {
    const years = new Set(rawPlacements.map(d => d.year.toString()));
    return ['All', ...Array.from(years).sort((a, b) => b - a)];
  }, [rawPlacements]);

  // 3. --- AGGREGATION LOGIC (Transforming DB rows into Chart Data) ---

  // A. Summary Cards Calculation
  const summaryData = useMemo(() => {
    const placedOnes = filteredRecords.filter(r => r.status === 'Placed');
    const companies = new Set(placedOnes.map(r => r.company));
    const packages = placedOnes.map(r => r.lpa).filter(l => l > 0);

    return {
      totalCompanies: companies.size,
      totalPlaced: placedOnes.length,
      avgLPA: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0,
      highestLPA: packages.length ? Math.max(...packages).toFixed(2) : 0
    };
  }, [filteredRecords]);

  // B. Monthly Aggregation (Group by Month of Creation)
  const monthWiseData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize empty months
    const stats = monthNames.map(name => ({
      monthYear: name,
      companiesList: new Set(),
      studentsHired: 0,
      lpaSum: 0,
      lpaCount: 0
    }));

    filteredRecords.forEach(record => {
      // Use DB timestamp to determine the month
      const date = new Date(record.createdAt);
      const mIdx = date.getMonth(); 

      if (record.status === 'Placed') {
        stats[mIdx].studentsHired += 1;
        stats[mIdx].companiesList.add(record.company);
        if (record.lpa > 0) {
          stats[mIdx].lpaSum += record.lpa;
          stats[mIdx].lpaCount += 1;
        }
      }
    });

    return stats.map(item => ({
      ...item,
      companiesVisited: item.companiesList.size,
      companiesList: Array.from(item.companiesList),
      averagePackage: item.lpaCount > 0 ? parseFloat((item.lpaSum / item.lpaCount).toFixed(2)) : 0
    }));
  }, [filteredRecords]);

  // C. Department distribution for Pie Chart
  const deptData = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      if (r.status === 'Placed') {
        map[r.department] = (map[r.department] || 0) + 1;
      }
    });
    return Object.keys(map).map(dept => ({ name: dept, value: map[dept] }));
  }, [filteredRecords]);

  // D. Top 5 Companies Horizontal Bar Chart
  const topCompanies = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      if (r.status === 'Placed') {
        map[r.company] = (map[r.company] || 0) + 1;
      }
    });
    return Object.keys(map)
      .map(name => ({ name, studentsHired: map[name] }))
      .sort((a, b) => b.studentsHired - a.studentsHired)
      .slice(0, 5);
  }, [filteredRecords]);

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Fetching Live Placement Trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pb-40">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Placement Analytics</h1>
        <p className="text-gray-500 mb-8 font-medium italic">Showing dynamic trends based on faculty-updated student records.</p>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Batch Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              className="p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {allYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Department</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)} 
              className="p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Companies Visited" count={summaryData.totalCompanies} icon="🏢" color="border-blue-500" />
          <StatCard title="Students Placed" count={summaryData.totalPlaced} icon="🎓" color="border-green-500" />
          <StatCard title="Average Package" count={`₹${summaryData.avgLPA} LPA`} icon="📈" color="border-yellow-500" />
          <StatCard title="Highest Package" count={`₹${summaryData.highestLPA} LPA`} icon="🏆" color="border-red-500" />
        </div>

        {/* Chart Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartWrapper title="Monthly Recruitment Activity">
            <BarChart data={monthWiseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthYear" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip unit=" companies" dataKey="companiesVisited" />} />
              <Bar dataKey="companiesVisited" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
            </BarChart>
          </ChartWrapper>

          <ChartWrapper title="Hiring Pace (Students Per Month)">
            <LineChart data={monthWiseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthYear" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip content={<CustomTooltip unit=" students" />} />
              <Line type="monotone" dataKey="studentsHired" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ChartWrapper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartWrapper title="Salary Progression (LPA Trend)">
            <AreaChart data={monthWiseData}>
              <defs>
                <linearGradient id="colorLpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthYear" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip unit=" LPA" />} />
              <Area type="monotone" dataKey="averagePackage" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLpa)" strokeWidth={3} />
            </AreaChart>
          </ChartWrapper>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
               <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
               Our Recruiting Partners
             </h2>
             <div className="space-y-6">
               <CompanyScroller direction="ltr" speed="medium" />
               <CompanyScroller direction="rtl" speed="medium" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartWrapper title="Placement Distribution by Department">
            <PieChart>
              <Pie
                data={deptData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deptData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ChartWrapper>

          <ChartWrapper title="Top Hiring Entities">
            <BarChart data={topCompanies} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{fontSize: '12px', fontWeight: 'bold'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="studentsHired" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={25} />
            </BarChart>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};

// --- Styled Sub-Components ---

const StatCard = ({ title, count, icon, color }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-8 ${color} transition-transform hover:scale-[1.02] duration-300`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900">{count}</p>
      </div>
      <span className="text-2xl bg-gray-50 p-2 rounded-lg">{icon}</span>
    </div>
  </div>
);

const ChartWrapper = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
      <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
      {title}
    </h2>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default PlacementTrendDashboard;