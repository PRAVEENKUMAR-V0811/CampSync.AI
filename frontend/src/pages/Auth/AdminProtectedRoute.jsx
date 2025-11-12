// src/components/AdminProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext'; // Adjust path as needed

const AdminProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext); // Assuming AuthContext provides user and loading state

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  // If user is not logged in OR not an admin, redirect to login
  if (!user || user.role !== 'admin') {
    // You might want to show a 403 Forbidden page or redirect with a message
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render the child routes if authenticated and admin
};

export default AdminProtectedRoute;