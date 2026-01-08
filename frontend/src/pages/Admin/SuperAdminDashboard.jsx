import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, ShieldCheck, FileCheck, Briefcase, TrendingUp, 
  Trash2, Edit, Plus, LogOut, MessageSquare, Search, 
  Filter, X, CheckCircle, AlertCircle 
} from 'lucide-react';

const SuperAdminDashboard = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user', phone: '', 
    gender: 'male', education: '', college: '', branch: '', passingYear: new Date().getFullYear()
  });

  // --- API Calls ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      
      const [statsRes, usersRes, feedbackRes] = await Promise.all([
        axios.get('/api/admin/stats', config),
        axios.get('/api/admin/users', config),
        axios.get('/api/feedback/all', config)
      ]);

      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setFeedback(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent Delete? This cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        await axios.delete(`/api/admin/users/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (editingUser) {
        await axios.put(`/api/admin/users/${editingUser._id}`, formData, config);
      } else {
        await axios.post('/api/admin/users', formData, config);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user, password: '' });
    } else {
      setEditingUser(null);
      setFormData({ 
        name: '', email: '', password: '', role: 'user', phone: '', 
        gender: 'male', education: '', college: '', branch: '', passingYear: 2024 
      });
    }
    setIsModalOpen(true);
  };

  // --- Filtered Lists ---
  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'users' ? u.role === 'user' : activeTab === 'faculty' ? u.role === 'faculty' : true)
  );

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-600">Initializng Secure Admin Session...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-black tracking-tighter text-black flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> SUPERADMIN
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<TrendingUp size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Users size={20}/>} label="Manage Students" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<ShieldCheck size={20}/>} label="Manage Faculty" active={activeTab === 'faculty'} onClick={() => setActiveTab('faculty')} />
          <NavItem icon={<MessageSquare size={20}/>} label="Feedbacks" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition cursor-pointer">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-gray-500 font-medium">Placement & Academic Control Center</p>
          </div>
          {(activeTab === 'users' || activeTab === 'faculty') && (
            <button onClick={() => openModal()} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 cursor-pointer shadow-lg active:scale-95 transition">
              <Plus size={20} /> Add New {activeTab === 'users' ? 'Student' : 'Faculty'}
            </button>
          )}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Users className="text-blue-600"/>} label="Total Students" value={stats?.userCount} bg="bg-blue-50" />
              <StatCard icon={<ShieldCheck className="text-purple-600"/>} label="Total Admins/Faculty" value={stats?.totalAdmins} bg="bg-purple-50" />
              <StatCard icon={<FileCheck className="text-green-600"/>} label="Approved Docs" value={stats?.approvedDocs} bg="bg-green-50" />
              <StatCard icon={<AlertCircle className="text-red-600"/>} label="Rejected Docs" value={stats?.rejectedDocs} bg="bg-red-50" />
              <StatCard icon={<TrendingUp className="text-emerald-600"/>} label="Highest Package" value={`${stats?.highestPackage} LPA`} bg="bg-emerald-50" />
              <StatCard icon={<Briefcase className="text-orange-600"/>} label="Average Package" value={`${stats?.averagePackage} LPA`} bg="bg-orange-50" />
              <StatCard icon={<CheckCircle className="text-indigo-600"/>} label="Companies Visited" value={stats?.totalCompaniesVisited} bg="bg-indigo-50" />
              <StatCard icon={<MessageSquare className="text-pink-600"/>} label="Total Feedback" value={feedback.length} bg="bg-pink-50" />
            </div>
          </div>
        )}

        {/* USER & FACULTY TAB */}
        {(activeTab === 'users' || activeTab === 'faculty') && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-white flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" placeholder="Search by name or email..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Department / RegNo</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'faculty' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{user.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.regNo || user.branch}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition"><Edit size={18}/></button>
                          <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map(item => (
              <div key={item._id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col cursor-pointer hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold uppercase">{item.user?.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-sm">{item.user?.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-black">⭐ {item.rating}</div>
                </div>
                <p className="text-gray-600 text-sm italic flex-1">"{item.message}"</p>
                <p className="text-[10px] text-gray-400 mt-4 text-right font-bold">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                {editingUser ? 'Update Account' : 'Register New Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black cursor-pointer"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              {!editingUser && (
                <Input label="Initial Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              )}
              <Input label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Account Role</label>
                <select 
                  className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">Student (User)</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">SuperAdmin</option>
                </select>
              </div>

              <Input label="Branch / Department" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} required />
              <Input label="College Name" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} required />
              <Input label="Passing Year" type="number" value={formData.passingYear} onChange={e => setFormData({...formData, passingYear: e.target.value})} />

              <div className="sm:col-span-2 pt-4">
                <button className="w-full bg-black text-white font-black py-4 rounded-2xl cursor-pointer hover:bg-gray-800 transition active:scale-[0.98]">
                  {editingUser ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition cursor-pointer font-bold ${
      active ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`${bg} p-6 rounded-3xl border border-white shadow-sm flex items-center gap-5 hover:scale-[1.03] transition duration-300 cursor-pointer`}>
    <div className="bg-white p-3 rounded-2xl shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{label}</p>
      <p className="text-2xl font-black text-black">{value || 0}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">{label}</label>
    <input 
      className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
      {...props}
    />
  </div>
);

export default SuperAdminDashboard;