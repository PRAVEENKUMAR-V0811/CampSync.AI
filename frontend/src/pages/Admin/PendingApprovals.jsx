// src/pages/admin/PendingApprovals.js
import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout'; // Adjust path
import AuthContext from '../Auth/AuthContext'; // Adjust path
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckCircle, faTimesCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../api';

const PendingApprovals = () => {
  const [pendingPapers, setPendingPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token && user.role === 'admin') {
      fetchPendingPapers();
    } else if (user && user.role !== 'admin') {
      setError('You do not have permission to view this page.');
      setLoading(false);
    } else {
      setError('Please log in as an administrator.');
      setLoading(false);
    }
  }, [user]);

  const fetchPendingPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${API_BASE_URL}/api/question-papers/admin/pending`, config);
      setPendingPapers(response.data);
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to fetch pending papers. Make sure backend is running and you are logged in as admin.';
      setError(errorMessage);
      console.error('Error fetching pending papers:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paperId) => {
    if (!window.confirm('Are you sure you want to APPROVE this paper?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`${API_BASE_URL}/api/question-papers/admin/${paperId}/approve`, {}, config);
      alert('Paper approved successfully!');
      fetchPendingPapers();
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to approve paper.';
      alert(errorMessage);
      console.error('Error approving paper:', err.response || err);
    }
  };

  const handleReject = async (paperId) => {
    const reason = prompt('Please enter a rejection reason (required):');
    if (!reason) {
      alert('Rejection cancelled. Reason is required.');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };
      await axios.put(`${API_BASE_URL}/api/question-papers/admin/${paperId}/reject`, { reason }, config);
      alert('Paper rejected successfully!');
      fetchPendingPapers();
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to reject paper.';
      alert(errorMessage);
      console.error('Error rejecting paper:', err.response || err);
    }
  };

  if (loading) return <AdminLayout><div className="text-center py-8">Loading pending papers...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="text-center py-8 text-red-600">{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Question Papers</h1>
      {pendingPapers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No pending papers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPapers.map((paper) => (
            <div key={paper._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">{paper.title}</h3>
              <p className="text-sm text-gray-600"><strong>Subject:</strong> {paper.subject}</p>
              <p className="text-sm text-gray-600"><strong>Exam:</strong> {paper.exam_name} ({paper.year})</p>
              <p className="text-sm text-gray-600">
                <strong>Uploaded by:</strong> {paper.uploaded_by_user ? `${paper.uploaded_by_user.name} (${paper.uploaded_by_user.email})` : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Upload Date:</strong> {new Date(paper.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> View Paper
                </a>
                <button
                  onClick={() => handleApprove(paper._id)}
                  className="inline-flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Approve
                </button>
                <button
                  onClick={() => handleReject(paper._id)}
                  className="inline-flex justify-center items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default PendingApprovals;