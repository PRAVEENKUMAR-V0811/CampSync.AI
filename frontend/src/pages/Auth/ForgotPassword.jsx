// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import logo from "../../assets/logofinal.png"; 
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/forgotpassword`,
        { email },
        config
      );
      setMessage(data.message);
      setEmail(''); // Clear email field
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

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
            <KeyRound size={32} />
          </div>
          <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
            Forgot Your Password?
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500 font-medium leading-relaxed">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-r-xl font-bold text-sm animate-in fade-in slide-in-from-top-2" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl font-bold text-sm animate-in fade-in slide-in-from-top-2" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email-address" className="block text-sm font-bold text-slate-700 ml-1 mb-1">
              Email address
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                </div>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
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
              ) : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Remember your password? Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;