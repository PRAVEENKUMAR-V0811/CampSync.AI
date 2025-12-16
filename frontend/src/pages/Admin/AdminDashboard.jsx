// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import AuthContext from '../Auth/AuthContext';
import { API_BASE_URL } from '../../api';

// --- Inline Icons ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
  Pending: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  CheckCircle: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  XCircle: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Logout: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
  Users: () => <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  Docs: () => <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>,
  Warning: () => <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
  SuccessBig: () => <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  TrashBig: () => <svg className="w-16 h-16 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ userCount: 0, totalDocs: 0, approvedDocs: 0, rejectedDocs: 0, pendingDocs: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  });

  useEffect(() => {
    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats`, getAuthConfig());
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl fixed h-full z-10">
        <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-900">
          <h1 className="text-xl font-bold tracking-wider text-white">ADMIN PANEL</h1>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <SidebarItem label="Overview" icon={<Icons.Dashboard />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem label="Pending Papers" icon={<Icons.Pending />} active={activeTab === 'Pending'} onClick={() => setActiveTab('Pending')} badge={stats.pendingDocs} />
          <SidebarItem label="Approved Papers" icon={<Icons.CheckCircle />} active={activeTab === 'Approved'} onClick={() => setActiveTab('Approved')} />
          <SidebarItem label="Rejected Papers" icon={<Icons.XCircle />} active={activeTab === 'Rejected'} onClick={() => setActiveTab('Rejected')} />
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:text-white hover:bg-red-600 rounded-md group">
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : `${activeTab} Documents`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'Admin'}</span>
            </p>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
           <DashboardStats stats={stats} loading={loadingStats} />
        ) : (
          <DocumentTable 
            status={activeTab} 
            getAuthConfig={getAuthConfig} 
            refreshStats={fetchStats}
          />
        )}
      </main>
    </div>
  );
};

// --- Sub Components ---

const SidebarItem = ({ label, icon, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 
      ${active ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:pl-5'}`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2 animate-pulse">{badge}</span>}
  </button>
);

const DashboardStats = ({ stats, loading }) => {
  if (loading) return <div>Loading Stats...</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      <StatCard title="Registered Users" count={stats.userCount} icon={<Icons.Users />} color="border-l-blue-500" />
      <StatCard title="Total Documents" count={stats.totalDocs} icon={<Icons.Docs />} color="border-l-gray-500" />
      <StatCard title="Approved Docs" count={stats.approvedDocs} icon={<Icons.CheckCircle />} color="border-l-green-500" textColor="text-green-600" />
      <StatCard title="Rejected Docs" count={stats.rejectedDocs} icon={<Icons.XCircle />} color="border-l-red-500" textColor="text-red-600" />
    </div>
  );
};

const StatCard = ({ title, count, icon, color, textColor = "text-gray-800" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color} flex items-center justify-between hover:shadow-md transition-shadow`}>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${textColor}`}>{count}</h3>
    </div>
    <div className="opacity-80 scale-110">{icon}</div>
  </div>
);

// --- The Main Logic for Pending/Approved/Rejected Lists ---
const DocumentTable = ({ status, getAuthConfig, refreshStats }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal States ---
  // type: 'approve' | 'reject' | 'delete' | null
  const [modalState, setModalState] = useState({ type: null, id: null }); 
  const [rejectionReason, setRejectionReason] = useState("");

  const quickReasons = ["Blurry Image", "Wrong Subject", "Duplicate File", "Exam Year Mismatch", "Irrelevant Content", "Low Quality"];

  useEffect(() => {
    fetchPapers();
  }, [status]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/papers?status=${status}`, getAuthConfig());
      setPapers(data);
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Triggers ---
  const openApproveModal = (id) => setModalState({ type: 'approve', id });
  const openDeleteModal = (id) => setModalState({ type: 'delete', id });
  const openRejectModal = (id) => {
    setRejectionReason("");
    setModalState({ type: 'reject', id });
  };
  const closeModal = () => setModalState({ type: null, id: null });

  // --- Actions ---
  const submitApprove = async () => {
    const loadingToast = toast.loading("Approving document...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/paper-status/${modalState.id}`, 
        { status: 'Approved' }, 
        getAuthConfig()
      );
      setPapers(papers.filter(p => p._id !== modalState.id));
      refreshStats(); 
      closeModal();
      toast.success("Document Approved", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to approve", { id: loadingToast });
    }
  };

  const submitReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    const loadingToast = toast.loading("Rejecting document...");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/paper-status/${modalState.id}`, 
        { status: 'Rejected', rejection_reason: rejectionReason }, 
        getAuthConfig()
      );
      setPapers(papers.filter(p => p._id !== modalState.id));
      refreshStats();
      closeModal();
      toast.success("Document Rejected", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to reject", { id: loadingToast });
    }
  };

  const submitDelete = async () => {
    const loadingToast = toast.loading("Deleting document...");
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/question-papers/${modalState.id}`, getAuthConfig());
      setPapers(papers.filter(p => p._id !== modalState.id));
      refreshStats();
      closeModal();
      toast.success('Deleted successfully', { id: loadingToast });
    } catch (err) {
      toast.error("Failed to delete", { id: loadingToast });
    }
  };

  const handleTagClick = (tag) => {
    setRejectionReason(prev => prev ? `${prev}, ${tag}` : tag);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading {status} documents...</div>;

  if (papers.length === 0) return (
    <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-dashed border-gray-300">
      <div className="text-gray-400 mb-4 mx-auto w-12 h-12"><Icons.Docs /></div>
      <h3 className="text-gray-600 text-lg font-medium">No {status} documents found.</h3>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title & File</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exam Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploader</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {papers.map((paper) => (
                <tr key={paper._id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{paper.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs" title={paper.original_filename}>
                      {paper.original_filename}
                    </div>
                    {paper.rejection_reason && (
                      <div className="mt-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                        Reason: {paper.rejection_reason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{paper.subject}</div>
                    <div className="text-xs text-gray-500">{paper.exam_name} ({paper.year})</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{paper.uploaded_by_user?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{paper.uploaded_by_user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <a 
                        href={paper.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="View PDF"
                      >
                        <Icons.Eye />
                      </a>
                      
                      {status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => openApproveModal(paper._id)}
                            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Approve"
                          >
                            <Icons.CheckCircle />
                          </button>
                          <button 
                            onClick={() => openRejectModal(paper._id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <Icons.XCircle />
                          </button>
                        </>
                      )}

                      {(status === 'Approved' || status === 'Rejected') && (
                        <button 
                          onClick={() => openDeleteModal(paper._id)}
                          className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Permanently"
                        >
                          <Icons.Trash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- APPROVE MODAL --- */}
      {modalState.type === 'approve' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-all"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-fade-in-up">
            <div className="flex flex-col items-center text-center">
              <Icons.SuccessBig />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Document?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This document will become visible to all students on the platform.
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={closeModal} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={submitApprove} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition-colors">
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REJECT MODAL --- */}
      {modalState.type === 'reject' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-all"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-fade-in-up">
            <div className="flex flex-col items-center text-center">
              <Icons.Warning />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Document</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please specify why this document is being rejected.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Quick Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {quickReasons.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Type reason here..."
                className="w-full h-24 px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-gray-50"
              ></textarea>
              
              <div className="flex space-x-3">
                <button onClick={closeModal} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={submitReject} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition-colors">
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {modalState.type === 'delete' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-all"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-fade-in-up">
            <div className="flex flex-col items-center text-center">
              <Icons.TrashBig />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Permanently?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The document will be removed from the database forever.
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={closeModal} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={submitDelete} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;