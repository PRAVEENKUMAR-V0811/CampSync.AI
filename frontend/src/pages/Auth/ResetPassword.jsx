// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        `http://localhost:5000/api/auth/resetpassword/${resetToken}`,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                type="password"
                id="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
              />
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </div>
            {/* Confirm New Password */}
            <div className="mt-2">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={loading}
              />
              {confirmPasswordError && <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;