import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { dashboardService } from '../../services/dashboardService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { FileUpload } from '../../components/common/FileUpload';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  
  const { register: registerStatus, handleSubmit: handleSubmitStatus, formState: { errors: errorsStatus } } = useForm();
  const { register: registerResolve, handleSubmit: handleSubmitResolve, formState: { errors: errorsResolve } } = useForm();
  const [actionLoading, setActionLoading] = useState(false);
  const [resFile, setResFile] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStaffDashboard();
      if (res.data.success) {
        setComplaints(res.data.assignedComplaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (data) => {
    setActionLoading(true);
    try {
      const res = await complaintService.updateStatus(selectedComplaint._id, data.status, data.notes);
      if (res.data.success) {
        toast.success('Status updated successfully!');
        setStatusOpen(false);
        fetchTasks();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (data) => {
    setActionLoading(true);
    const formData = new FormData();
    formData.append('resolutionNotes', data.resolutionNotes);
    if (resFile) {
      formData.append('image', resFile);
    }

    try {
      const res = await complaintService.resolveComplaint(selectedComplaint._id, formData);
      if (res.data.success) {
        toast.success('Complaint resolved successfully!');
        setResolveOpen(false);
        fetchTasks();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (row) => <span className="capitalize">{row.category}</span> },
    { key: 'priority', label: 'Priority', render: (row) => <span className="capitalize">{row.priority}</span> },
    { key: 'student', label: 'Student', render: (row) => <span>{row.student?.name} (Room: {row.student?.phone})</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedComplaint(row);
              setStatusOpen(true);
            }}
          >
            Update Status
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedComplaint(row);
              setResolveOpen(true);
            }}
          >
            Resolve
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Tasks</h2>
        <p className="text-sm text-gray-500 mt-1">Manage status or resolve issues of your assigned complaints.</p>
      </div>

      <DataTable columns={columns} data={complaints} loading={loading} />

      {/* Status Modal */}
      <Modal isOpen={statusOpen} onClose={() => setStatusOpen(false)} title="Update Status">
        <form onSubmit={handleSubmitStatus(handleUpdateStatus)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select className="input-field" {...registerStatus('status', { required: true })}>
              <option value="in-progress">In Progress</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
          <Input label="Progress Notes / Comments" placeholder="What is the progress status?" {...registerStatus('notes')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Update</Button>
          </div>
        </form>
      </Modal>

      {/* Resolve Modal */}
      <Modal isOpen={resolveOpen} onClose={() => setResolveOpen(false)} title="Resolve Complaint">
        <form onSubmit={handleSubmitResolve(handleResolve)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolution Notes</label>
            <textarea
              className="input-field min-h-[100px]"
              placeholder="Explain how the issue was fixed..."
              {...registerResolve('resolutionNotes', { required: 'Resolution notes are required' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Image</label>
            <FileUpload onFileSelect={(file) => setResFile(file)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setResolveOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Mark Completed</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignedComplaints;