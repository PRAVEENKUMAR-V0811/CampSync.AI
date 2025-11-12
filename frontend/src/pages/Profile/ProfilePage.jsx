// src/components/ProfilePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'; // Use axios for consistency
import AuthContext from '../Auth/AuthContext'; // Adjust path based on your structure
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

const ProfilePage = () => {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for AuthContext to finish loading user info
      if (authLoading) return;

      if (!user || !user.token) {
        // If no user or no token in user object, it means not logged in or token is missing
        setError('No authentication token found. Please log in.');
        setLoading(false);
        // Optionally redirect to login if not authenticated
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, // Get token from AuthContext's user object
          },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, config);
        setUserData(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
        setError(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
          // If token is invalid or expired, log out
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate, logout]); // Depend on user and authLoading state

  if (loading || authLoading) { // Show loading if AuthContext is still loading or profile data is loading
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
        <p className="font-bold">Error:</p>
        <p className="ml-2">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // If user is null but not in loading/error state (e.g., navigated away after logout), prevent rendering
  if (!user || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl w-full p-8 space-y-6">
        <div className="text-center border-b pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">User Profile</h1>
          <p className="text-lg text-gray-600">About you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Name</label>
            <p className="text-lg font-semibold text-gray-800">{userData.name}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-lg font-semibold text-gray-800">{userData.email}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Phone</label>
            <p className="text-lg font-semibold text-gray-800">{userData.phone}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Gender</label>
            <p className="text-lg font-semibold text-gray-800 capitalize">{userData.gender}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Role</label>
            <p className="text-lg font-semibold text-gray-800 capitalize">{userData.role}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Education</label>
            <p className="text-lg font-semibold text-gray-800">{userData.education}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">College</label>
            <p className="text-lg font-semibold text-gray-800">{userData.college}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Branch</label>
            <p className="text-lg font-semibold text-gray-800">{userData.branch}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Passing Year</label>
            <p className="text-lg font-semibold text-gray-800">{userData.passingYear}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-lg font-semibold text-gray-800">
              {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t text-center">
          <button
            onClick={() => alert('Edit profile functionality would go here!')}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;