// src/components/PlacementTrendDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import placementData from './Data/placementData';
import Footer from '../../components/Footer';
import CompanyScroller from '../CompanyScroller';

// Custom tooltip for Recharts - enhanced to show company list
const CustomTooltip = ({ active, payload, label, unit, dataKey }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data object for the hovered point
    return (
      <div className="p-3 bg-white border border-gray-300 rounded shadow-lg text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}{unit || ''}</span>
          </p>
        ))}
        {/* Specifically for Month-wise Company Visits, show the list of companies */}
        {dataKey === "companiesVisited" && data.companiesList && data.companiesList.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-700">Companies:</p>
            <ul className="list-disc list-inside text-gray-600">
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
  // Set default year to 2025
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Dynamically extract unique years from data, including 2025 as a default option if it exists
  const allYears = useMemo(() => {
    const years = new Set(placementData.map(d => d.year));
    return ['All', ...Array.from(years).sort((a, b) => a - b)];
  }, []);

  // Use the exact department list provided
  const allDepartments = useMemo(() => ([
    'All', 'CSE', 'CSE AIML', 'CSE IoT', 'CSE Cyber Security', 'AIDS', 'IT', 'EEE', 'ECE', 'CIVIL', 'MECHANICAL'
  ]), []);

  // Filtered data based on selections
  const filteredData = useMemo(() => {
    return placementData.filter(item =>
      (selectedYear === 'All' || item.year === parseInt(selectedYear)) &&
      (selectedDepartment === 'All' || item.department === selectedDepartment)
    );
  }, [selectedYear, selectedDepartment]);

  // --- Data Transformations for Charts and Summary Cards ---

  // Summary Cards Data
  const summaryData = useMemo(() => {
    const totalCompaniesVisited = new Set(filteredData.map(d => d.company)).size;
    const totalStudentsHired = filteredData.reduce((sum, d) => sum + d.studentsHired, 0);

    const validAvgPackages = filteredData.filter(d => d.avgPackage > 0).map(d => d.avgPackage);
    const avgPackage = validAvgPackages.length > 0
      ? (validAvgPackages.reduce((sum, d) => sum + d, 0) / validAvgPackages.length).toFixed(2)
      : 0;

    const validMaxPackages = filteredData.filter(d => d.maxPackage > 0).map(d => d.maxPackage);
    const highestPackage = validMaxPackages.length > 0
      ? Math.max(...validMaxPackages).toFixed(2)
      : 0;

    return { totalCompaniesVisited, totalStudentsHired, avgPackage, highestPackage };
  }, [filteredData]);

  // Month-wise Company Visits & Students Hired & Average Salary Trend (Combined for efficiency)
  const monthWiseData = useMemo(() => {
    const dataMap = filteredData.reduce((acc, item) => {
      const key = `${item.year}-${item.month}`;
      if (!acc[key]) {
        acc[key] = {
          month: item.month,
          companiesList: new Set(), // To store individual company names
          studentsHired: 0,
          avgPackageSum: 0,
          avgPackageCount: 0,
          year: item.year
        };
      }
      acc[key].companiesList.add(item.company);
      acc[key].studentsHired += item.studentsHired;
      acc[key].avgPackageSum += item.avgPackage;
      acc[key].avgPackageCount++;
      return acc;
    }, {});

    const orderedMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Group by year first, then by month
    const yearlyGrouped = Object.values(dataMap).reduce((acc, item) => {
        if (!acc[item.year]) {
            acc[item.year] = [];
        }
        acc[item.year].push(item);
        return acc;
    }, {});

    // Sort months within each year and flatten
    const sortedData = Object.keys(yearlyGrouped).sort((a, b) => a - b).flatMap(year => {
        return yearlyGrouped[year].sort((a, b) => orderedMonths.indexOf(a.month) - orderedMonths.indexOf(b.month))
            .map(item => ({
                monthYear: `${item.month.substring(0, 3)} ${item.year}`, // For display on X-axis
                companiesVisited: item.companiesList.size,
                companiesList: Array.from(item.companiesList), // Convert Set to Array for tooltip
                studentsHired: item.studentsHired,
                averagePackage: item.avgPackageCount > 0 ? parseFloat((item.avgPackageSum / item.avgPackageCount).toFixed(2)) : 0
            }));
    });

    return sortedData;
  }, [filteredData]);

  // Department-wise Hiring Distribution
  const departmentHiringData = useMemo(() => {
    const dataMap = filteredData.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + item.studentsHired;
      return acc;
    }, {});
    return Object.keys(dataMap).map(department => ({
      name: department,
      value: dataMap[department],
    }));
  }, [filteredData]);

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

  // Top Hiring Companies
  const topHiringCompanies = useMemo(() => {
    const dataMap = filteredData.reduce((acc, item) => {
      acc[item.company] = (acc[item.company] || 0) + item.studentsHired;
      return acc;
    }, {});
    return Object.keys(dataMap)
      .map(company => ({ name: company, studentsHired: dataMap[company] }))
      .sort((a, b) => b.studentsHired - a.studentsHired)
      .slice(0, 5); // Top 5
  }, [filteredData]);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pb-40">
      <h1 className="text-2xl font-bold text-gray-800 p-10">Placement Trend Dashboard</h1>
      {/* Company Scroller Effect */}
      {/* <CompanyScroller direction="ltr" speed="medium" /> */}
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="year-filter" className="font-medium text-gray-700">Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {allYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="department-filter" className="font-medium text-gray-700">Department:</label>
          <select
            id="department-filter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {allDepartments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Total Companies Visited</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{summaryData.totalCompaniesVisited}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Total Students Hired</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{summaryData.totalStudentsHired}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Average Package (LPA)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">₹{summaryData.avgPackage}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500">Highest Package (LPA)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">₹{summaryData.highestPackage}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Month-wise Company Visits */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Month-wise Company Visits</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthWiseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="monthYear" angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis />
              {/* Pass dataKey to CustomTooltip to conditionally render company list */}
              <Tooltip content={<CustomTooltip unit=" companies" dataKey="companiesVisited" />} />
              <Legend />
              <Bar dataKey="companiesVisited" fill="#8884d8" name="Companies Visited" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Month-wise Students Hired */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Month-wise Students Hired</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthWiseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="monthYear" angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis />
              <Tooltip content={<CustomTooltip unit=" students" />} />
              <Legend />
              <Line type="monotone" dataKey="studentsHired" stroke="#82ca9d" name="Students Hired" activeDot={{ r: 8 }} animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Salary Trend (LPA)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                          data={monthWiseData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="monthYear" angle={-45} textAnchor="end" height={60} interval={0} />
                          <YAxis />
                          <Tooltip content={<CustomTooltip unit=" LPA" />} />
                          <Area type="monotone" dataKey="averagePackage" stroke="#ffc658" fill="#ffc658" name="Avg. Package" animationDuration={1000} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Companies</h2>
                      <CompanyScroller direction="ltr" speed="medium" />
                      <CompanyScroller direction="rtl" speed="medium" />
              </div>
      </div>

      {/* Row 3: Average Salary Trend
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Salary Trend (LPA)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={monthWiseData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="monthYear" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip content={<CustomTooltip unit=" LPA" />} />
            <Area type="monotone" dataKey="averagePackage" stroke="#ffc658" fill="#ffc658" name="Avg. Package" animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Companies</h2>
                      <CompanyScroller direction="ltr" speed="medium" />
                      <CompanyScroller direction="rtl" speed="medium" />
      </div> */}

      {/* Row 4: Department-wise Hiring Distribution & Top Hiring Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Hiring Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Department-wise Hiring Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentHiringData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationDuration={1000}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentHiringData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit=" students" />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Hiring Companies (Horizontal Bar Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Hiring Companies (Students Hired)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topHiringCompanies}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip content={<CustomTooltip unit=" students" />} />
              <Legend />
              <Bar dataKey="studentsHired" fill="#FF8042" name="Students Hired" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
          <CompanyScroller direction="ltr" speed="medium" />
          {/* <CompanyScroller direction="rtl" speed="medium" />
          <CompanyScroller direction="ltr" speed="medium" /> */}
        </div>
    </div>
  );
};

export default PlacementTrendDashboard;