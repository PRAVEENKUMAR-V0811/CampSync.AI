// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import axios from 'axios';
// import AuthContext from '../Auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../../api';
// import toast, { Toaster } from 'react-hot-toast'; // Added Toaster
// import { 
//   User, Mail, Phone, ShieldCheck, GraduationCap, 
//   MapPin, Calendar, BookOpen, Clock, Edit3, 
//   ChevronRight, ArrowLeft, Loader2, Save, X, Lock 
// } from 'lucide-react';

// const ProfilePage = () => {
//   const { user, loading: authLoading, logout } = useContext(AuthContext);
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [error, setError] = useState(null);
  
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
//       toast.success('Profile updated successfully!');
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

//   if (loading || authLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
//         <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
//         <p className="text-lg font-bold text-slate-600 tracking-wide">Syncing your profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6">
//         <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
//           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">!</div>
//           <h2 className="text-xl font-bold text-slate-800 mb-2">Authentication Error</h2>
//           <p className="text-slate-500 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition-all"
//           >
//             Go back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !userData) return null;

//   const DetailItem = ({ icon: Icon, label, value, name, color, disabled = false, type = "text" }) => (
//     <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group relative">
//       <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
//         <Icon size={20} className={color.replace('bg-', 'text-')} />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
//           {isEditing && disabled && (
//             <div className="group/tooltip relative">
//               <Lock size={12} className="text-slate-400 mb-1 cursor-help" />
//               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-50">
//                 Contact admin to change this
//               </span>
//             </div>
//           )}
//         </div>
//         {isEditing ? (
//           <input
//             type={type}
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleInputChange}
//             disabled={disabled}
//             className={`w-full bg-transparent border-b-2 font-semibold text-slate-800 focus:outline-none transition-colors ${
//               disabled ? 'border-transparent text-slate-400 cursor-not-allowed' : 'border-indigo-200 focus:border-indigo-600'
//             }`}
//           />
//         ) : (
//           <p className="text-slate-800 font-semibold">{value || 'Not provided'}</p>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-12">
//       {/* <Toaster position="top-right" reverseOrder={false} /> */}
      
//       <div className="absolute top-0 left-0 w-full h-[400px] z-0 overflow-hidden">
//         <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[100%] bg-sky-200/40 rounded-full blur-[120px]"></div>
//         <div className="absolute top-0 -right-[10%] w-[50%] h-[80%] bg-indigo-200/40 rounded-full blur-[100px]"></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-4 pt-24 max-w-5xl">
//         <div className="flex justify-between items-center mb-8">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-bold cursor-pointer group"
//           >
//             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
//             <span>Dashboard</span>
//           </button>
          
//           <div className="flex items-center gap-3">
//             {isEditing && (
//                <div className="flex items-center bg-white px-4 py-2 rounded-2xl border border-indigo-100 shadow-sm mr-2">
//                  <span className="text-xs font-bold text-slate-400 mr-3 uppercase">Security: {captcha.q} = </span>
//                  <input 
//                   type="number" 
//                   value={userCaptcha}
//                   onChange={(e) => setUserCaptcha(e.target.value)}
//                   className="w-12 text-center border-b border-indigo-600 focus:outline-none font-bold text-indigo-600"
//                   placeholder="?"
//                  />
//                </div>
//             )}
//             {isEditing ? (
//               <>
//                 <button 
//                   onClick={() => setIsEditing(false)}
//                   className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm cursor-pointer text-slate-600"
//                 >
//                   <X size={16} />
//                   <span>Cancel</span>
//                 </button>
//                 <button 
//                   onClick={handleSave}
//                   disabled={saveLoading}
//                   className="flex items-center space-x-2 bg-indigo-600 px-5 py-2.5 rounded-full shadow-lg shadow-indigo-200 text-white hover:bg-indigo-700 transition-all font-bold text-sm cursor-pointer"
//                 >
//                   {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
//                   <span>Save Changes</span>
//                 </button>
//               </>
//             ) : (
//               <button 
//                 onClick={startEditing}
//                 className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold text-sm cursor-pointer"
//               >
//                 <Edit3 size={16} />
//                 <span>Edit Profile</span>
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Profile Sidebar */}
//           <div className="lg:w-1/3 space-y-6">
//             <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-white text-center">
//               <div className="relative w-32 h-32 mx-auto mb-6">
//                 <div className="w-full h-full rounded-[40px] bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200">
//                   {userData.name?.charAt(0)}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
//                   <ShieldCheck size={20} />
//                 </div>
//               </div>
              
//               {/* Name is now editable */}
//               {isEditing ? (
//                 <input
//                   name="name"
//                   value={formData.name || ''}
//                   onChange={handleInputChange}
//                   className="text-center w-full text-2xl font-black text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none"
//                 />
//               ) : (
//                 <h2 className="text-2xl font-black text-slate-900">{userData.name}</h2>
//               )}
              
