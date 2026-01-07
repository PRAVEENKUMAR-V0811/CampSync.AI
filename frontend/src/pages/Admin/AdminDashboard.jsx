import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import AuthContext from '../Auth/AuthContext';
import { API_BASE_URL } from '../../api';

// --- Enhanced Icon Set ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Pending: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Approved: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Rejected: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Student: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Feedback: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Plus: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState({ userCount: 0, totalDocs: 0, approvedDocs: 0, rejectedDocs: 0, pendingDocs: 0 });
  const [placementStats, setPlacementStats] = useState({ totalStudents: 0, placedCount: 0, unplacedCount: 0, highestLPA: 0, lowestLPA: 0, avgLPA: 0 });

  const getAuthConfig = () => ({ headers: { Authorization: `Bearer ${user?.token}` } });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/stats`, getAuthConfig()),
        axios.get(`${API_BASE_URL}/api/placements/faculty-stats`, getAuthConfig())
      ]);
      setStats(sRes.data);
      setPlacementStats(pRes.data);
    } catch (err) {
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.token) fetchData(); }, [user]);

  const sidebarLinks = [
    { id: 'dashboard', label: 'Overview', icon: <Icons.Dashboard />, badge: 0 },
    { id: 'Pending', label: 'Pending Papers', icon: <Icons.Pending />, badge: stats.pendingDocs },
    { id: 'Approved', label: 'Approved Papers', icon: <Icons.Approved />, badge: 0 },
    { id: 'Rejected', label: 'Rejected Papers', icon: <Icons.Rejected />, badge: 0 },
    { id: 'placements', label: 'Manage Placements', icon: <Icons.Student />, badge: 0 },
    { id: 'academic-approvals', label: 'Academic Requests', icon: <Icons.Shield />, badge: 0 },
    { id: 'feedback', label: 'User Feedback', icon: <Icons.Feedback />, badge: 0 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20 fixed h-full">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">A</div>
            <h1 className="text-xl font-bold tracking-tight">ADMIN <span className="text-blue-500">PANEL</span></h1>
          </div>

          <nav className="space-y-1.5">
            {sidebarLinks.map(link => (
              <SidebarItem 
                key={link.id} 
                {...link} 
                active={activeTab === link.id} 
                onClick={() => setActiveTab(link.id)} 
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
          <button onClick={() => toast("Super Admin login coming soon!")} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all">
             <Icons.Shield /> Super Admin Login
          </button>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
            <Icons.Logout /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#f8fafc]/80 backdrop-blur-md px-10 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
                {activeTab === 'dashboard' ? 'System Overview' : activeTab.replace(/([A-Z])/g, ' $1').replace('-', ' ')}
            </h2>
            <p className="text-sm text-slate-500 font-medium">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 px-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">System Live</span>
          </div>
        </header>

        <div className="px-10 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' ? (
                <DashboardHome stats={stats} placementStats={placementStats} />
              ) : activeTab === 'placements' ? (
                <PlacementManager getAuthConfig={getAuthConfig} refreshStats={fetchData} />
              ) : activeTab === 'academic-approvals' ? (
                <AcademicApprovalManager getAuthConfig={getAuthConfig} />
              ) : activeTab === 'feedback' ? (
                <FeedbackList getAuthConfig={getAuthConfig} />
              ) : (
                <DocumentTable status={activeTab} getAuthConfig={getAuthConfig} refreshStats={fetchData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Dashboard Home Component ---
const DashboardHome = ({ stats, placementStats }) => (
    <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" count={stats.userCount} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
            <StatCard title="Total Docs" count={stats.totalDocs} color="text-slate-600" bg="bg-slate-50" border="border-slate-100" />
            <StatCard title="Approved" count={stats.approvedDocs} color="text-green-600" bg="bg-green-50" border="border-green-100" />
            <StatCard title="Rejected" count={stats.rejectedDocs} color="text-red-600" bg="bg-red-50" border="border-red-100" />
        </div>

        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Icons.Student /> Placement Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <SmallStatCard title="Total Students" val={placementStats.totalStudents} border="border-l-indigo-500" />
                <SmallStatCard title="Placed" val={placementStats.placedCount} border="border-l-green-500" />
                <SmallStatCard title="Non-Placed" val={placementStats.unplacedCount} border="border-l-orange-500" />
                <SmallStatCard title="Highest LPA" val={`₹${placementStats.highestLPA}`} border="border-l-yellow-500" />
                <SmallStatCard title="Lowest LPA" val={`₹${placementStats.lowestLPA}`} border="border-l-red-500" />
                <SmallStatCard title="Avg LPA" val={`₹${placementStats.avgLPA}`} border="border-l-blue-500" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-700 mb-6">Salary Distribution</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Highest', val: placementStats.highestLPA },
                            { name: 'Average', val: placementStats.avgLPA },
                            { name: 'Lowest', val: placementStats.lowestLPA }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={50}>
                                <Cell fill="#3b82f6" /><Cell fill="#6366f1" /><Cell fill="#94a3b8" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <h4 className="font-bold text-slate-700 mb-6 w-full text-left">Placement Ratio</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie 
                            data={[
                                { name: 'Placed', value: placementStats.placedCount },
                                { name: 'Unplaced', value: placementStats.unplacedCount }
                            ]} 
                            innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value"
                        >
                            <Cell fill="#22c55e" /><Cell fill="#e2e8f0" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <p className="mt-4 text-3xl font-black text-slate-800">
                    {Math.round((placementStats.placedCount / placementStats.totalStudents) * 100) || 0}%
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
            </div>
        </div>
    </div>
);

// --- PLACEMENT MANAGER (UPDATED) ---
const PlacementManager = ({ getAuthConfig, refreshStats }) => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchRegNo, setSearchRegNo] = useState("");
  const [searching, setSearching] = useState(false);
  
  const initialFormState = { 
    studentId: '', name: '', regNo: '', placementStatus: 'Not Placed', 
    recentCompany: '', packageLPA: '', jobType: 'Full Time', 
    internStipend: 0, noOfOffers: 0 
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchPlacements = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/managed-by-me`, getAuthConfig());
      setStudents(data);
    } catch (err) { console.error("Sync failed"); }
  };

  useEffect(() => { fetchPlacements(); }, []);

  const handleSearch = async () => {
    if(!searchRegNo) return toast.error("Enter Register Number");
    setSearching(true);
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/students/search/${searchRegNo}`, getAuthConfig());
        setFormData({ 
            ...initialFormState, 
            studentId: data._id, name: data.name, regNo: data.regNo, 
            placementStatus: data.placementStatus, recentCompany: data.recentCompany,
            packageLPA: data.packageLPA, jobType: data.jobType, internStipend: data.internStipend
        });
        toast.success("Student details fetched!");
    } catch (err) {
        toast.error(err.response?.data?.message || "Student not found in MongoDB");
    } finally { setSearching(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.studentId) return toast.error("Please search and fetch a student first");
    const tid = toast.loading("Updating records...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/students/placement-update/${formData.studentId}`, formData, getAuthConfig());
      toast.success("Placement status updated!", { id: tid });
      setShowModal(false); setFormData(initialFormState); setSearchRegNo("");
      fetchPlacements(); refreshStats();
    } catch (err) { toast.error("Update failed", { id: tid }); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center">
        <div>
           <h3 className="text-xl font-black text-slate-800 tracking-tight">Placement Database</h3>
           <p className="text-sm text-slate-500">Only showing students managed by your department.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all">
          <Icons.Plus /> Search & Add Student
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Student / Reg</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Company & Job</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Package</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => (
              <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{s.regNo}</p>
                </td>
                <td className="px-6 py-5">
                    <p className="font-bold text-slate-700">{s.recentCompany || 'N/A'}</p>
                    <p className="text-xs text-slate-400 font-medium">{s.jobType}</p>
                </td>
                <td className="px-6 py-5">
                    <p className="font-black text-green-600">₹{s.packageLPA} LPA</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Stipend: ₹{s.internStipend}</p>
                </td>
                <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${s.placementStatus === 'Placed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                        {s.placementStatus}
                    </span>
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button onClick={() => { setFormData({...s, studentId: s._id}); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Icons.Edit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-800">Manage Placement Record</h3>
                <button onClick={() => {setShowModal(false); setFormData(initialFormState);}} className="text-slate-400 hover:text-slate-600 font-bold">Close</button>
             </div>
             <div className="p-8 pb-4">
                <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <Icons.Search />
                        <input 
                            placeholder="Enter Register Number from MongoDB..." 
                            className="bg-transparent border-none outline-none w-full font-bold text-sm"
                            value={searchRegNo}
                            onChange={(e) => setSearchRegNo(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSearch} disabled={searching} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                        {searching ? 'Fetching...' : 'Fetch'}
                    </button>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="p-8 pt-4 grid grid-cols-2 gap-4">
                <Input label="Student Name" value={formData.name} readOnly placeholder="Search to fetch name" />
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Placement Status</label>
                    <select value={formData.placementStatus} onChange={e => setFormData({...formData, placementStatus: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold">
                        <option value="Not Placed">Not Placed</option>
                        <option value="Placed">Placed</option>
                    </select>
                </div>
                <Input label="Recent Company Placed" value={formData.recentCompany} onChange={v => setFormData({...formData, recentCompany: v})} placeholder="Google" />
                <Input label="Package (LPA)" type="number" step="0.1" value={formData.packageLPA} onChange={v => setFormData({...formData, packageLPA: v})} />
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Job Type</label>
                    <select value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold">
                        <option value="Full Time">Full Time</option>
                        <option value="Intern + Full Time">Intern + Full Time</option>
                        <option value="N/A">N/A</option>
                    </select>
                </div>
                <Input label="Intern Stipend" type="number" value={formData.internStipend} onChange={v => setFormData({...formData, internStipend: v})} />
                <Input label="No. of Offers" type="number" value={formData.noOfOffers} onChange={v => setFormData({...formData, noOfOffers: v})} />
                
                <div className="col-span-2 mt-4">
                    <button type="submit" disabled={!formData.studentId} className="w-full py-4 bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">
                        Sync & Update Status
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ACADEMIC APPROVAL MANAGER ---
const AcademicApprovalManager = ({ getAuthConfig }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/academic-requests`, getAuthConfig());
            setRequests(data);
        } catch (e) { toast.error("Sync failed"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleApproval = async (id, approve = true) => {
        const tid = toast.loading(approve ? "Approving..." : "Rejecting...");
        try {
            await axios.put(`${API_BASE_URL}/api/admin/academic-verification/${id}`, { approve }, getAuthConfig());
            toast.success(approve ? "Profile Verified" : "Update Rejected", { id: tid });
            fetchRequests();
        } catch (e) { toast.error("Action failed", { id: tid }); }
    };

    if (loading) return <div className="text-center p-20 font-bold text-slate-400">Filtering verification requests...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(req => (
                <div key={req._id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="font-black text-slate-800 leading-tight">{req.name}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{req.regNo}</p>
                        </div>
                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">Verification Needed</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <VerificationField
                        label="CGPA"
                        oldVal={req.cgpa}
                        newVal={req.pendingData?.cgpa} // Changed from pendingAcademicUpdate
                      />
                      <VerificationField
                        label="Current Sem"
                        oldVal={req.currentSemester}
                        newVal={req.pendingData?.currentSemester}
                      />
                      <VerificationField
                        label="History of Arrear"
                        oldVal={req.historyOfArrear}
                        newVal={req.pendingData?.historyOfArrear}
                      />
                      <VerificationField
                        label="Backlogs"
                        oldVal={req.currentBacklog}
                        newVal={req.pendingData?.currentBacklog}
                      />
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-slate-50">
                        <button onClick={() => handleApproval(req._id, false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Discard</button>
                        <button onClick={() => handleApproval(req._id, true)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Verify & Update</button>
                    </div>
                </div>
            ))}
            {requests.length === 0 && <div className="col-span-2 text-center p-20 text-slate-400 font-bold">No pending academic verifications.</div>}
        </div>
    );
};

const VerificationField = ({ label, oldVal, newVal }) => (
    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
        <div className="flex items-center gap-2">
            <span className="text-xs line-through text-slate-400">{oldVal}</span>
            <span className="text-indigo-600">→</span>
            <span className="text-sm font-black text-slate-800">{newVal}</span>
        </div>
    </div>
);

// --- Sub Components ---

const SidebarItem = ({ label, icon, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
  >
    <span className={`mr-3 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">{badge}</span>}
  </button>
);

const StatCard = ({ title, count, color, bg, border }) => (
  <div className={`bg-white p-6 rounded-3xl border ${border} shadow-sm flex flex-col gap-1`}>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className={`text-3xl font-black ${color}`}>{count}</h3>
  </div>
);

const SmallStatCard = ({ title, val, border }) => (
    <div className={`bg-white p-4 rounded-xl border-l-4 ${border} shadow-sm`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{title}</p>
        <p className="text-lg font-black text-slate-700">{val}</p>
    </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, ...props }) => (
    <div className="col-span-1">
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{label}</label>
        <input required type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold placeholder:text-slate-300" {...props} />
    </div>
);

// --- FEEDBACK LIST ---
const FeedbackList = ({ getAuthConfig }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/feedback/all`, getAuthConfig());
            setFeedbacks(data);
        } catch (e) { toast.error("Feedback sync failed"); }
        finally { setLoading(false); }
    })();
  }, []);

  const getCatStyle = (c) => {
    if (c === 'Bug Report') return 'bg-rose-50 text-rose-600 border-rose-100';
    if (c === 'Feature Request') return 'bg-purple-50 text-purple-600 border-purple-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  if (loading) return <div className="text-center p-20 text-slate-400 font-bold">Loading Community Pulse...</div>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {feedbacks.map(item => (
        <div key={item._id} className="bg-white p-8 rounded-[2rem] border border-slate-200 flex gap-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg shadow-blue-100">
            {item.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-black text-slate-800 leading-tight">{item.user?.name || 'Anonymous User'}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.user?.email}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getCatStyle(item.category)}`}>{item.category}</span>
             </div>
             <p className="text-slate-600 font-medium leading-relaxed italic">"{item.message}"</p>
             <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < item.rating ? 'text-amber-400' : 'text-slate-100'}`}>★</span>
                    ))}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- DOCUMENT TABLE ---
const DocumentTable = ({ status, getAuthConfig, refreshStats }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, id: null });
  const [reason, setReason] = useState("");

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/papers?status=${status}`, getAuthConfig());
      setPapers(data);
    } catch (e) { toast.error("Failed to load documents"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPapers(); }, [status]);

  const handleAction = async (endpoint, payload = {}) => {
    const tid = toast.loading("Updating status...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/${endpoint}/${modal.id}`, payload, getAuthConfig());
      toast.success("Updated Successfully", { id: tid });
      setModal({ type: null, id: null }); setReason("");
      fetchPapers(); refreshStats();
    } catch (e) { toast.error("Action failed", { id: tid }); }
  };

  const handleDelete = async () => {
    const tid = toast.loading("Deleting...");
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/question-papers/${modal.id}`, getAuthConfig());
      toast.success("Deleted", { id: tid });
      setModal({ type: null, id: null }); fetchPapers(); refreshStats();
    } catch (e) { toast.error("Failed", { id: tid }); }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Fetching Archive...</div>;

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Title & Subject</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Exam Context</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Uploader</th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {papers.map(p => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                   <p className="font-bold text-slate-800">{p.title}</p>
                   <p className="text-xs text-slate-400 font-medium">{p.subject}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-sm font-bold text-slate-600">{p.exam_name}</p>
                   <p className="text-[10px] font-black text-blue-500 uppercase">{p.year}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-sm font-semibold text-slate-700">{p.uploaded_by_user?.name}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(p.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-5 text-right space-x-1">
                   <a href={p.file_url} target="_blank" rel="noreferrer" className="p-2 inline-block text-slate-400 hover:text-blue-600"><Icons.Eye /></a>
                   {status === 'Pending' && (
                     <>
                        <button onClick={() => setModal({type: 'approve', id: p._id})} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"><Icons.Approved /></button>
                        <button onClick={() => setModal({type: 'reject', id: p._id})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Icons.Rejected /></button>
                     </>
                   )}
                   {(status === 'Approved' || status === 'Rejected') && (
                        <button onClick={() => setModal({type: 'delete', id: p._id})} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"><Icons.Trash /></button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {papers.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">No {status} documents found.</div>}
      </div>

      {/* Logic Modals */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl text-center">
                {modal.type === 'approve' && (
                    <>
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Icons.Approved /></div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Confirm Approval</h3>
                        <p className="text-slate-500 mb-8">This paper will be made visible to all students immediately.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setModal({type:null, id:null})} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                            <button onClick={() => handleAction('paper-status', {status: 'Approved'})} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold">Approve</button>
                        </div>
                    </>
                )}
                {modal.type === 'reject' && (
                    <>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Rejection Reason</h3>
                        <p className="text-sm text-slate-500 mb-6">Explain why this paper was rejected.</p>
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                            {["Blurry", "Wrong Year", "Duplicate"].map(r => (
                                <button key={r} onClick={() => setReason(r)} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors">{r}</button>
                            ))}
                        </div>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 mb-6 font-semibold" placeholder="Type reason..." rows="3" />
                        <div className="flex gap-4">
                            <button onClick={() => setModal({type:null, id:null})} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                            <button onClick={() => handleAction('paper-status', {status: 'Rejected', rejection_reason: reason})} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold">Reject</button>
                        </div>
                    </>
                )}
                {modal.type === 'delete' && (
                    <>
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Icons.Trash /></div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Delete Forever?</h3>
                        <p className="text-slate-500 mb-8">This action cannot be undone. All file data will be purged.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setModal({type:null, id:null})} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold">Delete</button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;