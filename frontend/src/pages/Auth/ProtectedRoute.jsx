// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//   const userInfo = localStorage.getItem('userInfo'); // Get user info from localStorage

//   return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => { // Accept allowedRoles prop
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowedRoles array (if provided)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but unauthorized role
    // You can redirect to a different page, e.g., homepage, or an unauthorized page
    return <Navigate to="/dashboard" replace />; // Redirect to user dashboard
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;