// src/components/modules/auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from './AuthContext';
import CompanyScroller from '../CompanyScroller';
import { API_BASE_URL } from '../../api';
import logo from "../../assets/logofinal.png"; 
import { Eye, EyeOff, ArrowLeft, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [attemptingAdminLogin, setAttemptingAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validatePassword = (pwd) => {
    if (!pwd) { setPasswordError("Password is required"); return false; }
    if (pwd.length < 8) { setPasswordError("Minimum 8 characters"); return false; }
    // if (!/[A-Z]/.test(pwd)) { setPasswordError("Need one uppercase letter"); return false; }
    if (!/\d/.test(pwd)) { setPasswordError("Need one number"); return false; }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) validatePassword(newPassword);
    else setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (email && validatePassword(password)) {
      setIsLoading(true);
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          { email, password },
          config
        );

        login(data);
        toast.success(`Welcome back!`);

        setTimeout(() => {
          if (data.role === 'admin') navigate('/admin');
          else if (data.role === 'faculty') navigate('/faculty');
          else navigate('/dashboard'); // Student dashboard
        }, 500);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Invalid credentials";
        setLoginError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative">
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      {/* FIXED LOGO AT TOP LEFT */}
      <div 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="CampSync.AI" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform" />
        <div className="hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligent Campus Management</p>
        </div>
      </div>

      {/* LEFT SECTION: LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center px-8 py-20 lg:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {attemptingAdminLogin ? 'Faculty Portal' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              {attemptingAdminLogin 
                ? 'Authorized access only. Enter your credentials.' 
                : 'Sign in to continue your career journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all duration-200 font-medium"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgotpassword" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-4 py-4 bg-slate-50 border ${passwordError ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all duration-200 font-medium pr-12`}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">{passwordError}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3
                ${isLoading ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}
              `}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {attemptingAdminLogin ? <ShieldCheck size={22} /> : null}
                  {attemptingAdminLogin ? 'Secure Faculty Login' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-slate-600 font-medium">
              New to CampSync?{' '}
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
            </p>

            <div className="pt-6 border-t border-slate-100">
              {!attemptingAdminLogin ? (
                <button
                  onClick={() => setAttemptingAdminLogin(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  Login as Faculty
                </button>
              ) : (
                <button
                  onClick={() => setAttemptingAdminLogin(false)}
                  className="inline-flex items-center gap-2 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back to Student Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: MARKETING/VISUAL */}
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-slate-950 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h2 className="text-3xl font-black text-white mb-2">Crack Your Dream Placement</h2>
          <p className="text-slate-400 text-lg mb-12 font-medium">
            Join 5,000+ students already using AI to prep for top tech giants.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <CompanyScroller direction="ltr" speed="medium" theme="dark" />
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl text-left border border-white/5">
                    <p className="text-indigo-400 font-black text-2xl">95%</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Success Rate</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl text-left border border-white/5">
                    <p className="text-emerald-400 font-black text-2xl">12k+</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Mock Interviews</p>
                </div>
            </div>
          </div>

          <div className="mt-12">
              <Link to="/signup" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                To Explore ! Create an Account • Signup
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;