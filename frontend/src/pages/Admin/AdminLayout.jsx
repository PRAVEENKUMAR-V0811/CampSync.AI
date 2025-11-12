// src/components/AdminLayout.js
import React, { useContext } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext'; // Adjust path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboardList, faCheckCircle, faUsers, faSignOutAlt, faUpload } from '@fortawesome/free-solid-svg-icons';

const AdminLayout = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // If not logged in or not an admin, redirect
  if (!user || user.role !== 'admin') {
    navigate('/login', { replace: true });
    return null; // Don't render anything
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-center text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" /> Dashboard
          </Link>
          <Link to="/admin/pending-approvals" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faClipboardList} className="mr-3" /> Pending Approvals
          </Link>
          <Link to="/admin/approved-papers" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-3" /> Approved Papers
          </Link>
          <Link to="/admin/users" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faUsers} className="mr-3" /> Manage Users
          </Link>
          {/* Add more admin specific links as needed */}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, {user.name} (Admin)</h1>
          {/* You can add more header elements here, like notifications */}
        </header>
        <main className="flex-1 p-6 bg-gray-100">
          {children || <Outlet />} {/* Render children or Outlet for nested routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;