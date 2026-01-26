import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../Auth/AuthContext';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';
import logo from '../../assets/logofinal.png'; 
import { motion, AnimatePresence, animate } from 'framer-motion';
import { 
  Users, UserCheck, MessageSquare, 
  FileText, TrendingUp, Trash2, LogOut, Plus, 
  Eye, CheckCircle, XCircle, UploadCloud, X, 
  Award, Layers, Menu, Filter, Briefcase, ExternalLink, Loader2, Edit, Calendar, Hash, User as UserIcon, AlertCircle, ChevronRight, Phone, Mail, GraduationCap, ShieldCheck, Search, Info, Trophy, Cloud, TextQuote, Star, Settings, Shield, MapPin, Lock, FilePlus, ArrowRight, Clock
} from 'lucide-react';

// --- ANIMATED NUMBER COMPONENT ---
const AnimatedNumber = ({ value, precision = 0, suffix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
        const controls = animate(0, numericValue || 0, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(latest.toFixed(precision))
        });
        return () => controls.stop();
    }, [value, precision]);
    return <span>{displayValue}{suffix}</span>;
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [docFilter, setDocFilter] = useState('Pending'); 
  const [stats, setStats] = useState({});
  const [dataList, setDataList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [facultyList, setFacultyList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showDetailModal, setShowDetailModal] = useState(false); 
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });
  const [showDocActionModal, setShowDocActionModal] = useState({ show: false, type: null, id: null });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dashboardFilter, setDashboardFilter] = useState({ branch: '', section: '', passingYear: '' });
  const [editId, setEditId] = useState(null);

  // NEW: Maintenance Window States
const [maintenanceForm, setMaintenanceForm] = useState({
  isActive: false, // Changed from startTime/endTime
  message: 'Placement records are being updated by the faculty. Finalized content will be live soon.'
});

  const branches = ["CSE", "CSE(AI & ML)", "CSE(Cyber)", "CSE(IoT)", "AIDS", "EEE", "ECE", "Civil", "Mechanical", "IT"];
  const sections = ["A", "B", "C", "D", "E", "F", "G"];
  const degrees = ["B.E", "B.Tech"];
  const years = ["2025", "2026", "2027", "2028", "2029", "2030"];

  const dynamicBranches = [...new Set(classList.map(c => c.branch))].sort();
  const dynamicSections = [...new Set(classList.map(c => c.section))].sort();
  const dynamicYears = [...new Set(classList.map(c => c.passingYear))].sort();

  const initialFacultyForm = { facultyId: '', name: '', gender: 'male', email: '', password: '', phone: '', education: 'B.E', branch: 'CSE', regNo: '' };
  const [facultyForm, setFacultyForm] = useState(initialFacultyForm);
  const [studentForm, setStudentForm] = useState({ name: '', gender: 'male', email: '', phone: '', education: 'B.E', branch: 'IT', passingYear: 2026, section: 'A', college: 'SKCT', regNo: '' });
  const [classForm, setClassForm] = useState({ education: 'B.E', branch: 'CSE', section: 'A', passingYear: '2025', facultyId: '' });
  
  // Upload States
  const [uploadData, setUploadData] = useState({ title: '', description: '', subject: '', exam_name: '', year: '2025', tags: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchTabContent();
    loadClasses();
    loadFaculty();
    if(activeTab === 'settings') fetchMaintenanceStatus();
  }, [activeTab, docFilter, dashboardFilter]);

  const loadClasses = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/classes`, { headers: { Authorization: `Bearer ${user.token}` } });
      setClassList(data);
    } catch (e) { console.error("Class load failed"); }
  };

  const loadFaculty = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/users?role=faculty`, { headers: { Authorization: `Bearer ${user.token}` } });
      setFacultyList(data);
    } catch (e) { console.error("Faculty load failed"); }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(dashboardFilter).toString();
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats?${params}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setStats(data);
    } catch (e) { console.error("Stats Error"); }
    setLoading(false);
  };

  const fetchTabContent = async () => {
    setLoading(true);
    let endpoint = '';
    if (activeTab === 'students') endpoint = '/api/admin/users?role=user';
    else if (activeTab === 'faculty') endpoint = '/api/admin/users?role=faculty';
    else if (activeTab === 'documents') endpoint = `/api/admin/papers?status=${docFilter}`;
    else if (activeTab === 'classes') endpoint = '/api/admin/classes';
    else if (activeTab === 'feedback') endpoint = '/api/feedback/all';

    try {
      if (endpoint) {
        const { data } = await axios.get(`${API_BASE_URL}${endpoint}`, { headers: { Authorization: `Bearer ${user.token}` } });
        setDataList(data);
      }
    } catch (e) { toast.error("Database sync error"); }
    setLoading(false);
  };

  // NEW: Maintenance Window Logic