//               <p className="text-slate-500 font-medium mb-4 mt-2">{userData.role || 'Student'}</p>
              
//               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-tighter border border-indigo-100">
//                 AI Placement Ready
//               </div>

//               <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-slate-400 font-medium">Profile Status</span>
//                   <span className="text-emerald-600 font-bold">100% Complete</span>
//                 </div>
//                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="h-full w-full bg-emerald-500 rounded-full"></div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
//               <div className="relative z-10">
//                 <h3 className="font-bold text-lg mb-2">Need Help?</h3>
//                 <p className="text-indigo-100 text-sm mb-4 leading-relaxed">Connect with our support if you need to update restricted info.</p>
//                 <button 
//                   onClick={() => navigate('/contact')}
//                   className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors cursor-pointer"
//                 >
//                   Contact Support
//                 </button>
//               </div>
//               <BookOpen className="absolute -bottom-4 -right-4 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform" size={120} />
//             </div>
//           </div>

//           <div className="lg:w-2/3 space-y-6">
//             <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-white">
//               <div className="flex items-center space-x-3 mb-8">
//                 <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
//                   <GraduationCap size={24} />
//                 </div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">Academic Identity</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DetailItem icon={MapPin} label="College" value={userData.college} name="college" color="bg-blue-500" />
//                 <DetailItem icon={BookOpen} label="Branch" value={userData.branch} name="branch" color="bg-indigo-500" />
//                 <DetailItem icon={GraduationCap} label="Education" value={userData.education} name="education" color="bg-purple-500" />
//                 <DetailItem icon={Calendar} label="Passing Year" value={userData.passingYear} name="passingYear" color="bg-sky-500" type="number" />
//               </div>
//             </div>

//             <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-white">
//               <div className="flex items-center space-x-3 mb-8">
//                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
//                   <User size={24} />
//                 </div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">Personal Details</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DetailItem icon={Mail} label="Email Address" value={userData.email} name="email" color="bg-emerald-500" disabled={true} />
//                 <DetailItem icon={Phone} label="Phone Number" value={userData.phone} name="phone" color="bg-orange-500" disabled={true} />
//                 <DetailItem icon={User} label="Gender" value={userData.gender} name="gender" color="bg-pink-500" />
//                 <DetailItem 
//                     icon={Clock} 
//                     label="Member Since" 
//                     value={new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
//                     name="createdAt" 
//                     color="bg-slate-500" 
//                     disabled={true} 
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div onClick={() => navigate('/placements/data')} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all">
//                 <div className="flex items-center space-x-4">
//                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={24} /></div>
//                   <span className="font-bold text-slate-700 tracking-tight">Placement Status</span>
//                 </div>
//                 <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
//               </div>

//               <div onClick={() => navigate('/submit-feedback')} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-sky-200 hover:shadow-lg transition-all">
//                 <div className="flex items-center space-x-4">
//                   <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl"><Edit3 size={24} /></div>
//                   <span className="font-bold text-slate-700 tracking-tight">Share Experience</span>
//                 </div>
//                 <ChevronRight size={20} className="text-slate-300 group-hover:text-sky-600 transition-colors" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
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
import { 
  User, Mail, Phone, ShieldCheck, GraduationCap, 
  MapPin, Calendar, BookOpen, Clock, Edit3, 
  ChevronRight, ArrowLeft, Loader2, Save, X, Lock 
} from 'lucide-react';

