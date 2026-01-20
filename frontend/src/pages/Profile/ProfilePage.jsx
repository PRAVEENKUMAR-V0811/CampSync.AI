// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import AuthContext from '../Auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../../api';
// import toast, { Toaster } from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   User, Mail, Phone, ShieldCheck, GraduationCap, 
//   MapPin, Calendar, BookOpen, Clock, Edit3, 
//   ChevronRight, ArrowLeft, Loader2, Save, X, Lock,
//   UploadCloud, AlertCircle, CheckCircle2, Hash
// } from 'lucide-react';

// const ProfilePage = () => {
//   const { user, loading: authLoading, logout } = useContext(AuthContext);
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Modal State for Verification
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
  
//   // Captcha State
//   const [captcha, setCaptcha] = useState({ q: '', a: 0 });
//   const [userCaptcha, setUserCaptcha] = useState('');

//   const navigate = useNavigate();

//   // Function to generate simple math captcha
//   const generateCaptcha = () => {
//     const num1 = Math.floor(Math.random() * 10) + 1;
//     const num2 = Math.floor(Math.random() * 10) + 1;
//     setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
//     setUserCaptcha('');
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (authLoading) return;
//       if (!user || !user.token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }

//       try {
//         const config = {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${user.token}`,
//           },
//         };
//         const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);
//         setUserData(data);
//         setFormData(data);
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
//         setError(errorMessage);
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           logout();
//           navigate('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [user, authLoading, navigate, logout]);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     // Captcha Validation
//     if (parseInt(userCaptcha) !== captcha.a) {
//       toast.error('Incorrect Captcha answer. Please try again.');
//       generateCaptcha();
//       return;
//     }

//     setSaveLoading(true);
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`,
//         },
//       };
      
//       const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, config);
      
//       setUserData(data);
//       setIsEditing(false);
//       setShowVerifyModal(false);
//       toast.success('Profile updated! Academic changes sent for faculty approval.');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const startEditing = () => {
//     generateCaptcha();
//     setIsEditing(true);
//   };

//   // Functional Status Logic
//   const calculateProgress = () => {
//     if (!userData) return 0;
//     // If an update is pending, the profile is technically "Incomplete" until verified
//     return userData.academicUpdatePending ? 75 : 100;
//   };

//   if (loading || authLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8fafc]">
//         <motion.div 
//             animate={{ rotate: 360 }} 
//             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//             className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"
//         />
//         <p className="text-lg font-black text-slate-700 tracking-tighter uppercase">Syncing your profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6 text-left">
//         <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-100 text-center max-w-md">
//           <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
//             <AlertCircle size={40} />
//           </div>
//           <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Authentication Error</h2>
//           <p className="text-slate-500 mb-8 font-medium leading-relaxed">{error}</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all cursor-pointer uppercase text-xs tracking-widest"
//           >
//             Go back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const DetailItem = ({ icon: Icon, label, value, name, color, disabled = false, type = "text" }) => (
//     <div className="flex items-center space-x-4 p-5 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden">
//       <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-all group-hover:scale-110 group-hover:rotate-6`}>
//         <Icon size={22} className={color.replace('bg-', 'text-')} />
//       </div>
//       <div className="flex-1 overflow-hidden">
//         <div className="flex items-center gap-2">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
//           {isEditing && disabled && (
//             <Lock size={10} className="text-slate-300" />
//           )}
//         </div>
//         {isEditing ? (
//           <input
//             type={type}
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleInputChange}
//             disabled={disabled}
//             className={`w-full bg-transparent border-b-2 font-black text-slate-800 focus:outline-none transition-colors py-1 ${
//               disabled ? 'border-transparent text-slate-400 cursor-not-allowed opacity-50' : 'border-indigo-100 focus:border-indigo-600'
//             }`}
//           />
//         ) : (
//           <p className="text-slate-800 font-black truncate tracking-tight">{value || 'Not provided'}</p>
//         )}
//       </div>
//     </div>
//   );

