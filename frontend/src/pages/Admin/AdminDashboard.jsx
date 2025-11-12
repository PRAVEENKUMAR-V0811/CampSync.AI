// src/pages/admin/AdminDashboard.js
import React from 'react';
import AdminLayout from './AdminLayout'; // Adjust path as needed

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard Overview</h2>
        <p className="text-gray-600">
          Welcome to the admin panel. Use the sidebar to navigate through pending approvals, approved papers, and user management.
        </p>
        {/* Add more dashboard widgets/summaries here */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-800">Total Users</h3>
            <p className="text-3xl font-bold text-blue-900">5,432</p> {/* Replace with dynamic data */}
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-yellow-800">Pending Papers</h3>
            <p className="text-3xl font-bold text-yellow-900">15</p> {/* Replace with dynamic data */}
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-800">Approved Papers</h3>
            <p className="text-3xl font-bold text-green-900">1,200</p> {/* Replace with dynamic data */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;