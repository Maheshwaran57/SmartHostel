import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
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
    fetchComplaints();
  }, []);

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <Link to={`/student/complaints/${row._id}`} className="hover:underline font-semibold text-primary-600">{row.title}</Link> },
    { key: 'category', label: 'Category', render: (row) => <span className="capitalize">{row.category}</span> },
    { key: 'priority', label: 'Priority', render: (row) => <span className="capitalize">{row.priority}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Filed Date', render: (row) => format(new Date(row.createdAt), 'dd MMM yyyy') }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your hostel-related issue complaints.</p>
        </div>
        <Link to="/student/complaints/new">
          <Button>File New Complaint</Button>
        </Link>
      </div>

      <DataTable columns={columns} data={complaints} loading={loading} />
    </div>
  );
};

export default ComplaintList;