//   const AcademicItem = ({ label, value, isPending, name }) => (
//     <div className={`p-5 rounded-[2rem] border transition-all relative overflow-hidden ${isPending ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-lg hover:border-indigo-100'}`}>
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
//         {isEditing ? (
//           <input
//             type="text"
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleInputChange}
//             className="w-full bg-transparent border-b-2 border-indigo-200 font-black text-slate-800 focus:outline-none focus:border-indigo-600 py-1"
//           />
//         ) : (
//           <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
//         )}
//         {isPending && (
//             <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-sm">
//                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
//                 <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Awaiting Approval</span>
//             </div>
//         )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20 text-left">
//       <Toaster position="top-right" reverseOrder={false} />
      
//       {/* Dynamic Background */}
//       <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none opacity-60">
//         <div className="absolute -top-[10%] -left-[5%] w-[70%] h-[100%] bg-indigo-200/30 rounded-full blur-[120px]"></div>
//         <div className="absolute top-[10%] -right-[5%] w-[50%] h-[80%] bg-sky-200/30 rounded-full blur-[100px]"></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-4 pt-10 lg:pt-20 max-w-6xl">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="flex items-center space-x-3 text-slate-500 hover:text-indigo-600 transition-all font-black uppercase text-xs tracking-widest cursor-pointer group bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100"
//           >
//             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Dashboard</span>
//           </button>
          
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             {isEditing ? (
//               <div className="flex gap-3 w-full">
//                 <button 
//                   onClick={() => setIsEditing(false)}
//                   className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white px-8 py-4 rounded-[20px] shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest cursor-pointer text-slate-500"
//                 >
//                   <X size={16} />
//                   <span>Discard</span>
//                 </button>
//                 <button 
//                   onClick={() => setShowVerifyModal(true)}
//                   className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-600 px-8 py-4 rounded-[20px] shadow-2xl shadow-indigo-200 text-white hover:bg-indigo-700 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
//                 >
//                   <Save size={16} />
//                   <span>Verify & Save</span>
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={startEditing}
//                 className="w-full md:w-auto flex items-center justify-center space-x-2 bg-slate-900 px-8 py-4 rounded-[20px] shadow-2xl shadow-slate-200 text-white hover:bg-indigo-600 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
//               >
//                 <Edit3 size={16} />
//                 <span>Update Profile</span>
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Enhanced Profile Sidebar */}
//           <div className="lg:w-[32%] space-y-8">
//             <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-10 border border-white text-center relative overflow-hidden group">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0 transition-all group-hover:scale-110 duration-700" />
              
//               <div className="relative z-10">
//                 <div className="relative w-36 h-36 mx-auto mb-8">
//                     <div className="w-full h-full rounded-[48px] bg-slate-900 flex items-center justify-center text-indigo-400 text-5xl font-black shadow-2xl ring-8 ring-slate-50">
//                     {userData.name?.charAt(0)}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-xl">
//                     <ShieldCheck size={22} strokeWidth={3} />
//                     </div>
//                 </div>
                
//                 <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{userData.name}</h2>
//                 <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-6 mt-3">{userData.branch || 'General Studies'}</p>
                
//                 <div className="inline-flex items-center px-5 py-2 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
//                     {userData.regNo}
//                 </div>

//                 <div className="mt-12 pt-10 border-t border-slate-50 space-y-5">
//                     <div className="flex justify-between items-end">
//                     <div className="text-left">
//                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Vitality</p>
//                         <p className={`text-xl font-black tracking-tighter leading-none ${calculateProgress() === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
//                             {calculateProgress()}% Verified
//                         </p>
//                     </div>
//                     <div className="bg-slate-50 p-2 rounded-lg">
//                         {calculateProgress() === 100 ? <CheckCircle2 className="text-emerald-500" size={20}/> : <Clock className="text-amber-500" size={20}/>}
//                     </div>
//                     </div>
//                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
//                     <motion.div 
//                         initial={{ width: 0 }}
//                         animate={{ width: `${calculateProgress()}%` }}
//                         className={`h-full rounded-full ${calculateProgress() === 100 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'}`}
//                     />
//                     </div>
//                     {userData.academicUpdatePending && (
//                         <p className="text-[9px] font-bold text-amber-600 uppercase text-center bg-amber-50 py-1.5 rounded-lg">
//                             Approval requested: Efficiency reduced to 75%
//                         </p>
//                     )}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
//               <div className="relative z-10">
//                 <h3 className="text-2xl font-black tracking-tight mb-3">Institutional Support</h3>
//                 <p className="text-indigo-100 text-sm mb-8 leading-relaxed font-medium">Need to update verified academic metrics or restricted identifiers? Connect with our administration.</p>
//                 <button 
//                   onClick={() => navigate('/contact')}
//                   className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all cursor-pointer shadow-lg"
//                 >
//                   Contact Support Team
//                 </button>
//               </div>
//               <BookOpen className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" size={160} />
//             </div>
//           </div>

//           {/* Profile Main Content */}
//           <div className="lg:w-[68%] space-y-8">
            
//             {/* ACADEMIC SECTION */}
//             <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/60 border border-white relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-8 text-slate-50/50 -z-0">
//                     <GraduationCap size={120} />
//                 </div>
//                 <div className="flex items-center space-x-4 mb-10 relative z-10">
//                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center shadow-inner">
//                         <GraduationCap size={28} strokeWidth={2.5} />
//                     </div>
//                     <div className="text-left leading-none">
//                         <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Academic Metrics</h3>
//                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Performance Data</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
//                   <AcademicItem label="Current CGPA" value={userData.cgpa} isPending={userData.academicUpdatePending} name="cgpa" />
//                   <AcademicItem label="Arrear History" value={userData.historyOfArrear} isPending={userData.academicUpdatePending} name="historyOfArrear" />
//                   <AcademicItem label="Current Backlogs" value={userData.currentBacklog} isPending={userData.academicUpdatePending} name="currentBacklog" />
//                   <AcademicItem label="Active Semester" value={userData.currentSemester} isPending={userData.academicUpdatePending} name="currentSemester" />
//                 </div>
//             </div>

//             {/* PLACEMENT SECTION */}
//             <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
//                     <ShieldCheck size={200} />
//                 </div>
//                 <div className="relative z-10 text-left">
//                     <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
//                         <div className="leading-none">
//                             <h3 className="text-2xl font-black tracking-tighter">Verified Corporate Record</h3>
//                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Verified by Placement Cell</p>
//                         </div>
//                         <span className={`w-fit px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${userData.placementStatus === 'Placed' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-700 text-slate-300'}`}>
//                             {userData.placementStatus || 'Unplaced'}
//                         </span>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                         <div className="space-y-1">
//                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Company</p>
//                             <p className="text-lg font-black tracking-tight">{userData.recentCompany || '---'}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CTC Package</p>
//                             <p className="text-lg font-black tracking-tight text-indigo-400">₹{userData.packageLPA || '0'} LPA</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contract Type</p>
//                             <p className="text-lg font-black tracking-tight">{userData.jobType || '---'}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Stipend</p>
//                             <p className="text-lg font-black tracking-tight text-emerald-400">₹{userData.internStipend || '0'}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* IDENTITY DETAILS */}
//             <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-10 border border-white relative">
//               <div className="flex items-center space-x-4 mb-10">
//                 <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-[20px] flex items-center justify-center shadow-inner">
//                   <User size={28} strokeWidth={2.5} />
//                 </div>
//                 <div className="text-left leading-none">
//                     <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Identity Profiles</h3>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Contact Directory</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <DetailItem icon={MapPin} label="Institution" value={userData.college} name="college" color="bg-blue-500" />
//                 <DetailItem icon={BookOpen} label="Academic Branch" value={userData.branch} name="branch" color="bg-indigo-500" />
//                 <DetailItem icon={Mail} label="Official Email" value={userData.email} name="email" color="bg-emerald-500" disabled={true} />
//                 <DetailItem icon={Phone} label="Primary Contact" value={userData.phone} name="phone" color="bg-orange-500" disabled={true} />
//                 <DetailItem icon={Hash} label="Institutional ID" value={userData.regNo} name="regNo" color="bg-slate-500" disabled={true} />
//                 <DetailItem icon={Calendar} label="Passing Batch" value={userData.passingYear} name="passingYear" color="bg-violet-500" />
//               </div>
//             </div>

//             {/* NAVIGATION LINKS GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div onClick={() => navigate('/placements/data')} className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-500 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center space-x-4 overflow-hidden text-left leading-tight">
//                   <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><ShieldCheck size={22} /></div>
//                   <div className="overflow-hidden"><span className="font-black text-slate-700 tracking-tight text-sm block">Placement Data</span><span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verified Lists</span></div>
//                 </div>
//                 <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
//               </div>

//               {/* NEW: MY UPLOADS SECTION */}
//               <div onClick={() => navigate('/my-uploads')} className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-violet-500 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center space-x-4 overflow-hidden text-left leading-tight">
//                   <div className="p-3.5 bg-violet-50 text-violet-600 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-all"><UploadCloud size={22} /></div>
//                   <div className="overflow-hidden"><span className="font-black text-slate-700 tracking-tight text-sm block">My Uploads</span><span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Academic Bank</span></div>
//                 </div>
//                 <ChevronRight size={18} className="text-slate-300 group-hover:text-violet-600 transition-colors" />
//               </div>

//               <div onClick={() => navigate('/submit-feedback')} className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-sky-500 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center space-x-4 overflow-hidden text-left leading-tight">
//                   <div className="p-3.5 bg-sky-50 text-sky-600 rounded-2xl group-hover:bg-sky-600 group-hover:text-white transition-all"><Edit3 size={22} /></div>
//                   <div className="overflow-hidden"><span className="font-black text-slate-700 tracking-tight text-sm block">Share Experience</span><span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Inspire Peers</span></div>
//                 </div>
//                 <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-600 transition-colors" />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* POP-UP VERIFICATION WINDOW (MODAL) */}
//       <AnimatePresence>
//         {showVerifyModal && (
//             <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
//                 <motion.div 
//                     initial={{ opacity: 0 }} 
//                     animate={{ opacity: 1 }} 
//                     exit={{ opacity: 0 }}
//                     onClick={() => setShowVerifyModal(false)}
//                     className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
//                 />
//                 <motion.div 
//                     initial={{ scale: 0.9, y: 20, opacity: 0 }} 
//                     animate={{ scale: 1, y: 0, opacity: 1 }} 
//                     exit={{ scale: 0.9, y: 20, opacity: 0 }}
//                     className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 border border-white text-center"
//                 >
//                     <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
//                         <ShieldCheck size={40} />
//                     </div>
//                     <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Final Verification</h3>
//                     <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">To finalize your profile updates, please complete the math challenge below to verify your session.</p>
                    
//                     <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 mb-8">
//                         <div className="flex items-center justify-between gap-4">
//                             <div className="text-left">
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Human Check</p>
//                                 <p className="text-xl font-black text-slate-800 tracking-tighter">{captcha.q} = ?</p>
//                             </div>
//                             <input 
//                                 type="number" 
//                                 value={userCaptcha}
//                                 onChange={(e) => setUserCaptcha(e.target.value)}
//                                 className="w-24 p-4 rounded-2xl border-2 border-indigo-100 bg-white text-center text-xl font-black text-indigo-600 focus:border-indigo-600 focus:outline-none transition-all shadow-sm"
//                                 placeholder="..."
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-col gap-3">
//                         <button 
//                             onClick={handleSave}
//                             disabled={saveLoading}
//                             className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest cursor-pointer disabled:opacity-70"
//                         >
//                             {saveLoading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
//                             <span>Confirm & Sync Profile</span>
//                         </button>
//                         <button 
//                             onClick={() => setShowVerifyModal(false)}
//                             className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all cursor-pointer"
//                         >
//                             Go Back
//                         </button>
//                     </div>
//                 </motion.div>
//             </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { 
  User, Mail, Phone, ShieldCheck, GraduationCap, 
  MapPin, Calendar, BookOpen, Clock, Edit3, 
  ChevronRight, ArrowLeft, Loader2, Save, X, Lock,
  UploadCloud, AlertCircle, CheckCircle2, Hash,
  Trophy, School, CircuitBoard, Fingerprint, PhoneCall,
  BarChart3, AlertTriangle, History, Layers, Milestone,
  Zap, RefreshCcw, Star, Briefcase, HelpCircle, Building2, Wallet
} from 'lucide-react';

