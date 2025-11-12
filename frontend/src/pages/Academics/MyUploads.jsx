// src/pages/User/MyUploads.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthContext from '../Auth/AuthContext'; // Adjust path
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClock, faCheckCircle, faTimesCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const MyUploads = () => {
  const [myPapers, setMyPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token) {
      fetchMyUploadedPapers();
    }
  }, [user]);

  const fetchMyUploadedPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // You'll need a new backend route for this: GET /api/question-papers/my-uploads
      const response = await axios.get('http://localhost:5000/api/question-papers/my-uploads', config);
      setMyPapers(response.data);
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to fetch your uploaded papers.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching my uploads:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />;
      case 'Approved':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />;
      case 'Rejected':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your uploads...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          My Question Paper Uploads
        </h2>

        {myPapers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">You haven't uploaded any question papers yet.</p>
            <p className="mt-2 text-indigo-600 hover:underline cursor-pointer" onClick={() => window.location.href='/upload-paper'}>
                Upload your first paper!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Uploaded On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myPapers.map((paper) => (
                  <tr key={paper._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{paper.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(new Date(paper.createdAt), 'dd MMM yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        paper.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        paper.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusIcon(paper.status)} {paper.status}
                      </span>
                      {paper.status === 'Rejected' && paper.rejection_reason && (
                        <p className="text-xs text-red-600 mt-1">Reason: {paper.rejection_reason}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {paper.file_url && (
                        <a href={paper.file_url} target="_blank" rel="noopener noreferrer"
                           className="text-indigo-600 hover:text-indigo-900 mr-3" title="View Paper">
                          <FontAwesomeIcon icon={faFilePdf} size="lg" />
                        </a>
                      )}
                      {/* You could add an edit/delete option here if allowed for user's own pending papers */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUploads;