// src/components/modules/auth/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompanyScroller from '../CompanyScroller';
import { API_BASE_URL } from '../../api';
import logo from "../../assets/logofinal.png"; 
import { Eye, EyeOff, User, Mail, Phone, GraduationCap, Building2, Calendar, ClipboardCheck, ArrowRight } from 'lucide-react';

const Signup = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [passingYear, setPassingYear] = useState('');
  
  // New Fields State
  const [regNo, setRegNo] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [historyOfArrear, setHistoryOfArrear] = useState('No');
  const [currentBacklog, setCurrentBacklog] = useState('0');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle states for passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();

  const educationOptions = ["B.E", "B.Tech", "M.E", "M.Tech", "PhD", "MBA"];
  const branchOptions = ["CSE", "CSE(AIML)", "EEE", "ECE", "IT"];
  const currentYear = new Date().getFullYear();
  const passingYearOptions = Array.from({ length: 10 }, (_, i) => currentYear + 5 - i);

  const handleSignIn = () => {
    navigate('/login')
  }

  const validatePassword = (pwd) => {
    if (!pwd) return "Password cannot be empty.";
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    if (!/\d/.test(pwd)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pwd)) return "Password must contain at least one special character.";
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (!/^\d{10}$/.test(newPhone) && newPhone.length > 0) {
      setPhoneError("Phone number must be 10 digits.");
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);

    let isValid = true;
    if (validatePassword(password)) {
      setPasswordError(validatePassword(password));
      isValid = false;
    } else setPasswordError('');

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else setConfirmPasswordError('');

    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits.");
      isValid = false;
    } else setPhoneError('');

    if (!agreedToTerms) {
      setTermsError("You must agree to the Terms & Conditions.");
      isValid = false;
    } else setTermsError('');

    if (!name || !gender || !email || !education || !college || !branch || !passingYear || !phone || !password || !confirmPassword || !regNo) {
      setSignupError('Please fill out all required fields.');
      isValid = false;
    }

    if (isValid) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/signup`,
          {
            name, gender, email, password, phone,
            education, college, branch,
            passingYear: parseInt(passingYear),
            regNo,
            cgpa: parseFloat(cgpa),
            currentSemester: parseInt(currentSemester),
            historyOfArrear,
            currentBacklog: parseInt(currentBacklog)
          },
          config
        );
        alert(`Account created for ${data.name}!`);
        navigate('/login');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setSignupError(errorMessage);
        alert(`Signup failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please correct the form errors.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative">
      
      {/* FIXED LOGO AT TOP LEFT */}
      <div 
        className="absolute top-6 left-6 md:top-8 md:left-10 z-50 flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="CampSync.AI" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform" />
        <div className="hidden sm:block ">
            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligent Campus Management</p>
        </div>
      </div>

      {/* LEFT SECTION: FORM */}
      <div className="flex-1 flex items-start justify-center px-6 py-24 lg:py-25 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join our community and start your professional journey.</p>
          </div>

          {signupError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              {signupError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION: BASIC INFO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text" required disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                    placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Gender</label>
                <div className="flex gap-4 p-1 bg-slate-50 border border-slate-200 rounded-2xl h-[54px] items-center px-4">
                  <label className="flex-1 inline-flex items-center justify-center cursor-pointer py-2 rounded-xl transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-indigo-600">
                    <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className="hidden" required disabled={isLoading} />
                    <span className="text-sm font-bold">Male</span>
                  </label>
                  <label className="flex-1 inline-flex items-center justify-center cursor-pointer py-2 rounded-xl transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-indigo-600">
                    <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className="hidden" required disabled={isLoading} />
                    <span className="text-sm font-bold">Female</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email" required disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                    placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel" required maxLength="10" disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${phoneError ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all`}
                    value={phone} onChange={handlePhoneChange}
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{phoneError}</p>}
              </div>
            </div>

            {/* --- SECTION: PASSWORDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} required disabled={isLoading}
                    className={`w-full px-4 py-3.5 bg-slate-50 border ${passwordError ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all pr-12`}
                    value={password} onChange={handlePasswordChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-[10px] leading-tight font-bold text-red-500 ml-1">{passwordError}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} required disabled={isLoading}
                    className={`w-full px-4 py-3.5 bg-slate-50 border ${confirmPasswordError ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all pr-12`}
                    value={confirmPassword} onChange={handleConfirmPasswordChange}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPasswordError && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{confirmPasswordError}</p>}
              </div>
            </div>

            {/* --- SECTION: ACADEMICS --- */}
            <div className="pt-4 border-t border-slate-100">
               <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Academic Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Register Number</label>
                    <div className="relative">
                      <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        name="regNo" placeholder="Register Number" value={regNo} onChange={(e) => setRegNo(e.target.value)} 
                        required disabled={isLoading} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">College</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text" required disabled={isLoading} value={college} onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      />
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Education</label>
                  <select required disabled={isLoading} value={education} onChange={(e) => setEducation(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="" disabled>Select</option>
                    {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Branch</label>
                  <select required disabled={isLoading} value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="" disabled>Select</option>
                    {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Passing Year</label>
                  <select required disabled={isLoading} value={passingYear} onChange={(e) => setPassingYear(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="" disabled>Select</option>
                    {passingYearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Semester</label>
                  <input type="number" value={currentSemester} onChange={(e) => setCurrentSemester(e.target.value)} disabled={isLoading} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Current CGPA</label>
                  <input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} disabled={isLoading} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Backlogs</label>
                  <input type="number" value={currentBacklog} onChange={(e) => setCurrentBacklog(e.target.value)} disabled={isLoading} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">History of Arrear</label>
               <select value={historyOfArrear} onChange={(e) => setHistoryOfArrear(e.target.value)} disabled={isLoading} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                  <option value="No">No History of Arrears</option>
                  <option value="Yes">Has History of Arrears</option>
               </select>
            </div>

            {/* --- TERMS AND SUBMIT --- */}
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <input
                  type="checkbox" checked={agreedToTerms}
                  onChange={(e) => { setAgreedToTerms(e.target.checked); setTermsError(''); }}
                  className="h-5 w-5 text-indigo-600 border-slate-300 rounded-lg cursor-pointer transition-all"
                  required disabled={isLoading}
                />
                <label className="text-sm text-slate-700 font-medium leading-tight">
                  I agree to the <a href="#" className="text-indigo-600 font-bold hover:underline">Terms & Conditions</a> and data privacy policy.
                </label>
              </div>
              {termsError && <p className="mb-4 text-xs font-bold text-red-600 ml-1">{termsError}</p>}

              <button
                type="submit" disabled={isLoading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3
                  ${isLoading ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}
                `}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={20} /></>
                )}
              </button>
            </div>

            <p className="text-center text-slate-600 font-medium">
              Already have an account?{' '}
              <button type="button" onClick={handleSignIn} className="text-indigo-600 font-bold hover:underline cursor-pointer" disabled={isLoading}>
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING */}
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 w-full max-w-xl text-center">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Crack Your Dream Placement</h2>
          <p className="text-slate-400 text-lg mb-12 font-medium">Join 5,000+ students already using AI to prep.</p>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
            <CompanyScroller direction="ltr" speed="medium" theme="dark" />
            {/* <CompanyScroller direction="rtl" speed="medium" theme="dark" /> */}
          </div>

          <div className="mt-12 p-8 bg-indigo-600 rounded-[2rem] text-white text-center shadow-2xl shadow-indigo-900/20">
            <h3 className="text-2xl font-bold mb-2">Ready to Boost Your Career?</h3>
            <p className="text-indigo-100 text-sm mb-6 opacity-80">- Then Login with Us!</p>
            <Link to="/login" className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-black px-10 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;