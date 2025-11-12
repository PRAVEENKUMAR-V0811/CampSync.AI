// src/components/modules/auth/AuthPage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login'; // Adjust path
import Signup from './Signup'; // Adjust path
// No need for TestimonialSlider or CompanyScroller here if they are embedded within Login/Signup
// import TestimonialSlider from '../common/TestimonialSlider';
// import CompanyScroller from '../common/CompanyScroller';

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  return (
    <div className="min-h-screen flex font-sans antialiased">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700">CampSync.AI</h1>
            <p className="text-gray-600 mt-2 text-lg">Your path to success</p>
          </div>

          {isLogin ? (
            <Login onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
      {/* Right section for testimonials/companies remains within Login/Signup for now,
          or you can move it back here if you prefer a single definition. */}
    </div>
  );
};

export default AuthPage;