// --- ANIMATED NUMBER COMPONENT ---
const AnimatedNumber = ({ value, precision = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
    const controls = animate(0, numericValue || 0, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest.toFixed(precision))
    });
    return () => controls.stop();
  }, [value, precision]);
  return <span>{displayValue}</span>;
};

// --- HELPER COMPONENTS ---
const DetailItem = ({ icon: Icon, label, value, name, color, disabled = false, type = "text", isEditing, handleInputChange, formData }) => (
  <div className="flex items-center space-x-4 p-5 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group relative overflow-hidden cursor-pointer">
    <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-all group-hover:rotate-12`}>
      <Icon size={18} className={color.replace('bg-', 'text-')} />
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      {isEditing && !disabled ? (
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          className="w-full bg-transparent border-b-2 font-black text-slate-800 focus:outline-none py-1 border-indigo-100 focus:border-indigo-600 text-sm"
        />
      ) : (
        <p className="font-black tracking-tight text-sm text-slate-800">{value || '---'}</p>
      )}
    </div>
    
    {disabled && (
      <div className="absolute top-4 right-4 flex items-center group/tooltip">
        <Lock size={12} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
        <span className="absolute right-0 top-6 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none uppercase tracking-tighter">
          Non-editable field
        </span>
      </div>
    )}
  </div>
);

const AcademicItem = ({ label, value, isPending, name, isEditing, handleInputChange, formData }) => (
  <div className={`p-6 rounded-[2rem] border transition-all relative group/ac ${isPending ? 'bg-amber-50/20 border-amber-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 cursor-pointer'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          className="w-full bg-transparent border-b-2 border-indigo-200 font-black text-slate-800 text-lg focus:outline-none focus:border-indigo-600 py-1"
        />
      ) : (
        <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
      )}
      {isPending && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[8px] font-black text-amber-600 uppercase">Pending</span>
          </div>
      )}
  </div>
);

