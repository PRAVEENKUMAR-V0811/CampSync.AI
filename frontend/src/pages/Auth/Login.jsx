// src/components/modules/auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from './AuthContext';
import CompanyScroller from '../CompanyScroller';
import { API_BASE_URL } from '../../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [attemptingAdminLogin, setAttemptingAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignUp = () => {
  navigate('/signup')
}

  const validatePassword = (pwd) => {
    if (!pwd) { setPasswordError("Password cannot be empty."); return false; }
    if (pwd.length < 8) { setPasswordError("Password must be at least 8 characters long."); return false; }
    if (!/[A-Z]/.test(pwd)) { setPasswordError("Password must contain at least one uppercase letter."); return false; }
    if (!/[a-z]/.test(pwd)) { setPasswordError("Password must contain at least one lowercase letter."); return false; }
    if (!/\d/.test(pwd)) { setPasswordError("Password must contain at least one number."); return false; }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) {
      setPasswordError("Password must contain at least one special character."); return false;
    }
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

    const isPasswordValid = validatePassword(password);
    if (email && isPasswordValid) {
      setIsLoading(true);
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          { email, password },
          config
        );

        login(data);
        toast.success(`Welcome back, ${data.name || data.email}!`);

        setTimeout(() => {
          if (data.role === 'admin') navigate('/admin');
          else if (attemptingAdminLogin) setLoginError('You are not authorized as an administrator.');
          else navigate('/dashboard');
        }, 500);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setLoginError(errorMessage);
        toast.error(`Login failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLoginError('Please correct the form errors.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            {attemptingAdminLogin ? 'Admin Login' : 'Log In'}
          </h2>

          {loginError && <p className="mt-2 text-sm text-red-600 text-center">{loginError}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-300"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className={`block w-full px-4 py-3 border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-300`}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-lg font-semibold text-white cursor-pointer
                       ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       transition duration-300 transform hover:scale-105`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              attemptingAdminLogin ? 'Login as Admin' : 'Login'
            )}
          </button>

          <div className="text-center text-sm">
            <a href="/forgotpassword" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Forgot Password?
            </a>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            New User?{' '}
            <button
              type="button"
              onClick={handleSignUp}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>

          {!attemptingAdminLogin ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Are you an administrator?{' '}
                <button
                  type="button"
                  onClick={() => setAttemptingAdminLogin(true)}
                  className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
                  disabled={isLoading}
                >
                  Click here to login as Admin
                </button>
              </p>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setAttemptingAdminLogin(false);
                  setLoginError('');
                  setEmail('');
                  setPassword('');
                }}
                className="font-medium text-gray-600 hover:text-gray-500 cursor-pointer"
                disabled={isLoading}
              >
                Return to User Login
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-gray-900 text-white overflow-hidden">
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Companies</h2>
          <p className="text-xl text-gray-300 mt-4 mb-8">
            Want to know the secret behind cracking the below company exams?
          </p>
          <CompanyScroller direction="ltr" speed="medium" theme="dark" />
        </div>

        <section id="signup" className="py-20 bg-indigo-700 text-white text-center mt-12">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Career?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Join thousands of students and alumni who are leveraging CampSync.AI to achieve their placement and academic goals.
            </p>
            <Link
              to="/signup"
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-5 rounded-full shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
            >
              Sign Up for Free
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
