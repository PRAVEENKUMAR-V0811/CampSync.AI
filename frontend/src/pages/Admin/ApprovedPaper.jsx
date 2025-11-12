// src/pages/admin/ApprovedPapers.js
import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout'; // Adjust path based on your project structure
import AuthContext from '../Auth/AuthContext'; // Adjust path based on your project structure
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faCheckCircle, faTimesCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const ApprovedPapers = () => {
  const [papers, setPapers] = useState([]); // Renamed from approvedPapers for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token && user.role === 'admin') {
      fetchAllAdminPapers();
    } else if (user && user.role !== 'admin') {
      setError('You do not have permission to view this page.');
      setLoading(false);
    } else {
      setError('Please log in as an administrator.');
      setLoading(false);
    }
  }, [user]);

  const fetchAllAdminPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Fetches all papers for admin, including rejected/inactive
      const response = await axios.get('http://localhost:5000/api/admin/question-papers/admin/all', config);
      // Filter for approved papers
      setPapers(response.data.filter(paper => paper.status === 'approved'));
    } catch (err) {
      setError('Failed to fetch approved papers for admin. Make sure the backend server is running and the endpoint is correct.');
      console.error('Error fetching approved papers for admin:', err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/admin/question-papers/${paperId}`, config);
      alert('Paper deleted successfully!');
      fetchAllAdminPapers(); // Refresh the list
    } catch (err) {
      setError('Failed to delete paper.');
      console.error('Error deleting paper:', err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Approved Question Papers</h2>
          <div className="text-center py-8">Loading approved papers...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Approved Question Papers</h2>
          <div className="text-center py-8 text-red-600">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Approved Question Papers</h2>

        {papers.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No approved question papers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded On
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {papers.map((paper) => (
                  <tr key={paper._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{paper.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{paper.uploaderName || 'N/A'}</div> {/* Assuming uploaderName is available */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(new Date(paper.uploadedAt), 'dd MMM yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-900 mr-3" title="View Paper">
                        <FontAwesomeIcon icon={faFilePdf} size="lg" />
                      </a>
                      <button
                        onClick={() => handleDelete(paper._id)}
                        className="text-red-600 hover:text-red-900" title="Delete Paper"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApprovedPapers;