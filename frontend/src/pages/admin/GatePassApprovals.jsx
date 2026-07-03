import React, { useEffect, useState } from 'react';
import { gatePassService } from '../../services/gatePassService';
import { Card } from '../../components/common/Card';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

export const GatePassApprovals = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const res = await gatePassService.getGatePasses();
      if (res.data.success) {
        setPasses(res.data.gatePasses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this gate pass request?')) return;
    try {
      const res = await gatePassService.updateGatePassStatus(id, 'approved');
      if (res.data.success) {
        toast.success('Gate pass request approved!');
        fetchPasses();
      }
    } catch (err) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) return toast.error('Please specify a rejection reason');
    setActionLoading(true);
    try {
      const res = await gatePassService.updateGatePassStatus(selectedPass._id, 'rejected', rejectionReason);
      if (res.data.success) {
        toast.success('Gate pass request rejected');
        setRejectOpen(false);
        setRejectionReason('');
        fetchPasses();
      }
    } catch (err) {
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'student', label: 'Student', render: (row) => <span>{row.student?.name} ({row.student?.department})</span> },
    { key: 'departureDate', label: 'Departure', render: (row) => new Date(row.departureDate).toLocaleDateString() },
    { key: 'arrivalDate', label: 'Return Date', render: (row) => new Date(row.arrivalDate).toLocaleDateString() },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        row.status === 'pending' ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleApprove(row._id)}>Approve</Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setSelectedPass(row);
                setRejectOpen(true);
              }}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">Approved by {row.approvedBy?.name || 'Warden'}</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gate Pass Approvals</h2>
        <p className="text-sm text-gray-500 mt-1">Review student home-visit requests and authorize gate passes.</p>
      </div>

      <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
        <DataTable columns={columns} data={passes} loading={loading} />
      </Card>

      <Modal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Gate Pass">
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            placeholder="Explain why this request is rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRejectSubmit} loading={actionLoading}>Reject Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GatePassApprovals;