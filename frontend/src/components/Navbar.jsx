// src/components/Navbar.js (Example)
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">EduShare</Link>
        <div className="space-x-4">
          <Link to="/question-bank" className="hover:text-gray-300">Question Bank</Link> {/* New link */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:text-gray-300">Admin Panel</Link>
              )}
              <Link to="/upload-paper" className="hover:text-gray-300">Upload Paper</Link>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;