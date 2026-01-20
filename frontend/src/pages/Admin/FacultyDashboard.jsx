import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../Auth/AuthContext';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';
import logo from '../../assets/logofinal.png';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import {
    Users, Award, ShieldCheck, FileText, TrendingUp,
    Search, Eye, Edit3, CheckCircle, XCircle, LogOut,
    LayoutDashboard, Star, Briefcase, Info,
    Mail, Phone, GraduationCap, Calendar, Hash, ArrowRight,
    ClipboardCheck, AlertCircle, X, Trash2, User, Download,
    BarChart3, FileSpreadsheet, UploadCloud, Trophy, Settings, Lock, Cloud,
    FilePlus, TextQuote, Layers, HelpCircle, ExternalLink, ChevronRight, CircleUser
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';



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

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [docFilter, setDocFilter] = useState('Pending');
    const [stats, setStats] = useState({});
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null, type: null });
    const [showDocActionModal, setShowDocActionModal] = useState({ show: false, type: null, id: null });
    const [showDocDetailModal, setShowDocDetailModal] = useState({ show: false, doc: null });
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form States
    const [placementForm, setPlacementForm] = useState({});
    const [rejectionReason, setRejectionReason] = useState("");

    // Faculty Upload Form States
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadSubject, setUploadSubject] = useState('');
    const [uploadExamName, setUploadExamName] = useState('');
    const [uploadYear, setUploadYear] = useState(new Date().getFullYear());
    const [uploadTags, setUploadTags] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const predefinedReasons = ["Blurry text/Unreadable", "Wrong Exam Category", "Duplicate Submission", "Invalid Year of Study"];

    useEffect(() => {
        fetchStats();
        fetchTabContent();
    }, [activeTab, docFilter]);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/faculty/stats`, { headers: { Authorization: `Bearer ${user.token}` } });
            setStats(data);
        } catch (e) { console.error("Stats load failed"); }
    };

    const fetchTabContent = async () => {
        setLoading(true);
        let endpoint = '';
        if (activeTab === 'students') endpoint = '/api/faculty/my-students';
        else if (activeTab === 'verifications') endpoint = '/api/faculty/academic-requests';
        else if (activeTab === 'documents') endpoint = `/api/admin/papers?status=${docFilter}`;

        try {
            if (endpoint) {
                const { data } = await axios.get(`${API_BASE_URL}${endpoint}`, { headers: { Authorization: `Bearer ${user.token}` } });

                let finalData = Array.isArray(data) ? data : [];

                if (activeTab === 'students') {
                    finalData = [...finalData].sort((a, b) => (a.regNo || '').localeCompare(b.regNo || ''));
                }

                if (activeTab === 'documents' && docFilter === 'Pending') {
                    const studentOnlyDocs = finalData.filter(doc => doc.uploaded_by_user?.role === 'user');
                    setDataList(studentOnlyDocs);
                } else {
                    setDataList(finalData);
                }
            }
        } catch (e) {
            setDataList([]);
        }
        setLoading(false);
    };

    const handlePlacementUpdate = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Updating student record...");
        try {
            await axios.put(`${API_BASE_URL}/api/faculty/update-placement/${selectedStudent._id}`, placementForm, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success("Database Updated", { id: tid });
            setShowEditModal(false); fetchTabContent(); fetchStats();
        } catch (e) { toast.error("Action failed", { id: tid }); }
    };

    const verifyAcademic = async (id, approve) => {
        const tid = toast.loading(approve ? "Verifying..." : "Rejecting...");
        try {
            await axios.put(`${API_BASE_URL}/api/admin/academic-verification/${id}`, { approve }, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success(approve ? "Details Verified" : "Declined", { id: tid });
            setShowVerifyModal(false);
            fetchTabContent(); fetchStats();
        } catch (e) { toast.error("Verification failed", { id: tid }); }
    };

    const handleDocAction = async (forcedId = null, forcedType = null) => {
        const id = forcedId || showDocActionModal.id;
        const type = forcedType || showDocActionModal.type;
        if (type === 'reject' && !rejectionReason.trim()) return toast.error("Provide a reason");
        const tid = toast.loading("Processing...");
        try {
            const status = type === 'approve' ? 'Approved' : 'Rejected';
            await axios.put(`${API_BASE_URL}/api/admin/paper-status/${id}`, { status, rejection_reason: rejectionReason }, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success(`Marked as ${status}`, { id: tid });
            setShowDocActionModal({ show: false, type: null, id: null });
            setShowDocDetailModal({ show: false, doc: null });
            setRejectionReason("");
            fetchTabContent();
        } catch (e) { toast.error("Action failed", { id: tid }); }
    };

    const handlePurge = async () => {
        const { id } = showDeleteModal;
        const tid = toast.loading("Purging resource...");
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/question-papers/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success("Resource Purged", { id: tid });
            setShowDeleteModal({ show: false, id: null, type: null });
            fetchTabContent(); fetchStats();
        } catch (e) { toast.error("Purge Failed", { id: tid }); }
    };

    const handleFacultyUpload = async (e) => {
        e.preventDefault();
        if (!uploadTitle || !uploadSubject || !uploadExamName || !selectedFile) {
            return toast.error('Please fill required fields and select a file.');
        }
        const formData = new FormData();
        formData.append('title', uploadTitle);
        formData.append('description', uploadDescription);
        formData.append('subject', uploadSubject);
        formData.append('exam_name', uploadExamName);
        formData.append('year', uploadYear);
        formData.append('tags', uploadTags);
        formData.append('questionPaperFile', selectedFile);

        setIsUploading(true);
        const tid = toast.loading("Uploading to cloud...");
        try {
            await axios.post(`${API_BASE_URL}/api/question-papers/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
            });
            toast.success('Resource Published! Sent for Admin Review.', { id: tid });
            setUploadTitle(''); setUploadDescription(''); setUploadSubject(''); setUploadExamName(''); setUploadTags(''); setSelectedFile(null);
            setActiveTab('overview');
        } catch (err) { toast.error("Upload Failed", { id: tid }); }
        finally { setIsUploading(false); }
    };

   const triggerPasswordReset = async () => {
    const tid = toast.loading("Requesting secure link...");
    try {
        await axios.post(
            `${API_BASE_URL}/api/auth/forgotpassword`,
            { email: user.email }
        );

        toast.success(
            `Reset link sent to your registered email: ${user.email}`,
            { id: tid }
        );
    } catch (e) {
        toast.error("Failed to trigger reset email", { id: tid });
    }
};


    const exportToExcel = () => {
        const branchInfo = user.branch || (dataList[0]?.branch) || "General";
        const sectionInfo = user.section || (dataList[0]?.section) || "N/A";

        const ws = XLSX.utils.json_to_sheet(dataList.map(s => ({
            "Name": s.name,
            "Reg No": s.regNo,
            "Branch": s.branch,
            "Section": s.section,
            "Email": s.email,
            "Status": s.placementStatus,
            "Company": s.recentCompany || "N/A",
            "LPA": s.packageLPA || 0,
            "Offers": s.offersCount || 0,
            "Job Type": s.jobType || "N/A",
            "CGPA": s.cgpa || 0,
            "Arrear": s.historyOfArrear || 0,
            "Backlogs": s.currentBacklog || 0
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, `Placement_Report_${branchInfo}_Sec_${sectionInfo}.xlsx`);
    };

    const downloadPlacementReport = () => {
        const doc = new jsPDF('landscape');
        const pageWidth = doc.internal.pageSize.getWidth();

        const branchName = user.branch || (dataList[0]?.branch) || "Academic";
        const sectionName = user.section || (dataList[0]?.section) || "N/A";
        const educationName = user.education || (dataList[0]?.education) || "B.E/B.Tech";
        const passingYear = user.passingYear || (dataList[0]?.passingYear) || "2025";

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(`Placement Report - ${branchName} Department`, pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);

        const rightMargin = pageWidth - 14;
        doc.text(`Faculty: ${user.name}`, rightMargin, 15, { align: 'right' });
        doc.text(`Class: ${educationName} - ${passingYear}`, rightMargin, 20, { align: 'right' });
        doc.text(`Section: ${sectionName}`, rightMargin, 25, { align: 'right' });

        const tableRows = dataList.map(s => [
            s.name,
            s.regNo,
            s.branch,
            s.placementStatus,
            s.recentCompany || 'N/A',
            `${s.packageLPA || 0} LPA`,
            s.offersCount || 0,
            s.cgpa || 0,
            s.historyOfArrear || 0
        ]);

        autoTable(doc, {
            head: [["Name", "Reg No", "Branch", "Status", "Company", "LPA", "Offers", "CGPA", "Arrear"]],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 3 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        doc.save(`Placement_Report_${branchName}_${sectionName}.pdf`);
    };

    const currentBranch = user.branch || (dataList[0]?.branch) || "Department";
    const currentSection = user.section || (dataList[0]?.section) || "A";

    return (
        <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans antialiased text-slate-900">
            <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col p-6 shadow-2xl z-10 border-r border-slate-800">
                <div className="mb-10 px-2 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 transform hover:rotate-6 transition-transform">F</div>
                    <div><h1 className="text-xl font-black tracking-tighter">FACULTY</h1><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Workspace</p></div>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                    <NavItem active={activeTab === 'overview'} icon={<LayoutDashboard size={20} />} label="Overview" onClick={() => setActiveTab('overview')} />
                    <NavItem active={activeTab === 'students'} icon={<Users size={20} />} label="Placement Hub" onClick={() => setActiveTab('students')} />
                    <NavItem active={activeTab === 'verifications'} icon={<ClipboardCheck size={20} />} label="Academic Request" onClick={() => setActiveTab('verifications')} />
                    <NavItem active={activeTab === 'documents'} icon={<FileText size={20} />} label="Review Document" onClick={() => setActiveTab('documents')} />
                    <NavItem active={activeTab === 'upload'} icon={<UploadCloud size={20} />} label="Upload Document" onClick={() => setActiveTab('upload')} />
                    <NavItem active={activeTab === 'profile'} icon={<CircleUser size={20} />} label="Profile" onClick={() => setActiveTab('profile')} />
                </nav>
                <button onClick={logout} className="mt-8 flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-bold cursor-pointer group shadow-sm">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </aside>

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t z-[60] flex justify-around p-3 shadow-2xl">
                <MobileNavItem active={activeTab === 'overview'} icon={<LayoutDashboard size={22} />} onClick={() => setActiveTab('overview')} />
                <MobileNavItem active={activeTab === 'students'} icon={<Users size={22} />} onClick={() => setActiveTab('students')} />
                <MobileNavItem active={activeTab === 'documents'} icon={<FileText size={22} />} onClick={() => setActiveTab('documents')} />
                <MobileNavItem active={activeTab === 'upload'} icon={<UploadCloud size={22} />} onClick={() => setActiveTab('upload')} />
                <MobileNavItem active={activeTab === 'profile'} icon={<CircleUser size={22} />} onClick={() => setActiveTab('profile')} />
                <button
                    onClick={logout}
                    className="p-4 rounded-2xl transition-all cursor-pointer text-red-500 hover:bg-red-50 active:scale-90"
                >
                    <LogOut size={22} />
                </button>
            </nav>

            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f5f9]">

                {/* --- FIXED TOP BRANDING HEADER --- */}
                <div className="w-full flex items-center justify-between px-4 lg:px-10 py-3 bg-white border-b border-slate-200 z-50 shadow-sm shrink-0">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setActiveTab('overview')}
                    >
                        <img src={logo} alt="CampSync.AI" className="h-9 md:h-11 w-auto group-hover:scale-105 transition-transform" />
                        <div className="hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Intelligent Campus Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-1 pr-4 rounded-2xl border border-slate-200 shadow-inner hover:bg-white transition-all cursor-pointer group" onClick={() => setActiveTab('profile')}>
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-indigo-400 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors text-sm">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="text-left hidden sm:block leading-tight" onClick={() => setActiveTab('profile')}>
                            <p className="text-[11px] font-black text-slate-800">{user.name}</p>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Institutional Faculty</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-32 lg:pb-12 custom-scrollbar scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + docFilter}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <header className="mb-4 lg:mb-6 flex flex-col md:flex-row justify-between md:items-end gap-6">
                                <div className="space-y-1 text-left">
                                    <h2 className="text-2xl lg:text-3xl font-black text-slate-800 capitalize tracking-tight">{activeTab}</h2>
                                    <p className="text-[13px] text-slate-500 font-semibold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Class {currentBranch} • Section {currentSection}
                                    </p>
                                </div>

                                {activeTab === 'students' && (
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={exportToExcel} className="flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm font-black text-xs uppercase tracking-wider active:scale-95">
                                            <FileSpreadsheet size={18} /> Excel Report
                                        </button>
                                        <button onClick={downloadPlacementReport} className="flex items-center gap-2 px-6 py-3.5 bg-white text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-sm font-black text-xs uppercase tracking-wider active:scale-95">
                                            <Download size={18} /> PDF Report
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="flex bg-slate-200/50 p-1.5 rounded-[1.25rem] gap-1 shadow-inner overflow-x-auto no-scrollbar backdrop-blur-sm border border-white">
                                        {['Pending', 'Approved', 'Rejected'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setDocFilter(status)}
                                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${docFilter === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </header>


                            {activeTab === 'overview' && <FacultyOverview stats={stats} />}

                            {activeTab === 'students' && (
                                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left whitespace-nowrap">
                                            <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                                                <tr><th className="p-7">Student Identity</th><th className="p-7">Academics</th><th className="p-7">Corporate Data</th><th className="p-7">Status</th><th className="p-7 text-right">Actions</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {dataList.map((s) => (
                                                    <tr key={s._id} className="hover:bg-indigo-50/30 transition-all group">
                                                        <td className="p-7">
                                                            <p className="font-extrabold text-slate-800 text-base">{s.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">{s.regNo}</span>
                                                                <span className="text-[10px] text-slate-400 font-bold">{s.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-7">
                                                            <p className="text-xs font-black text-slate-700 uppercase">{s.education} • {s.passingYear}</p>
                                                            <p className="text-[10px] font-bold text-indigo-500 mt-1.5 flex items-center gap-2">
                                                                <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{s.cgpa} CGPA</span>
                                                                <span className="text-slate-300">|</span>
                                                                <span>Backlogs: {s.currentBacklog}</span>
                                                            </p>
                                                        </td>
                                                        <td className="p-7">
                                                            <p className="text-sm font-extrabold text-slate-800">{s.recentCompany || '---'}</p>
                                                            <p className="text-[10px] font-black text-emerald-600 uppercase mt-1">₹{s.packageLPA} LPA • {s.offersCount} Offers</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{s.jobType || 'N/A'}</p>
                                                        </td>
                                                        <td className="p-7">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${s.placementStatus === 'Placed' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                                {s.placementStatus}
                                                            </span>
                                                        </td>
                                                        <td className="p-7 text-right">
                                                            <button onClick={() => { setSelectedStudent(s); setPlacementForm(s); setShowEditModal(true); }} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-indigo-600 hover:text-white hover:rotate-12 transition-all cursor-pointer shadow-sm">
                                                                <Edit3 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left whitespace-nowrap">
                                            <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase border-b">
                                                <tr><th className="p-7">Context</th><th className="p-7">Academic Metadata</th><th className="p-7">Uploader</th><th className="p-7 text-right">Actions</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {dataList.map((item) => (
                                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-all">
                                                        <td className="p-7"><p className="font-extrabold text-slate-800 text-base">{item.title}</p><p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{item.subject}</p></td>
                                                        <td className="p-7"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{item.exam_name}</span> <span className="text-[10px] font-black text-slate-400 ml-2">{item.year}</span></td>
                                                        <td className="p-7"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><User size={16} /></div><p className="text-xs font-black text-slate-700">{item.uploaded_by_user?.name || 'User'}</p></div></td>
                                                        <td className="p-7 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <button onClick={() => setShowDocDetailModal({ show: true, doc: item })} className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest cursor-pointer shadow-sm"><Eye size={16} /> Inspect</button>
                                                                {docFilter !== 'Pending' && <button onClick={() => setShowDeleteModal({ show: true, id: item._id, type: 'document' })} className="p-3 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-sm"><Trash2 size={18} /></button>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'upload' && (
                                <div className="max-w-4xl mx-auto pb-10 px-2 sm:px-0">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl border border-white overflow-hidden"
                                    >
                                        {/* --- GRADIENT HEADER --- */}
                                        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-8 lg:p-12 text-center text-white relative overflow-hidden">
                                            <div className="absolute -right-10 -top-10 bg-white/10 w-64 h-64 rounded-full blur-3xl" />
                                            <div className="absolute -left-10 -bottom-10 bg-indigo-400/20 w-64 h-64 rounded-full blur-3xl" />
                                            <UploadCloud className="absolute -right-8 -top-8 text-white/10 w-64 h-64 rotate-12" />

                                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
                                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
                                                    <Cloud size={14} className="text-indigo-200" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Resource Deployment</span>
                                                </div>
                                                <h3 className="text-3xl lg:text-5xl font-black mb-4 tracking-tighter">
                                                    Upload Academic Content
                                                </h3>
                                                <p className="text-indigo-100 max-w-lg mx-auto font-medium text-sm lg:text-base opacity-90">
                                                    Empower your students by making academic resources, question papers, and materials available to the class bank instantly.
                                                </p>
                                            </motion.div>
                                        </div>

                                        <div className="p-6 lg:p-14">
                                            <form onSubmit={handleFacultyUpload} className="space-y-10">
                                                {/* --- INPUT GRID --- */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                                    <div className="md:col-span-2">
                                                        <Input label="Material Title" onChange={v => setUploadTitle(v)} value={uploadTitle} placeholder="e.g., AI End Semester Question Paper 2024" required icon={<FilePlus size={16} />} />
                                                    </div>
                                                    <Input label="Course Subject" onChange={v => setUploadSubject(v)} value={uploadSubject} placeholder="e.g., Computer Networks" required icon={<Layers size={16} />} />
                                                    <Input label="Exam Category" onChange={v => setUploadExamName(v)} value={uploadExamName} placeholder="e.g., End Semester" required icon={<Award size={16} />} />
                                                    <Input label="Academic Batch" type="number" onChange={v => setUploadYear(v)} value={uploadYear} required icon={<Calendar size={16} />} />
                                                    <Input label="Topic Tags (optional)" onChange={v => setUploadTags(v)} value={uploadTags} placeholder="Separate tags with commas ( e.g., Sem, OE)" icon={<Hash size={16} />} />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                        <TextQuote size={14} /> Resource Description
                                                    </label>
                                                    <textarea
                                                        value={uploadDescription}
                                                        onChange={(e) => setUploadDescription(e.target.value)}
                                                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] lg:rounded-[2rem] outline-none font-bold text-slate-700 min-h-[140px] focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                                                        placeholder="Add specific instructions, syllabus coverage, or exam guidelines..."
                                                    />
                                                </div>

                                                {/* --- FIXED DROP ZONE --- */}
                                                <div className="space-y-4">
                                                    <label className={`relative flex flex-col items-center justify-center p-10 lg:p-16 border-4 border-dashed rounded-[2rem] lg:rounded-[3rem] transition-all cursor-pointer group overflow-hidden ${selectedFile ? 'border-emerald-500 bg-emerald-50/30 shadow-inner' : 'border-slate-100 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/30'}`}>
                                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${selectedFile ? 'from-emerald-500/5 to-transparent' : 'from-indigo-500/5 to-transparent'}`} />

                                                        {/* FIXED: Using FileText instead of undefined FileCheck */}
                                                        <div className={`relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 shadow-xl ${selectedFile ? 'bg-emerald-500 text-white rotate-6' : 'bg-white text-slate-300 group-hover:scale-110 group-hover:text-indigo-600 group-hover:-rotate-3'}`}>
                                                            {selectedFile ? <FileText size={40} /> : <Cloud size={40} />}
                                                        </div>

                                                        <div className="relative z-10 text-center">
                                                            <p className={`text-lg lg:text-xl font-black transition-colors ${selectedFile ? 'text-emerald-700' : 'text-slate-700 group-hover:text-indigo-700'}`}>
                                                                {selectedFile ? selectedFile.name : 'Select Learning Material'}
                                                            </p>
                                                            <p className="text-xs lg:text-sm text-slate-400 mt-2 font-bold tracking-tight px-4 uppercase">
                                                                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to publish` : 'Drag & Drop or Click to browse files'}
                                                            </p>
                                                            <p className="text-xs lg:text-xs text-slate-400 mt-2 font-bold tracking-tight px-4 uppercase">
                                                                Accepted file types: PDF, PPT, DOC
                                                            </p>
                                                        </div>

                                                        {/* FIXED: Removed 'required' from hidden input to avoid focus crash */}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                            onChange={e => setSelectedFile(e.target.files[0])}
                                                        />
                                                    </label>

                                                    <div className="flex items-center justify-center gap-6 py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={14} className="text-indigo-400" /> Secure Upload - Only Approved Content</div>
                                                        <div className="h-4 w-[1px] bg-slate-200" />
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Info size={14} className="text-indigo-400" />Max File Size Limit: 10MB</div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isUploading}
                                                    className={`w-full py-6 lg:py-7 rounded-[1.5rem] lg:rounded-[2rem] font-black text-lg lg:text-xl shadow-2xl transition-all flex items-center justify-center gap-4 cursor-pointer active:scale-[0.97] disabled:opacity-70 ${isUploading ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'}`}
                                                >
                                                    {isUploading ? (
                                                        <>
                                                            <UploadCloud className="animate-bounce" size={24} />
                                                            <span>Submitting Resources become accessible after approval</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle size={24} />
                                                            <span>Upload and Submit for Approval</span>
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {activeTab === 'verifications' && (
                                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                                            <tr><th className="p-7">Student Name</th><th className="p-7">Registration</th><th className="p-7 text-right">Review Action</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dataList.map((item) => (
                                                <tr key={item._id} className="hover:bg-indigo-50/30 transition-all">
                                                    <td className="p-7 font-extrabold text-slate-800 text-base">{item.name}</td>
                                                    <td className="p-7"><span className="font-black text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-wider">{item.regNo}</span></td>
                                                    <td className="p-7 text-right"><button onClick={() => { setSelectedStudent(item); setShowVerifyModal(true); }} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all cursor-pointer shadow-lg active:scale-95">Check and Verify</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'profile' && (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pb-12 px-2"
    >
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-slate-200/60 p-8 sm:p-12 border border-white text-center relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem] -z-0" />
            
            {/* AVATAR SECTION */}
            <div className="relative z-10">
                <div className="relative w-28 h-28 sm:w-32 h-32 mx-auto mb-8">
                    <div className="w-full h-full bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-indigo-400 text-4xl sm:text-5xl font-black shadow-2xl shadow-indigo-100 ring-8 ring-slate-50 transition-transform hover:scale-105 duration-500 cursor-pointer">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 border-white shadow-lg animate-pulse" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none mb-3">
                    {user.name}
                </h3>
                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <span className="text-indigo-600 font-black uppercase tracking-[0.15em] text-[10px] sm:text-xs">
                        {user.role} Authorization
                    </span>
                </div>
            </div>

            {/* SECURITY CONTROLS CARD */}
            <div className="mt-10 sm:mt-12 bg-slate-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 text-left relative z-10 group">
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

                        {/* HIGH-VISIBILITY WARNING BOX */}
                        <div className="relative overflow-hidden bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[13px] font-bold text-amber-900 leading-relaxed">
                                The password reset link will expire in 15 minutes!
                            </p>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <button 
                    onClick={triggerPasswordReset} 
                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 uppercase text-xs sm:text-sm tracking-[0.15em] cursor-pointer group active:scale-[0.98]"
                >
                    <span>Send Secure Reset Link</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
            </div>
        </div>
    </motion.div>
)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* MODALS RENDERED HERE */}
            <AnimatePresence>
                {/* DOCUMENT DETAIL MODAL */}
                {showDocDetailModal.show && showDocDetailModal.doc && (
                    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white p-8 lg:p-14 relative custom-scrollbar">
                            <button onClick={() => setShowDocDetailModal({ show: false, doc: null })} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 hover:rotate-90 transition-all cursor-pointer"><X size={28} /></button>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center border border-indigo-100"><FileText size={40} /></div>
                                <div><h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tight">Resource Audit</h3><p className="text-slate-500 font-black uppercase text-[10px] tracking-widest mt-1">Ref ID: {showDocDetailModal.doc._id}</p></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                <DetailItem label="Submission Title" value={showDocDetailModal.doc.title} icon={<FileText size={16} />} />
                                <DetailItem label="Course Code" value={showDocDetailModal.doc.subject} icon={<Layers size={16} />} />
                                <DetailItem label="Category" value={showDocDetailModal.doc.exam_name} icon={<Award size={16} />} />
                                <DetailItem label="Year" value={showDocDetailModal.doc.year} icon={<Calendar size={16} />} />
                                <DetailItem label="Tags" value={showDocDetailModal.doc.tags || "None"} icon={<Hash size={16} />} />
                                <DetailItem label="Uploader" value={showDocDetailModal.doc.uploaded_by_user?.name} icon={<User size={16} />} />
                            </div>
                            <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TextQuote size={16} className="text-indigo-400" /> Summary</p>
                                <p className="text-slate-700 font-bold text-base leading-relaxed">{showDocDetailModal.doc.description || "The uploader provided no context for this resource."}</p>
                            </div>
                            <a href={showDocDetailModal.doc.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all mb-10 uppercase text-xs tracking-widest cursor-pointer shadow-sm"><ExternalLink size={20} /> Open Source File</a>
                            {docFilter === 'Pending' && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button onClick={() => { setShowDocActionModal({ show: true, type: 'reject', id: showDocDetailModal.doc._id }); }} className="flex-1 py-5 bg-rose-50 text-rose-600 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all cursor-pointer">Reject</button>
                                    <button onClick={() => handleDocAction(showDocDetailModal.doc._id, 'approve')} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer">Approve & Deploy</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* DOC ACTION MODAL */}
                {showDocActionModal.show && (
                    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 w-full max-w-xl shadow-2xl relative border">
                            <button onClick={() => setShowDocActionModal({ show: false, type: null, id: null })} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 cursor-pointer"><X size={24} /></button>
                            <h3 className="text-3xl font-black text-slate-800 mb-8 capitalize">{showDocActionModal.type} Document?</h3>
                            {showDocActionModal.type === 'reject' && (
                                <div className="space-y-6 mb-10">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a Reason</label>
                                    <div className="flex flex-wrap gap-2">{predefinedReasons.map(r => (
                                        <button key={r} onClick={() => setRejectionReason(r)} className={`px-4 py-2 border rounded-xl text-[10px] font-black transition-all cursor-pointer ${rejectionReason === r ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-rose-400'}`}>{r}</button>
                                    ))}</div>
                                    <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 min-h-[140px] border-2 border-transparent focus:border-rose-500 transition-all" placeholder="Or provide custom feedback..." />
                                </div>
                            )}
                            <div className="flex gap-4">
                                <button onClick={() => setShowDocActionModal({ show: false, type: null, id: null })} className="flex-1 py-5 font-black text-slate-400 cursor-pointer uppercase text-xs tracking-widest">Go Back</button>
                                <button disabled={showDocActionModal.type === 'reject' && !rejectionReason.trim()} onClick={() => handleDocAction()} className={`flex-[2] py-5 rounded-2xl font-black text-white shadow-xl uppercase text-xs tracking-widest cursor-pointer ${showDocActionModal.type === 'approve' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-rose-600 shadow-rose-100'}`}>Confirm {showDocActionModal.type}</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* DELETE MODAL */}
                {showDeleteModal.show && (
                    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl text-center relative border border-white">
                            <button onClick={() => setShowDeleteModal({ show: false, id: null, type: null })} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 cursor-pointer"><X /></button>
                            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><AlertCircle size={48} /></div>
                            <h3 className="text-3xl font-black text-slate-800 mb-2">Remove Item?</h3>
                            <p className="text-slate-500 font-bold mb-10 text-sm">Action cannot be undone. Data will be permanently purged.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowDeleteModal({ show: false, id: null, type: null })} className="flex-1 py-5 font-black text-slate-400 uppercase text-xs tracking-widest cursor-pointer">Abort</button>
                                <button onClick={handlePurge} className="flex-[2] py-5 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 uppercase text-xs tracking-widest cursor-pointer">Confirm Purge</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* VERIFY MODAL */}
                {showVerifyModal && selectedStudent && (
                    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 w-full max-w-xl shadow-2xl relative border border-white">
                            <button onClick={() => setShowVerifyModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 cursor-pointer"><X size={24} /></button>
                            <h3 className="text-3xl font-black text-slate-800 mb-10 tracking-tight flex items-center gap-3"><ClipboardCheck className="text-indigo-600" /> Academic Audit</h3>
                            <div className="bg-indigo-50/50 p-6 rounded-3xl mb-10 border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Student Identity</p>
                                <p className="text-xl font-black text-slate-800">{selectedStudent.name}</p>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{selectedStudent.regNo}</p>
                            </div>
                            <div className="space-y-4 mb-10">
                                <VerifyField label="Institutional CGPA" oldVal={selectedStudent.cgpa} newVal={selectedStudent.pendingData?.cgpa} />
                                <VerifyField label="Semester" oldVal={selectedStudent.currentSemester} newVal={selectedStudent.pendingData?.currentSemester} />
                                <VerifyField label="Backlog Count" oldVal={selectedStudent.currentBacklog} newVal={selectedStudent.pendingData?.currentBacklog} />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => verifyAcademic(selectedStudent._id, false)} className="flex-1 py-5 font-black text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer uppercase text-xs tracking-widest">Reject</button>
                                <button onClick={() => verifyAcademic(selectedStudent._id, true)} className="flex-[2] py-5 font-black text-white bg-slate-900 rounded-2xl shadow-xl hover:bg-indigo-600 transition-all cursor-pointer uppercase text-xs tracking-widest">Accept & Sync</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* PLACEMENT EDIT MODAL */}
                {showEditModal && selectedStudent && (
                    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3.5rem] p-12 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto relative border border-white custom-scrollbar">
                            <button onClick={() => setShowEditModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 cursor-pointer"><X size={24} /></button>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-100"><Award size={32} /></div>
                                <div><h3 className="text-3xl font-black text-slate-800 leading-none">Corporate Record</h3><p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Updating: {selectedStudent.name}</p></div>
                            </div>
                            <form onSubmit={handlePlacementUpdate} className="space-y-6 text-left">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Status</label>
                                    <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer" value={placementForm.placementStatus} onChange={e => setPlacementForm({ ...placementForm, placementStatus: e.target.value })}><option value="Not Placed">Not Placed</option><option value="Placed">Placed</option></select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Company Name" value={placementForm.recentCompany} onChange={v => setPlacementForm({ ...placementForm, recentCompany: v })} />
                                    <Input
                                        label="Placement Date"
                                        type="date"
                                        value={placementForm.placedDate ? placementForm.placedDate.split('T')[0] : ''}
                                        onChange={v => setPlacementForm({ ...placementForm, placedDate: v })}
                                    />
                                    <Input label="Salary (LPA)" type="number" value={placementForm.packageLPA} onChange={v => setPlacementForm({ ...placementForm, packageLPA: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="No. of Offers" type="number" value={placementForm.offersCount} onChange={v => setPlacementForm({ ...placementForm, offersCount: v })} />
                                    <Input label="Monthly Stipend" type="number" value={placementForm.internStipend} onChange={v => setPlacementForm({ ...placementForm, internStipend: v })} />
                                </div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Type</label>
                                    <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer" value={placementForm.jobType} onChange={e => setPlacementForm({ ...placementForm, jobType: e.target.value })}><option value="Full Time">Full Time</option><option value="Intern + Full Time">Intern + Full Time</option><option value="N/A">N/A</option></select>
                                </div>
                                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all mt-6 uppercase text-xs tracking-[0.2em] cursor-pointer">Save Changes</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- REFACTORED OVERVIEW SECTION ---

const FacultyOverview = ({ stats }) => {
    // Derived state
    const starStudent = stats.topOffers && stats.topOffers.length > 0 ? stats.topOffers[0] : null;
    const dept = stats.branch || "Academic";

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* TOP MINI METRICS - Compact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <MetricCard label="Class Size" val={stats.totalStudents} icon={<Users size={20} />} color="bg-indigo-600" />
                <MetricCard label="Placement Rate" val={Math.round((stats.placedCount / stats.totalStudents) * 100) || 0} icon={<Award size={20} />} color="bg-emerald-600" suffix="%" />
                <MetricCard label="Recruiters" val={stats.totalCompanies} icon={<Briefcase size={20} />} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4 lg:gap-6">

                {/* 1. ACADEMIC STARS (TOP 3 CGPA) - RADIANT EMERALD HIGHLIGHT */}
                <div className="relative group/academic">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/academic:opacity-100 transition duration-1000"></div>

                    <div className="relative bg-white p-5 lg:p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-emerald-50 flex flex-col justify-center overflow-hidden h-full">
                        <GraduationCap className="absolute -right-6 -bottom-6 text-emerald-500/5 rotate-12" size={180} />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] flex items-center gap-2">
                                    <GraduationCap size={16} /> Top Academic Performers
                                </h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-6">Elite Rankers</p>
                            </div>
                            <span className="text-[15px] font-black text-white bg-emerald-600 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 tracking-tighter">
                                Merit Top 3
                            </span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {stats.topCgpa?.slice(0, 3).map((s, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-white rounded-[1.5rem] border border-emerald-100/50 group/item hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg transform group-hover/item:rotate-12 transition-transform ${i === 0 ? 'bg-gradient-to-br from-emerald-600 to-emerald-400' :
                                            i === 1 ? 'bg-gradient-to-br from-emerald-500 to-cyan-400' :
                                                'bg-gradient-to-br from-emerald-400 to-teal-300'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-slate-800 text-sm truncate group-hover/item:text-emerald-700 transition-colors">
                                                {s.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reg No: {s.regNo}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-base font-black text-emerald-600 tracking-tighter">
                                            {s.cgpa}
                                        </span>
                                        <span className="text-[8px] font-black text-emerald-400 uppercase leading-none">CGPA</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent group-hover/academic:animate-shine pointer-events-none" />
                    </div>
                </div>

                {/* 2. ANALYTICS CARD WITH SPECIFIC GOLDEN STUDENT HIGHLIGHT */}
                <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 text-white flex flex-col gap-6 border border-white/5 shadow-2xl relative overflow-hidden group">

                    {starStudent && (
                        <div className="relative group/star">
                            <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-3xl blur opacity-20 group-hover/star:opacity-40 transition duration-700"></div>

                            <div className="relative bg-white/5 backdrop-blur-md border border-amber-500/20 rounded-3xl p-6 lg:p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Trophy size={14} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Star Placement - Most offered Student</span>
                                        </div>
                                        <h3 className="text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-slate-400 tracking-tighter leading-none">
                                            {starStudent.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                                            <span>Reg No: {starStudent.regNo}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span>{starStudent.branch} - {starStudent.passingYear}</span>
                                        </div>
                                    </div>

                                    <div className="bg-amber-500 text-slate-900 rounded-2xl p-4 text-center min-w-[100px] shadow-lg shadow-amber-500/20">
                                        <p className="text-4xl font-black leading-none"><AnimatedNumber value={starStudent.offersCount} /></p>
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
                                    <h4 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                        ₹<AnimatedNumber value={stats.highestPackage || 0} precision={1} />
                                    </h4>
                                    <span className="text-xl text-amber-500 font-black uppercase tracking-tighter">LPA</span>
                                </div>
                            </div>

                            <div className="space-y-2 sm:border-l sm:border-white/10 sm:pl-10">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Average Salary Package - CTC</p>
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

            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:border-indigo-200 transition-all group">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all shrink-0 border border-transparent group-hover:border-indigo-100">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-base font-black text-slate-700 truncate">{value || "---"}</p>
        </div>
    </div>
);

const MobileNavItem = ({ icon, active, onClick }) => (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all cursor-pointer ${active ? 'bg-indigo-600 text-white shadow-xl -translate-y-2' : 'text-slate-400 hover:text-slate-600'}`}>{icon}</button>
);

const NavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black cursor-pointer group active:scale-[0.98] ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <span className={active ? 'text-white' : 'text-indigo-500 transition-transform group-hover:scale-110'}>{icon}</span>
        <span className="text-sm tracking-widest uppercase text-[11px]">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
);

const Input = ({ label, value, onChange, type = "text", required, placeholder, icon }) => (
    <div className="space-y-3 w-full text-left">
        <label className="text-[10px] font-black text-indigo-600 uppercase ml-1 tracking-[0.2em] flex items-center gap-2">{icon} {label} {required && <span className="text-red-500 font-black">*</span>}</label>
        <input type={type} value={value ?? (type === "number" ? 0 : "")} required={required} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm" />
    </div>
);

const MetricCard = ({ label, val, icon, color, suffix = "" }) => (
    <div className="bg-white p-4 lg:p-6 rounded-3xl border border-white shadow-2xl shadow-slate-200/50 flex items-center gap-8 hover:shadow-indigo-100 transition-all group cursor-pointer active:scale-95">
        <div className={`w-20 h-20 rounded-[2rem] ${color} text-white flex items-center justify-center shadow-2xl shadow-current/20 transition-all group-hover:rotate-12 group-hover:scale-110`}>{icon}</div>
        <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 leading-none">{label}</p>
            <p className="text-4xl font-black text-slate-800 leading-none tracking-tighter">
                <AnimatedNumber value={val} />{suffix}
            </p>
        </div>
    </div>
);

const VerifyField = ({ label, oldVal, newVal }) => (
    <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-inner group hover:bg-white transition-all">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-5">
            <span className="text-xs font-bold text-slate-400 line-through opacity-60">{oldVal || '0'}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400"><ArrowRight size={16} /></div>
            <span className="text-base font-black text-indigo-600 bg-white px-5 py-2 rounded-xl border-2 border-indigo-100 shadow-sm">{newVal || '0'}</span>
        </div>
    </div>
);

export default FacultyDashboard;