const ProfilePage = () => {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Captcha State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [userCaptcha, setUserCaptcha] = useState('');

  const navigate = useNavigate();

  // Function to generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
    setUserCaptcha('');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;
      if (!user || !user.token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);
        setUserData(data);
        setFormData(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
        setError(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate, logout]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Captcha Validation
    if (parseInt(userCaptcha) !== captcha.a) {
      toast.error('Incorrect Captcha answer. Please try again.');
      generateCaptcha();
      return;
    }

    setSaveLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      };
      
      // Logic: Academic fields go into 'pendingAcademicUpdate' in backend
      const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, config);
      
      setUserData(data);
      setIsEditing(false);
      toast.success('Profile updated! Academic changes sent for faculty approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const startEditing = () => {
    generateCaptcha();
    setIsEditing(true);
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-lg font-bold text-slate-600 tracking-wide">Syncing your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">!</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Authentication Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition-all"
          >
            Go back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user || !userData) return null;

  // Helper Component for Profile Details
  const DetailItem = ({ icon: Icon, label, value, name, color, disabled = false, type = "text" }) => (
    <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group relative">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          {isEditing && disabled && (
            <div className="group/tooltip relative">
              <Lock size={12} className="text-slate-400 mb-1 cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-50">
                Contact admin to change this
              </span>
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full bg-transparent border-b-2 font-semibold text-slate-800 focus:outline-none transition-colors ${
              disabled ? 'border-transparent text-slate-400 cursor-not-allowed' : 'border-indigo-200 focus:border-indigo-600'
            }`}
          />
        ) : (
          <p className="text-slate-800 font-semibold">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  // New Helper Component for Academic Performance
  const AcademicItem = ({ label, value, isPending, name }) => (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            className="w-full bg-transparent border-b border-indigo-200 font-bold text-slate-800 focus:outline-none"
          />
        ) : (
          <p className="font-bold text-slate-800">{value}</p>
        )}
        {isPending && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-[8px] font-black text-amber-600 uppercase">Awaiting Faculty Approval</span>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-12">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="absolute top-0 left-0 w-full h-[400px] z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[100%] bg-sky-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 -right-[10%] w-[50%] h-[80%] bg-indigo-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-bold cursor-pointer group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            {isEditing && (
               <div className="flex items-center bg-white px-4 py-2 rounded-2xl border border-indigo-100 shadow-sm mr-2">
                 <span className="text-xs font-bold text-slate-400 mr-3 uppercase">Security: {captcha.q} = </span>
                 <input 
                  type="number" 
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  className="w-12 text-center border-b border-indigo-600 focus:outline-none font-bold text-indigo-600"
                  placeholder="?"
                 />
               </div>
            )}
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm cursor-pointer text-slate-600"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex items-center space-x-2 bg-indigo-600 px-5 py-2.5 rounded-full shadow-lg shadow-indigo-200 text-white hover:bg-indigo-700 transition-all font-bold text-sm cursor-pointer"
                >
                  {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button 
                onClick={startEditing}
                className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold text-sm cursor-pointer"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-white text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-[40px] bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200">
                  {userData.name?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              {isEditing ? (
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="text-center w-full text-2xl font-black text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-black text-slate-900">{userData.name}</h2>
              )}
              
              <p className="text-slate-500 font-medium mb-4 mt-2">{userData.role || 'Student'}</p>
              
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-tighter border border-indigo-100">
                AI Placement Ready
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Profile Status</span>
                  <span className="text-emerald-600 font-bold">100% Complete</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">Connect with our support if you need to update restricted info.</p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
              <BookOpen className="absolute -bottom-4 -right-4 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform" size={120} />
            </div>
          </div>

          {/* Profile Main Content */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* ACADEMIC SECTION */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-white">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <GraduationCap size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Academic Performance</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AcademicItem
                    label="CGPA"
                    value={userData.cgpa}
                    isPending={userData.academicUpdatePending} // Matches updated route
                    name="cgpa"
                  />
                  <AcademicItem
                    label="History of Arrear"
                    value={userData.historyOfArrear}
                    isPending={userData.academicUpdatePending}
                    name="historyOfArrear"
                  />
                  <AcademicItem
                    label="Current Backlogs"
                    value={userData.currentBacklog}
                    isPending={userData.academicUpdatePending}
                    name="currentBacklog"
                  />
                  <AcademicItem
                    label="Current Semester"
                    value={userData.currentSemester}
                    isPending={userData.academicUpdatePending}
                    name="currentSemester"
                  />
                </div>
            </div>

            {/* PLACEMENT SECTION (READ ONLY) */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black">Official Placement Record</h3>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${userData.placementStatus === 'Placed' ? 'bg-green-500' : 'bg-slate-700'}`}>
                            {userData.placementStatus || 'Unplaced'}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Company</p>
                            <p className="text-lg font-bold">{userData.recentCompany || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package (LPA)</p>
                            <p className="text-lg font-bold">₹{userData.packageLPA || '0'} LPA</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Type</p>
                            <p className="text-lg font-bold">{userData.jobType || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intern Stipend</p>
                            <p className="text-lg font-bold">₹{userData.internStipend || '0'}/mo</p>
                        </div>
                    </div>
                    <p className="mt-8 text-[10px] text-slate-500 italic">* Managed and verified by Faculty Coordinator</p>
                </div>
            </div>

            {/* OTHER IDENTITY DETAILS */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-white">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity & Contact</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon={MapPin} label="College" value={userData.college} name="college" color="bg-blue-500" />
                <DetailItem icon={BookOpen} label="Branch" value={userData.branch} name="branch" color="bg-indigo-500" />
                <DetailItem icon={Mail} label="Email Address" value={userData.email} name="email" color="bg-emerald-500" disabled={true} />
                <DetailItem icon={Phone} label="Phone Number" value={userData.phone} name="phone" color="bg-orange-500" disabled={true} />
                <DetailItem icon={Phone} label="Register Number" value={userData.regNo} name="regNo" color="bg-orange-500" disabled={true} />
              </div>
            </div>

            {/* NAVIGATION LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => navigate('/placements/data')} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={24} /></div>
                  <span className="font-bold text-slate-700 tracking-tight">Full Placement Data</span>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </div>

              <div onClick={() => navigate('/submit-feedback')} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-sky-200 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl"><Edit3 size={24} /></div>
                  <span className="font-bold text-slate-700 tracking-tight">Share Experience</span>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-sky-600 transition-colors" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;