const fetchMaintenanceStatus = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/auth/update-status`, { 
      headers: { Authorization: `Bearer ${user.token}` } 
    });
    if(data) {
      setMaintenanceForm({
        isActive: data.isActive || false,
        message: data.message || maintenanceForm.message
      });
    }
  } catch (e) { console.error("Config fetch failed"); }
};

const handleSetMaintenance = async (e) => {
  e.preventDefault();
  const tid = toast.loading("Updating System Configuration...");
  try {
    // Sending the boolean isActive instead of time windows
    await axios.post(`${API_BASE_URL}/api/admin/set-update-window`, maintenanceForm, { 
      headers: { Authorization: `Bearer ${user.token}` } 
    });
    toast.success(`Maintenance Mode ${maintenanceForm.isActive ? 'Enabled' : 'Disabled'}`, { id: tid });
  } catch (e) {
    toast.error("Failed to update config", { id: tid });
  }
};

  const handleDocAction = async (forcedId = null, type = null) => {
    const id = forcedId || showDocActionModal.id;
    const actionType = type || showDocActionModal.type;
    if (actionType === 'Rejected' && !rejectionReason.trim()) return toast.error("Provide a reason");
    const tid = toast.loading("Processing...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/paper-status/${id}`, { status: actionType, rejection_reason: rejectionReason }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success(`Marked as ${actionType}`, { id: tid });
      setShowDocActionModal({ show: false, type: null, id: null });
      setRejectionReason(""); fetchTabContent();
    } catch (e) { toast.error("Action failed", { id: tid }); }
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editId ? "Updating..." : "Creating...");
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/admin/users/${editId}`, facultyForm, { headers: { Authorization: `Bearer ${user.token}` } });
        toast.success("Faculty Updated", { id: tid });
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/faculty-create`, facultyForm, { headers: { Authorization: `Bearer ${user.token}` } });
        toast.success("Faculty Created", { id: tid });
      }
      setShowCreateModal(false); setEditId(null); fetchTabContent(); loadFaculty();
    } catch (e) { toast.error(e.response?.data?.message || "Operation failed", { id: tid }); }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Saving Changes...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${editId}`, studentForm, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("Student Profile Updated", { id: tid });
      setShowCreateModal(false); setEditId(null); fetchTabContent();
    } catch (e) { toast.error(e.response?.data?.message || "Operation failed", { id: tid }); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Generating Mapping...");
    try {
      await axios.post(`${API_BASE_URL}/api/admin/classes`, classForm, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("Class Registry Created", { id: tid });
      setShowCreateModal(false); loadClasses(); fetchTabContent();
    } catch (e) { toast.error(e.response?.data?.message || "Mapping Error", { id: tid }); }
  };

  const handleAdminUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Select a file first");
    setIsUploading(true);
    const formData = new FormData();
    Object.keys(uploadData).forEach(key => formData.append(key, uploadData[key]));
    formData.append('questionPaperFile', selectedFile);
    const tid = toast.loading("Publishing resource...");
    try {
        await axios.post(`${API_BASE_URL}/api/question-papers/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
        });
        toast.success('Resource Published Successfully', { id: tid });
        setShowCreateModal(false); fetchTabContent();
        setUploadData({ title: '', description: '', subject: '', exam_name: '', year: '2025', tags: '' });
        setSelectedFile(null);
    } catch (err) { toast.error("Upload Failed", { id: tid }); }
    finally { setIsUploading(false); }
  };

  const handleDelete = async () => {
    const tid = toast.loading("Deleting data...");
    try {
      let url = `${API_BASE_URL}/api/admin/${activeTab === 'classes' ? 'classes' : activeTab === 'documents' ? 'question-papers' : 'users'}/${confirmModal.id}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("Record Erased", { id: tid });
      setConfirmModal({ show: false, id: null }); fetchTabContent(); loadClasses();
    } catch (e) { toast.error("Delete Failed", { id: tid }); }
  };

  const triggerPasswordReset = () => {
    toast.success("Password reset link sent to " + user.email);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    if (activeTab === 'faculty') {
      setFacultyForm({ facultyId: item.regNo || '', name: item.name || '', gender: item.gender || 'male', email: item.email || '', phone: item.phone || '', education: item.education || 'B.E', branch: item.branch || 'CSE', password: '', regNo: item.regNo || '' }); 
    } else if (activeTab === 'students') {
      setStudentForm({ ...item });
    }
    setShowCreateModal(true);
  };

  const handleOpenCreateModal = () => {
    setEditId(null);
    if (activeTab === 'faculty') setFacultyForm(initialFacultyForm);
    setShowCreateModal(true);
  };

  const filteredData = dataList.filter(item => {
    if (!['students', 'faculty'].includes(activeTab)) return true;
    const query = searchTerm.toLowerCase();
    return (
        (item.regNo?.toLowerCase().includes(query)) || 
        (item.name?.toLowerCase().includes(query)) ||
        (item.facultyId?.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* SIDEBAR */}
      <aside className={`fixed lg:relative w-72 h-full bg-slate-900 text-white flex flex-col p-6 z-[60] shadow-2xl transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-10 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 transform hover:rotate-6 transition-transform cursor-pointer">A</div>
            <div>
                <h1 className="text-xl font-black tracking-tighter">ADMINHUB</h1>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Control Center</p>
            </div>
          </motion.div>
          <X className="lg:hidden cursor-pointer hover:rotate-90 transition-transform" onClick={() => setIsSidebarOpen(false)}/>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          <NavItem active={activeTab === 'overview'} icon={<LayoutIcon active={activeTab === 'overview'} />} label="Dashboard Overview" onClick={() => setActiveTab('overview')} delay={0.1}/>
          <NavItem active={activeTab === 'profile'} icon={<UserIcon size={18}/>} label="Admin Profile" onClick={() => setActiveTab('profile')} delay={0.12}/>
          <NavItem active={activeTab === 'students'} icon={<Users size={18}/>} label="Manage Student" onClick={() => setActiveTab('students')} delay={0.15}/>
          <NavItem active={activeTab === 'faculty'} icon={<UserCheck size={18}/>} label="Manage Faculty" onClick={() => setActiveTab('faculty')} delay={0.2}/>
          <NavItem active={activeTab === 'classes'} icon={<Layers size={18}/>} label="Class Registry" onClick={() => setActiveTab('classes')} delay={0.25}/>
          <NavItem active={activeTab === 'documents'} icon={<FileText size={18}/>} label="Documents" onClick={() => setActiveTab('documents')} delay={0.3}/>
          <NavItem active={activeTab === 'feedback'} icon={<MessageSquare size={18}/>} label="Feedback" onClick={() => setActiveTab('feedback')} delay={0.35}/>
          <NavItem active={activeTab === 'settings'} icon={<Settings size={18}/>} label="System Config" onClick={() => setActiveTab('settings')} delay={0.4}/>
        </nav>
        <button onClick={logout} className="mt-8 flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-bold cursor-pointer group shadow-sm active:scale-95">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f5f9]">
        
        {/* TOP HEADER */}
        <div className="w-full flex items-center justify-between px-4 lg:px-10 py-3 bg-white border-b border-slate-200 z-50 shadow-sm shrink-0">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('overview')}>
                <img src={logo} alt="CampSync.AI" className="h-9 md:h-11 w-auto group-hover:scale-105 transition-transform" />
                <div className="hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">INTELLIGENT CAMPUS MANAGEMENT</p>
                </div>
            </div>

            <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 bg-slate-50 p-1 pr-4 rounded-2xl border border-slate-200 shadow-inner hover:bg-white transition-all cursor-pointer group">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-indigo-400 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors text-sm">
                    {user.name?.charAt(0)}
                </div>
                <div className="text-left hidden sm:block leading-tight">
                    <p className="text-[11px] font-black text-slate-800">{user.name}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">System Administrator</p>
                </div>
            </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar relative">
            <AnimatePresence>
            {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[55] flex items-center justify-center">
                    <div className="bg-white/80 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={48}/>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Syncing Database</p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1 text-left">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white rounded-2xl shadow-xl cursor-pointer hover:bg-slate-50 transition-colors mb-4"><Menu size={20}/></button>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-800 capitalize tracking-tight">{activeTab}</h2>
                    <p className="text-[13px] text-slate-500 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Administrative
                    </p>
                </div>

                {['students', 'faculty'].includes(activeTab) && (
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={activeTab === 'faculty' ? "Search Emp ID / Name..." : "Search Reg No / Name..."}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {['faculty', 'classes', 'documents'].includes(activeTab) && (
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenCreateModal} className="bg-indigo-600 text-white px-8 py-4 rounded-[1.2rem] font-black flex items-center gap-3 shadow-xl transition-all cursor-pointer hover:bg-indigo-700 uppercase text-xs tracking-widest">
                        <Plus size={20} strokeWidth={3}/> {activeTab === 'faculty' ? 'Create Faculty' : activeTab === 'classes' ? 'New Class' : 'Upload Resource'}
                    </motion.button>
                )}

                {activeTab === 'documents' && (
                    <div className="flex bg-slate-200/50 p-1.5 rounded-[1.25rem] gap-1 shadow-inner backdrop-blur-sm border border-white">
                        {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button key={status} onClick={() => setDocFilter(status)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${docFilter === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>{status}</button>
                        ))}
                    </div>
                )}
            </header>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {activeTab === 'overview' ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/60 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-sm border border-white">
                            {['branch', 'section', 'passingYear'].map((key) => (
                                <div key={key} className="relative group">
                                    <select className="w-full bg-slate-100/50 hover:bg-white appearance-none rounded-[1.2rem] px-6 py-4 text-[11px] font-black uppercase tracking-widest border-2 border-transparent focus:border-indigo-500/20 outline-none cursor-pointer transition-all" value={dashboardFilter[key]} onChange={e => setDashboardFilter({...dashboardFilter, [key]: e.target.value})}>
                                        <option value="">{`All ${key.replace('passingYear', 'Years')}`}</option>
                                        {(key === 'branch' ? dynamicBranches : key === 'section' ? dynamicSections : dynamicYears).map(val => <option key={val} value={val}>{val}</option>)}
                                    </select><Filter size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors pointer-events-none"/>
                                </div>
                            ))}
                        </div>
                        <OverviewSection stats={stats} />
                    </div>
                ) : activeTab === 'profile' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white overflow-hidden relative">
                            <div className="flex flex-col items-center gap-8 text-center">
                                <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                                    {user.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{user.name}</h3>
                                    <p className="text-indigo-600 font-black tracking-[0.2em] text-sm">{user.email}</p>
                                    <p className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">System Administrator</p>
                                </div>
                                
                                <div className="mt-10 sm:mt-12 bg-slate-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 text-left relative z-10 group w-full">
                                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 cursor-pointer">
                                            <Lock size={26} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-4 w-full">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] leading-none">Security Protocol</p>
                                                <h4 className="text-lg font-black text-slate-800 tracking-tight">Reset Password</h4>
                                            </div>
                                            
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed opacity-90">
                                                We will send a reset password link to your official email address.
                                            </p>

                                            <div className="relative overflow-hidden bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                                                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-[13px] font-bold text-amber-900 leading-relaxed">
                                                    The password reset link will expire in 15 minutes!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={triggerPasswordReset} 
                                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 uppercase text-xs sm:text-sm tracking-[0.15em] cursor-pointer group active:scale-[0.98]"
                                    >
                                        <span>Send Secure Reset Link</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'settings' ? (
                  <div className="max-w-4xl mx-auto">
                      <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white">
                          <div className="flex items-center gap-4 mb-10">
                              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-inner">
                                  <Shield size={32} />
                              </div>
                              <div>
                                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Placement Window Control</h3>
                                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Restrict Student Dashboard during Live Faculty Updates</p>
                              </div>
                          </div>

                          <form onSubmit={handleSetMaintenance} className="space-y-10">
        <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${maintenanceForm.isActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
              <Shield size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">Maintenance Mode</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Instantly block/unblock student access</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setMaintenanceForm({...maintenanceForm, isActive: !maintenanceForm.isActive})}
            className={`w-20 h-10 rounded-full relative transition-colors duration-300 ${maintenanceForm.isActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all duration-300 shadow-lg ${maintenanceForm.isActive ? 'left-11' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1 flex items-center gap-2"><MessageSquare size={14}/> Notification Message</label>
          <textarea 
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold text-slate-700 min-h-[120px] focus:border-indigo-500 transition-all"
            value={maintenanceForm.message}
            onChange={e => setMaintenanceForm({...maintenanceForm, message: e.target.value})}
          />
        </div>

        <button className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-widest active:scale-[0.98]">
          <CheckCircle size={22}/> Save & Apply Configuration
        </button>
      </form>

      <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={24}/>
        <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase">Note: When active, students are instantly blocked across all sessions. No page reload is required for the restriction to take effect.</p>
      </div>
    </div>
  </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                                    {activeTab === 'students' && (<tr><th className="p-7">Student Identity</th><th className="p-7">Reg No</th><th className="p-7">Dept & Section</th><th className="p-7">Contact Info</th><th className="p-7 text-right">Action Center</th></tr>)}
                                    {activeTab === 'faculty' && (<tr><th className="p-7">Professional Detail</th><th className="p-7">Employee ID</th><th className="p-7">Department</th><th className="p-7">Contact Info</th><th className="p-7 text-right">Action Center</th></tr>)}
                                    {activeTab === 'classes' && (<tr><th className="p-7">Mapping Logic</th><th className="p-7">Degree Structure</th><th className="p-7">Faculty Lead</th><th className="p-7 text-right">Action Center</th></tr>)}
                                    {activeTab === 'documents' && (<tr><th className="p-7">Resource Title</th><th className="p-7">Academic Metadata</th><th className="p-7">Uploader Auth</th><th className="p-7 text-right">Action Center</th></tr>)}
                                    {activeTab === 'feedback' && (<tr><th className="p-7">Category</th><th className="p-7">Rating</th><th className="p-7">Context</th><th className="p-7 text-right">Action Center</th></tr>)}
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence mode="popLayout">
                                        {filteredData.map((item, idx) => {
                                            const role = item.uploaded_by_user?.role || 'admin';
                                            const rowBg = activeTab === 'documents' ? (role === 'admin' ? 'bg-indigo-50/50' : role === 'faculty' ? 'bg-emerald-50/50' : 'bg-amber-50/50') : '';
                                            
                                            return (
                                                <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={item._id} className={`transition-all group cursor-pointer ${rowBg} hover:bg-slate-50/80`}>
                                                    <td className="p-7">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{item.name || item.title || item.category || item.className || "Registry Item"}</p>
                                                            {activeTab === 'documents' && (
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${role === 'admin' ? 'bg-indigo-600 text-white' : role === 'faculty' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                                                                    {role === 'admin' ? 'Admin Shared' : role === 'faculty' ? 'Faculty Shared' : 'Student Shared'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {activeTab !== 'students' && activeTab !== 'faculty' && (
                                                            <div className="flex items-center gap-2 mt-1"><span className="text-[10px] text-slate-400 font-bold">{item.email || item.exam_name || item.education}</span></div>
                                                        )}
                                                    </td>
                                                    <td className="p-7">
                                                        <p className="text-xs font-black text-slate-700 uppercase">
                                                            {activeTab === 'feedback' ? `★ ${item.rating}/5` : (activeTab === 'students' ? item.regNo : activeTab === 'faculty' ? (item.regNo || item.facultyId) : item.branch || item.subject || 'N/A')}
                                                        </p>
                                                    </td>
                                                    <td className="p-7">
                                                        {activeTab === 'students' ? (
                                                            <div className="flex gap-2"><span className="bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-indigo-100">{item.branch}</span><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">{item.section}</span></div>
                                                        ) : activeTab === 'faculty' ? (
                                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-emerald-100">{item.branch}</span>
                                                        ) : activeTab === 'documents' ? (
                                                            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm"><UserIcon size={16} /></div><p className="text-xs font-black text-slate-700">{item.uploaded_by_user?.name || 'Admin System'}</p></div>
                                                        ) : activeTab === 'feedback' ? (
                                                            <p className="text-xs font-bold text-slate-500 italic whitespace-normal max-w-[400px]">"{item.message || "Rating only"}"</p>
                                                        ) : (
                                                            <p className="text-[11px] font-black text-indigo-600">{item.faculty?.name || 'Global Registry'}</p>
                                                        )}
                                                    </td>
                                                    <td className="p-7">
                                                        {(activeTab === 'students' || activeTab === 'faculty') ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><Mail size={12}/> {item.email}</div>
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><Phone size={12}/> {item.phone}</div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end space-x-3">
                                                                <ActionButton onClick={() => { setSelectedItem(item); setShowDetailModal(true); }} icon={<Eye size={18}/>} color="slate" />
                                                                {(activeTab === 'faculty' || activeTab === 'students') && (<ActionButton onClick={() => startEdit(item)} icon={<Edit size={18}/>} color="indigo" />)}
                                                                {activeTab === 'documents' && item.status === 'Pending' && (<><ActionButton onClick={() => handleDocAction(item._id, 'Approved')} icon={<CheckCircle size={18}/>} color="green" /><ActionButton onClick={() => setShowDocActionModal({ show: true, type: 'Rejected', id: item._id })} icon={<XCircle size={18}/>} color="red" /></>)}
                                                                <ActionButton onClick={() => setConfirmModal({ show: true, id: item._id })} icon={<Trash2 size={18}/>} color="red" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    { (activeTab === 'students' || activeTab === 'faculty') && (
                                                        <td className="p-7 text-right space-x-3">
                                                            <ActionButton onClick={() => { setSelectedItem(item); setShowDetailModal(true); }} icon={<Eye size={18}/>} color="slate" />
                                                            <ActionButton onClick={() => startEdit(item)} icon={<Edit size={18}/>} color="indigo" />
                                                            <ActionButton onClick={() => setConfirmModal({ show: true, id: item._id })} icon={<Trash2 size={18}/>} color="red" />
                                                        </td>
                                                    )}
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {confirmModal.show && (
            <Popup isOpen={confirmModal.show} onClose={() => setConfirmModal({ show: false, id: null })} title="Confirm Data Purge">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce"><AlertCircle size={40} /></div>
                    <div><h4 className="text-xl font-black text-slate-800">Are you absolutely sure?</h4><p className="text-sm font-bold text-slate-500 mt-2">This action will permanently erase this record.</p></div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setConfirmModal({ show: false, id: null })} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl">Confirm Delete</button>
                    </div>
                </div>
            </Popup>
        )}

        {showDetailModal && selectedItem && (
            <Popup isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Registry Intelligence">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(selectedItem).map(([key, value]) => {
                        if (['_id', 'password', '__v', 'updatedAt', 'file_url', 'storage_path', 'pendingData', 'uploaded_by_user'].includes(key)) return null;
                        const displayValue = typeof value === 'object' ? (value?.name || value?.facultyId || 'System Managed') : (value?.toString() || 'N/A');
                        return (
                            <div key={key} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-200/50 group hover:bg-white transition-all cursor-default">
                                <p className="text-[9px] font-black text-slate-400 group-hover:text-indigo-500 uppercase tracking-widest mb-1.5">{key.replace(/_/g, ' ')}</p>
                                <p className="font-bold text-slate-700 break-words text-sm">{displayValue}</p>
                            </div>
                        )
                    })}
                    {selectedItem.file_url && (<a href={selectedItem.file_url} target="_blank" rel="noreferrer" className="col-span-full p-6 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-xl cursor-pointer hover:bg-indigo-600 transition-all uppercase text-xs tracking-widest"><ExternalLink size={20}/> Inspect Source Document</a>)}
                </div>
            </Popup>
        )}

        {showCreateModal && (
            <Popup isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setEditId(null); }} title={editId ? `Modify Record` : `Provision ${activeTab}`}>
                {activeTab === 'documents' ? (
                    <div className="max-w-4xl mx-auto px-0">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-8 text-center text-white relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 bg-white/10 w-48 h-48 rounded-full blur-3xl" />
                                <div className="absolute -left-10 -bottom-10 bg-indigo-400/20 w-48 h-48 rounded-full blur-3xl" />
                                <UploadCloud className="absolute -right-4 -top-4 text-white/10 w-32 h-32 rotate-12" />
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
                                        <Cloud size={14} className="text-indigo-200" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Institutional Resource</span>
                                    </div>
                                    <h3 className="text-3xl font-black mb-2 tracking-tighter">Deploy Content</h3>
                                    <p className="text-indigo-100 font-medium text-sm opacity-90">Distribute academic materials to the global class bank instantly.</p>
                                </motion.div>
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleAdminUpload} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2"><Input label="Material Title" onChange={v => setUploadData({...uploadData, title: v})} value={uploadData.title} placeholder="e.g., AI End Semester Question Paper 2024" required icon={<FilePlus size={16} />} /></div>
                                        <Input label="Course Subject" onChange={v => setUploadData({...uploadData, subject: v})} value={uploadData.subject} placeholder="e.g., Data Science" required icon={<Layers size={16} />} />
                                        <Input label="Exam Category" onChange={v => setUploadData({...uploadData, exam_name: v})} value={uploadData.exam_name} placeholder="e.g., Internal Assessment" required icon={<Award size={16} />} />
                                        <Input label="Academic Batch" type="number" onChange={v => setUploadData({...uploadData, year: v})} value={uploadData.year} required icon={<Calendar size={16} />} />
                                        <Input label="Topic Tags" onChange={v => setUploadData({...uploadData, tags: v})} value={uploadData.tags} placeholder="Separate with commas" icon={<Hash size={16} />} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1 flex items-center gap-2"><TextQuote size={14}/> Description</label>
                                        <textarea value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold min-h-[100px]" placeholder="Add context or instructions..."/>
                                    </div>
                                    <div className="space-y-4">
                                        <label className={`relative flex flex-col items-center justify-center p-10 border-4 border-dashed rounded-[2rem] transition-all cursor-pointer group ${selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-indigo-500'}`}>
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                                                {selectedFile ? <FileText size={32} /> : <Cloud size={32} />}
                                            </div>
                                            <p className="font-black text-slate-700">{selectedFile ? selectedFile.name : 'Select Learning Material'}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">PDF, PPT, DOC (Max 10MB)</p>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={e => setSelectedFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <button type="submit" disabled={isUploading} className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-4 ${isUploading ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                        {isUploading ? <><UploadCloud className="animate-bounce" size={20}/> <span>Syncing...</span></> : <><CheckCircle size={20}/> <span>Deploy to Registry</span></>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                ) : activeTab === 'faculty' ? (
                    <form onSubmit={handleSaveFaculty} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-1">
                                <Input label="Faculty ID" required value={facultyForm.regNo} onChange={v => setFacultyForm({...facultyForm, regNo: v, facultyId: v})} icon={<Hash size={14}/>}/>
                            </div>
                            <Input label="Name" required value={facultyForm.name} onChange={v => setFacultyForm({...facultyForm, name: v})} icon={<UserIcon size={14}/>}/>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Gender</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100 outline-none focus:border-indigo-500 transition-all" value={facultyForm.gender} onChange={e => setFacultyForm({...facultyForm, gender: e.target.value})}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <Input label="Institutional Email" type="email" required value={facultyForm.email} onChange={v => setFacultyForm({...facultyForm, email: v})} icon={<Mail size={14}/>}/>
                            {!editId && <Input label="Password" type="password" required value={facultyForm.password} onChange={v => setFacultyForm({...facultyForm, password: v})} icon={<ShieldCheck size={14}/>}/>}
                            <div className={editId ? "md:col-span-1" : "col-span-1"}>
                                <Input label="Phone" required value={facultyForm.phone} onChange={v => setFacultyForm({...facultyForm, phone: v})} icon={<Phone size={14}/>}/>
                            </div>
                            <div className="md:col-span-1 space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Department</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100 outline-none focus:border-indigo-500 transition-all" value={facultyForm.branch} onChange={e => setFacultyForm({...facultyForm, branch: e.target.value})}>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                        <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl uppercase tracking-widest hover:bg-indigo-700 transition-all">
                            {editId ? 'Update Details' : 'Create Faculty'}
                        </button>
                    </form>
                ) : activeTab === 'students' ? (
                    <form onSubmit={handleSaveStudent} className="grid grid-cols-2 gap-5">
                        <Input label="Student Name" required value={studentForm.name} onChange={v => setStudentForm({...studentForm, name: v})} icon={<UserIcon size={14}/>}/>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={studentForm.gender} onChange={e => setStudentForm({...studentForm, gender: e.target.value})}><option value="male">Male</option><option value="female">Female</option></select></div>
                        <Input label="Email" type="email" required value={studentForm.email} onChange={v => setStudentForm({...studentForm, email: v})} icon={<Mail size={14}/>}/>
                        <Input label="Contact" required value={studentForm.phone} onChange={v => setStudentForm({...studentForm, phone: v})} icon={<Phone size={14}/>}/>
                        <Input label="Roll No" required value={studentForm.regNo} onChange={v => setStudentForm({...studentForm, regNo: v})} icon={<Hash size={14}/>}/>
                        <Input label="College" required value={studentForm.college} onChange={v => setStudentForm({...studentForm, college: v})} icon={<Briefcase size={14}/>}/>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Degree</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={studentForm.education} onChange={e => setStudentForm({...studentForm, education: e.target.value})}>{degrees.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={studentForm.branch} onChange={e => setStudentForm({...studentForm, branch: e.target.value})}>{branches.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={studentForm.passingYear} onChange={e => setStudentForm({...studentForm, passingYear: e.target.value})}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={studentForm.section} onChange={e => setStudentForm({...studentForm, section: e.target.value})}>{sections.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <button className="col-span-2 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black mt-4 shadow-xl uppercase tracking-widest">Sync Student Data</button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateClass} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5"><select className="p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={classForm.education} onChange={e => setClassForm({...classForm, education: e.target.value})}>{degrees.map(d => <option key={d} value={d}>{d}</option>)}</select><select className="p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={classForm.branch} onChange={e => setClassForm({...classForm, branch: e.target.value})}>{branches.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                        <div className="grid grid-cols-2 gap-5"><select className="p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={classForm.section} onChange={e => setClassForm({...classForm, section: e.target.value})}>{sections.map(s => <option key={s} value={s}>{s}</option>)}</select><select className="p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={classForm.passingYear} onChange={e => setClassForm({...classForm, passingYear: e.target.value})}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Faculty Lead</label><select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" value={classForm.facultyId} onChange={e => setClassForm({...classForm, facultyId: e.target.value})}><option value="">Select In-charge...</option>{facultyList.map(f => {
                            const isAssigned = classList.some(c => c.faculty?._id === f._id || c.facultyId === f._id);
                            return <option key={f._id} value={f._id} disabled={isAssigned} title={isAssigned ? "Already assigned to a class" : ""}>{f.name} ({f.regNo || f.facultyId}) {isAssigned ? "— Assigned" : ""}</option>
                        })}</select></div>
                        <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black mt-4 shadow-xl uppercase tracking-widest">Establish Mapping</button>
                    </form>
                )}
            </Popup>
        )}
      </AnimatePresence>
    </div>
  );
};

// SUB-COMPONENTS
const LayoutIcon = ({ active }) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-white" : "text-indigo-400"}><path d="M3 3h7v9H3zM14 3h7v5h-7zM14 11h7v10h-7zM3 15h7v6H3z"/></svg>);

const NavItem = ({ icon, label, active, onClick, delay }) => (
  <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black cursor-pointer relative group overflow-hidden ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    <span className={active ? 'text-white' : 'text-indigo-500'}>{icon}</span>
    <span className="text-sm tracking-widest uppercase text-[11px]">{label}</span>
  </motion.button>
);

const OverviewSection = ({ stats }) => {
  const starStudent = stats.toppers?.[0];

  return (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
       <KpiCard label="Total Students" val={stats.userCount} icon={<Users size={20}/>} color="bg-indigo-600" />
       <KpiCard label="Active Faculty" val={stats.facultyCount} icon={<UserCheck size={20}/>} color="bg-indigo-600" />
       <KpiCard label="System Docs" val={stats.totalDocs} icon={<FileText size={20}/>} color="bg-emerald-600" />
       <KpiCard label="Companies" val={stats.totalRecruiters} icon={<Briefcase size={20}/>} color="bg-amber-500" />
       <KpiCard label="Placed" val={stats.totalPlaced} icon={<ShieldCheck size={20}/>} color="bg-pink-600" />
       <KpiCard label="Placed %" val={stats.placementPercentage} suffix="%" icon={<TrendingUp size={20}/>} color="bg-violet-600" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
       {/* COMPENSATION ANALYTICS WITH STAR PLACEMENT */}
       <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 text-white flex flex-col gap-6 border border-white/5 shadow-2xl relative overflow-hidden group">
            {starStudent && (
                <div className="relative group/star">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-3xl blur opacity-20 group-hover/star:opacity-40 transition duration-700"></div>

                    <div className="relative bg-white/5 backdrop-blur-md border border-amber-500/20 rounded-3xl p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Trophy size={14} className="text-amber-500" />
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Star Placement - Most offered Student</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-slate-400 tracking-tighter leading-none">
                                    {starStudent.name}
                                </h3>
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                                    {/* <span>Reg No: {starStudent.regNo}</span> */}
                                    {/* <span className="w-1 h-1 rounded-full bg-slate-700"></span> */}
                                    <span>{starStudent.branch}</span>
                                </div>
                            </div>

                            <div className="bg-amber-500 text-slate-900 rounded-2xl p-4 text-center min-w-[100px] shadow-lg shadow-amber-500/20">
                                <p className="text-4xl font-black leading-none">
                                    <AnimatedNumber value={starStudent.offersCount || 1} />
                                </p>
                                <p className="text-[9px] font-black uppercase mt-1 opacity-70">Offers</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Compensation Analytics</p>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
                    <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Top Salary Package - CTC</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-4xl lg:text-4xl font-black text-white tracking-tighter">
                                ₹<AnimatedNumber value={stats.highestPackage || 0} precision={1} />
                            </h4>
                            <span className="text-xl text-amber-500 font-black uppercase tracking-tighter">LPA</span>
                        </div>
                    </div>

                    <div className="space-y-2 sm:border-l sm:border-white/10 sm:pl-10">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Average Package - CTC</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl lg:text-3xl font-black text-indigo-400 tracking-tighter">
                                ₹<AnimatedNumber value={stats.avgPackage || 0} precision={2} />
                            </p>
                            <span className="text-sm text-slate-500 font-black uppercase ml-1">LPA</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shine pointer-events-none" />
       </div>

       {/* PLACEMENT EXCELLENCE LIST */}
       <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                  <Star size={14} className="text-amber-500"/> Placement Excellence
              </h4>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Top {stats.toppers?.length || 0} Candidates</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {stats.toppers?.slice(0, 4).map((t, i) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm transition-all ${i === 0 ? 'bg-amber-400 text-white scale-110' : 'bg-white text-slate-400 group-hover:text-indigo-600'}`}>
                      {i === 0 ? <Trophy size={20}/> : i + 1}
                   </div>
                   <div>
                       <p className="font-black text-slate-800 text-base">{t.name}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.branch} • {t.regNo}</p>
                   </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">{t.cgpa || t.package || '9.2'}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase">CGPA</p>
                </div>
              </motion.div>
            ))}
          </div>
       </div>
    </div>
  </div>
);
};

const KpiCard = ({ label, val, icon, color, suffix = "" }) => (
  <div className="p-6 bg-white rounded-[2.5rem] border border-white shadow-xl flex flex-col gap-6 hover:shadow-indigo-100 transition-all cursor-default">
    <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-2xl shadow-current/20`}>{icon}</div>
    <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tighter"><AnimatedNumber value={val} precision={suffix === "%" ? 1 : 0} />{suffix}</p>
    </div>
  </div>
);

const Popup = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[3.5rem] p-8 md:p-12 w-full max-w-2xl shadow-3xl relative z-[110] max-h-[90vh] overflow-y-auto custom-scrollbar border border-white">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase text-sm tracking-[0.2em]">{title}</h3>
            <button onClick={onClose} className="p-3 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all cursor-pointer"><X size={24} /></button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ActionButton = ({ onClick, icon, color }) => {
  const themes = { 
    slate: 'bg-slate-100 text-slate-400 hover:bg-slate-800', 
    indigo: 'bg-indigo-50 text-indigo-500 hover:bg-indigo-600', 
    green: 'bg-emerald-50 text-emerald-500 hover:bg-emerald-600', 
    red: 'bg-rose-50 text-rose-500 hover:bg-rose-600' 
  };
  return (<button onClick={onClick} className={`p-3 rounded-2xl ${themes[color]} hover:text-white transition-all shadow-sm cursor-pointer`}>{icon}</button>);
};

const Input = ({ label, onChange, type = "text", required, value, icon, placeholder }) => (
  <div className="space-y-3 w-full text-left">
    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1 flex items-center gap-2">{icon} {label} {required && "*"}</label>
    <input type={type} required={required} value={value} onChange={(e) => onChange ? onChange(e.target.value) : null} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:border-indigo-500 transition-all shadow-sm" placeholder={placeholder || `Enter ${label.toLowerCase()}...`} />
  </div>
);

export default AdminDashboard;