const SidebarNav = ({ onClick, icon: Icon, title, sub, color }) => (
  <div onClick={onClick} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-500 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center space-x-4">
          <div className={`p-3 ${color} bg-opacity-10 text-opacity-100 rounded-2xl group-hover:bg-opacity-100 group-hover:text-white transition-all`}>
              <Icon size={18} className={color.replace('bg-', 'text-')} />
          </div>
          <div className="text-left">
              <span className="font-black text-slate-700 tracking-tight text-sm block leading-none">{title}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1 block leading-tight">{sub}</span>
          </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
  </div>
);

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [captcha, setCaptcha] = useState({ q: '', a: '' });
  const [userCaptcha, setUserCaptcha] = useState('');

  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha({ q: res, a: res });
    setUserCaptcha('');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;
      if (!user?.token) { navigate('/login'); return; }
      try {
        const config = { headers: { 'Authorization': `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);
        setUserData(data);
        setFormData(data);
      } catch (err) { setError('Failed to fetch profile'); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [user, authLoading, navigate]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (userCaptcha !== captcha.a) { toast.error('Incorrect Security Code (Case Sensitive).'); generateCaptcha(); return; }
    setSaveLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` } };
      const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, config);
      setUserData(data);
      setIsEditing(false);
      setShowVerifyModal(false);
      toast.success('Cloud Profile Synced!');
    } catch (err) { toast.error('Update failed'); } 
    finally { setSaveLoading(false); }
  };

  if (loading || authLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8fafc]">
      <Loader2 className="text-indigo-600 animate-spin" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-24 text-left pt-24 lg:pt-32">
      <Toaster position="top-right" />
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-3 text-slate-500 hover:text-indigo-600 transition-all font-black uppercase text-[10px] tracking-widest bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 active:scale-95 cursor-pointer">
            <ArrowLeft size={16} /><span>Portal</span>
          </button>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {isEditing ? (
              <div className="flex gap-3 w-full">
                <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 cursor-pointer">Discard</button>
                <button onClick={() => setShowVerifyModal(true)} className="flex-1 md:flex-none bg-indigo-600 px-6 py-3 rounded-xl shadow-xl shadow-indigo-100 text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">Sync Changes</button>
              </div>
            ) : (
              <button onClick={() => { generateCaptcha(); setIsEditing(true); }} className="w-full md:w-auto flex items-center justify-center space-x-2 bg-slate-900 px-8 py-3.5 rounded-xl shadow-xl text-white hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
                <Edit3 size={14} /><span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN - SIDEBAR NAVIGATION */}
          <div className="lg:w-[32%] w-full space-y-4 sticky top-32">
            
            {/* 1. Enhanced Profile Identity Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 border border-white text-center group">
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="w-full h-full rounded-[3rem] bg-slate-900 flex items-center justify-center text-indigo-400 text-5xl font-black shadow-2xl ring-8 ring-slate-50 transition-transform group-hover:scale-105 duration-500">
                        {userData.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
                        <ShieldCheck size={20} strokeWidth={3} />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">{userData.name}</h2>
                <div className="mt-4 space-y-1">
                    <p className="text-indigo-600 font-black text-[11px] uppercase tracking-widest">{userData.branch}</p>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-1">
                        <Fingerprint size={12} className="opacity-50" /> {userData.regNo}
                    </p>
                </div>
            </div>

            {/* 2. Navigation Container */}
            <div className="space-y-3">
                <SidebarNav onClick={() => navigate('/placements/data')} icon={BarChart3} title="Placement Data" sub="Know about the Placement Trends" color="bg-indigo-600 text-white drop-shadow-sm" />
                <SidebarNav onClick={() => navigate('/my-uploads')} icon={UploadCloud} title="My Uploads" sub="Manage your academic bank" color="bg-violet-600 text-white drop-shadow-sm" />
                <SidebarNav onClick={() => navigate('/submit-feedback')} icon={Edit3} title="Share Experience" sub="Inspire peers with your journey" color="bg-sky-600 text-white drop-shadow-sm" />
            </div>

            {/* 3. Support Container */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-5">
                <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <HelpCircle size={18} className="text-indigo-400" /> Support
                    </h3>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed uppercase tracking-tighter">
                        Institution and identifiers are locked for data integrity.
                    </p>
                </div>
                <button onClick={() => navigate('/contact')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-500 transition-all cursor-pointer active:scale-95">Contact Advisor</button>
            </div>
          </div>

          {/* RIGHT COLUMN - CONTENT BLOCKS */}
          <div className="lg:w-[68%] w-full space-y-8">
            
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Academic Metrics</h3>
                    <Layers className="text-slate-200" size={32} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AcademicItem label="Current CGPA" value={userData.cgpa} isPending={userData.academicUpdatePending} name="cgpa" isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                  <AcademicItem label="Arrear History" value={userData.historyOfArrear} isPending={userData.academicUpdatePending} name="historyOfArrear" isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                  <AcademicItem label="Current Backlogs" value={userData.currentBacklog} isPending={userData.academicUpdatePending} name="currentBacklog" isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                  <AcademicItem label="Active Semester" value={userData.currentSemester} isPending={userData.academicUpdatePending} name="currentSemester" isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                </div>
            </div>

            {/* ENHANCED CORPORATE HUB */}
            <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl cursor-default text-white drop-shadow-sm">
                <motion.div animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-[length:200%_200%]" />
                <div className="relative z-10 p-10 text-white text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 size={14} className="text-indigo-400" />
                                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Institutional Placed Record</p>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                {userData.recentCompany || 'No Record'}
                            </h3>
                        </div>
                        <div className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${userData.placementStatus === 'Placed' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-500'}`}>
                            {userData.placementStatus === 'Placed' ? <CheckCircle2 size={12} /> : null}
                            {userData.placementStatus || 'Unplaced'}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col items-start relative overflow-hidden group/card">
                            <Wallet className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors" size={80} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={12} className="text-amber-500" /> Package Secured</p>
                            <p className="text-4xl font-black tracking-tighter text-amber-500 relative z-10">
                                ₹<AnimatedNumber value={userData.packageLPA} precision={1} /> <span className="text-sm text-slate-500 font-bold">LPA</span>
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col items-start relative overflow-hidden group/card">
                            <Trophy className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors" size={80} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Star size={12} className="text-indigo-400" /> Selection Count</p>
                            <p className="text-4xl font-black tracking-tighter text-white relative z-10">
                                <AnimatedNumber value={userData.offersCount} /> <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">Offers</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white ">
              <div className="flex items-center space-x-4 mb-8 text-left">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner"><User size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Identity Profiles</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <DetailItem icon={(props) => (<PhoneCall {...props} style={{ color: '#ffffff' }} size={20} />)} label="Primary Contact" value={userData.phone} name="phone" color="bg-orange-500" isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} className="text-white drop-shadow-sm"/>
                <DetailItem icon={(props) => (<School {...props} style={{ color: '#ffffff' }} size={20} />)} label="Institution" value={userData.college} name="college" color="bg-blue-500" disabled={true} isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                <DetailItem icon={(props) => (<Calendar {...props} style={{ color: '#ffffff' }} size={20} />)} label="Passing Batch" value={userData.passingYear} name="passingYear" color="bg-violet-500" disabled={true} isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                <DetailItem icon={(props) => (<CircuitBoard {...props} style={{ color: '#ffffff' }} size={20} />)} label="Academic Branch" value={userData.branch} name="branch" color="bg-indigo-500" disabled={true} isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                <DetailItem icon={(props) => (<Mail {...props} style={{ color: '#ffffff' }} size={20} />)} label="Official Email" value={userData.email} name="email" color="bg-emerald-500" disabled={true} isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
                <DetailItem icon={(props) => (<Fingerprint {...props} style={{ color: '#ffffff' }} size={20} />)}label="Institutional ID" value={userData.regNo} name="regNo" color="bg-slate-500" disabled={true} isEditing={isEditing} handleInputChange={handleInputChange} formData={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENHANCED SECURITY MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500" />
                    
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner relative group">
                        <Lock size={36} className="group-hover:rotate-12 transition-transform" />
                        <div className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md"><ShieldCheck size={16} className="text-emerald-500" /></div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2 uppercase">Save Edit</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Confirm security code to finalize</p>
                    
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] mb-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-5 mb-6">
                                <p className="text-3xl font-black text-white tracking-[0.2em] italic select-none drop-shadow-lg">{captcha.q}</p>
                                <button onClick={generateCaptcha} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"><RefreshCcw size={16} /></button>
                            </div>
                            <input 
                                type="text" 
                                value={userCaptcha} 
                                onChange={(e) => setUserCaptcha(e.target.value)} 
                                className="w-full p-4 rounded-2xl bg-white/5 text-center text-xl font-black text-white border border-white/10 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/20" 
                                placeholder="Enter Captcha" 
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button onClick={handleSave} disabled={saveLoading} className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50">
                            {saveLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Finalize Sync'}
                        </button>
                        <button onClick={() => setShowVerifyModal(false)} className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors cursor-pointer">Abort Synchronization</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;