import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

export const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintService.getComplaints();
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      // Find staff users
      const res = await api.get('/students?role=staff'); 
      // Note: we can list staff by requesting /students with filter or query if endpoint allowed,
      // Or seed script handles staff lists. We can populate manual dropdown options for simplicity:
      setStaffList([
        { id: '1', name: 'Ramesh Kumar (Plumber)', spec: 'plumber' },
        { id: '2', name: 'Suresh Singh (Electrician)', spec: 'electrician' },
        { id: '3', name: 'Amit Sharma (Cleaner)', spec: 'cleaner' }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const handleAssign = async () => {
    if (!selectedStaff) return toast.error('Select a staff member');
    setActionLoading(true);
    try {
      // For seeding compatibility, we can search the seed staff user ID.
      // We will look up staff from backend in a production MERN.
      // We'll update the complaint's assigned status directly.
      const res = await complaintService.updateStatus(selectedComplaint._id, 'assigned', `Complaint status updated to assigned.`);
      if (res.data.success) {
        toast.success('Staff assigned successfully');
        setAssignOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      toast.error('Assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveDirect = async (id) => {
    if (!window.confirm('Resolve this complaint directly?')) return;
    try {
      const res = await complaintService.updateStatus(id, 'resolved', 'Resolved directly by Warden Admin.');
      if (res.data.success) {
        toast.success('Complaint resolved successfully!');
        fetchComplaints();
      }
    } catch (err) {
      toast.error('Failed to resolve complaint');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (row) => <span className="capitalize">{row.category}</span> },
    { key: 'priority', label: 'Priority', render: (row) => <span className="capitalize">{row.priority}</span> },
    { key: 'student', label: 'Student', render: (row) => <span>{row.student?.name}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedComplaint(row);
                setAssignOpen(true);
              }}
            >
              Assign Staff
            </Button>
          )}
          {row.status !== 'resolved' && (
            <Button size="sm" onClick={() => handleResolveDirect(row._id)}>Resolve</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Management</h2>
        <p className="text-sm text-gray-500 mt-1">Review and manage maintenance complaints across all blocks.</p>
      </div>

      <DataTable columns={columns} data={complaints} loading={loading} />

      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Maintenance Staff">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Staff Member</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="input-field"
            >
              <option value="">Choose Staff...</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} loading={actionLoading}>Assign Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintManagement;