import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const PlacementManager = ({ getAuthConfig, refreshStats }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    studentName: '', rollNumber: '', department: 'CSE', year: 2025,
    status: 'Unplaced', company: 'Not Applicable', lpa: 0, stipend: 0, offers: 1
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/placements/my-students`, getAuthConfig());
      setStudents(data);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editingId ? "Updating..." : "Adding...");
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/placements/update/${editingId}`, formData, getAuthConfig());
      } else {
        await axios.post(`${API_BASE_URL}/api/placements/add`, formData, getAuthConfig());
      }
      toast.success(editingId ? 'Updated' : 'Added', { id: tid });
      setShowModal(false);
      setEditingId(null);
      fetchStudents();
      refreshStats();
    } catch (err) { 
      toast.error(err.response?.data?.error || 'Action failed', { id: tid }); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/placements/delete/${id}`, getAuthConfig());
      toast.success('Deleted');
      fetchStudents();
      refreshStats();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading records...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
        <h3 className="text-xl font-bold text-gray-800">Student Placement Records</h3>
        <button onClick={() => { setFormData(initialForm); setEditingId(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Dept</th>
              <th className="p-4">Status</th>
              <th className="p-4">Compensation</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{s.studentName}</div>
                  <div className="text-xs text-gray-500">{s.rollNumber}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{s.department}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    s.status === 'Placed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {s.status}
                  </span>
                  {s.status === 'Placed' && <div className="text-xs mt-1 text-gray-500 font-medium">{s.company}</div>}
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-green-600">₹{s.lpa} LPA</div>
                  <div className="text-[10px] text-gray-400">Stipend: ₹{s.stipend}</div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingId(s._id); setFormData(s); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={16}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Update Record' : 'New Placement'}</h2>
              <button type="button" onClick={() => setShowModal(false)}><X className="text-gray-400" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Student Name</label>
                <input className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Roll Number</label>
                <input className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 21CS001" value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Department</label>
                <select className="w-full p-3 border rounded-xl bg-gray-50" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                  {['CSE','CSE AIML','CSE IoT','CSE Cyber Security','AIDS','IT','EEE','ECE','CIVIL','MECHANICAL'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Placement Status</label>
                <select className="w-full p-3 border rounded-xl bg-gray-50" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Unplaced">Unplaced</option>
                  <option value="Placed">Placed</option>
                </select>
              </div>

              {formData.status === 'Placed' && (
                <>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Company Name</label>
                    <input className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">CTC (LPA)</label>
                    <input type="number" step="0.1" className="w-full p-3 border rounded-xl bg-gray-50" value={formData.lpa} onChange={(e) => setFormData({ ...formData, lpa: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Offers</label>
                    <input type="number" className="w-full p-3 border rounded-xl bg-gray-50" value={formData.offers} onChange={(e) => setFormData({ ...formData, offers: e.target.value })} />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">Save Record</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlacementManager;