// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import logo from "../../assets/logofinal.png"; 
import { Lock, Eye, EyeOff, RefreshCcw, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // UI states for visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetToken } = useParams(); // Get token from URL
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    let isValid = true;
    const pwdValidation = validatePassword(password);
    if (pwdValidation) {
      setPasswordError(pwdValidation);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/resetpassword/${resetToken}`,
        { password },
        config
      );
      setMessage(data.message);
      // Optional: Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

      {/* FIXED LOGO AT TOP LEFT */}
      <div 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="CampSync.AI" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform" />
        <div className="hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligent Campus</p>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 relative z-10 border border-slate-100">
        <div>
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RefreshCcw size={32} />
          </div>
          <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500 font-medium">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-r-xl font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2" role="alert">
              <CheckCircle size={18} />
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl font-bold text-sm animate-in fade-in slide-in-from-top-2" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className={`block w-full pl-12 pr-12 py-4 bg-slate-50 border ${passwordError ? 'border-red-500' : 'border-slate-200'} text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium`}
                  placeholder="New Password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1 leading-tight">{passwordError}</p>}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700 ml-1 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  required
                  className={`block w-full pl-12 pr-12 py-4 bg-slate-50 border ${confirmPasswordError ? 'border-red-500' : 'border-slate-200'} text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium`}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPasswordError && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1 leading-tight">{confirmPasswordError}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-2xl text-white shadow-xl shadow-indigo-100 transition-all active:scale-95
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}
              `}
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Reset Password'}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-2">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                Back to Sign In
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;