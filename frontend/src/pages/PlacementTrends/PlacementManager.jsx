import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../api';
import { Plus } from 'lucide-react';

const PlacementManager = ({ getAuthConfig, refreshStats }) => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    department: 'CSE',
    year: 2025,
    status: 'Unplaced',
    company: 'Not Applicable',
    lpa: 0,
    stipend: 0,
    offers: 0
  });

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/placements/my-students`,
        getAuthConfig()
      );
      setStudents(data);
    } catch {
      toast.error('Failed to load students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/placements/update/${editingId}`,
          formData,
          getAuthConfig()
        );
        toast.success('Updated Student');
      } else {
        await axios.post(
          `${API_BASE_URL}/api/placements/add`,
          formData,
          getAuthConfig()
        );
        toast.success('Added Student');
      }

      setShowModal(false);
      setEditingId(null);
      fetchStudents();
      refreshStats();
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/placements/delete/${id}`,
        getAuthConfig()
      );
      fetchStudents();
      refreshStats();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Student Placement Records</h3>

        <button
          onClick={() => {
            setFormData({
              studentName: '',
              rollNumber: '',
              department: 'CSE',
              year: 2025,
              status: 'Unplaced',
              company: 'Not Applicable',
              lpa: 0,
              stipend: 0,
              offers: 0
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Student
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">LPA</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="font-bold">{s.studentName}</div>
                <div className="text-xs text-gray-500">
                  {s.rollNumber} | {s.department}
                </div>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    s.status === 'Placed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.status}
                </span>
              </td>

              <td className="p-3">{s.company}</td>
              <td className="p-3">₹{s.lpa}</td>

              <td className="p-3 flex gap-3">
                <button
                  onClick={() => {
                    setEditingId(s._id);
                    setFormData(s);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-2xl"
          >
            <h2 className="text-xl font-bold">
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h2>

            <input
              className="w-full p-2 border rounded"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) =>
                setFormData({ ...formData, studentName: e.target.value })
              }
              required
            />

            <input
              className="w-full p-2 border rounded"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={(e) =>
                setFormData({ ...formData, rollNumber: e.target.value })
              }
              required
            />

            <select
              className="w-full p-2 border rounded"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              {['CSE','CSE AIML','CSE IoT','CSE Cyber Security','AIDS','IT','EEE','ECE','CIVIL','MECHANICAL']
                .map(d => <option key={d}>{d}</option>)}
            </select>

            <select
              className="w-full p-2 border rounded"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Unplaced">Unplaced</option>
              <option value="Placed">Placed</option>
            </select>

            {formData.status === 'Placed' && (
              <>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="p-2 border rounded"
                    placeholder="LPA"
                    value={formData.lpa}
                    onChange={(e) =>
                      setFormData({ ...formData, lpa: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Offers"
                    value={formData.offers}
                    onChange={(e) =>
                      setFormData({ ...formData, offers: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlacementManager;
