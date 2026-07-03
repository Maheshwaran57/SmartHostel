import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { StatsCard } from '../../components/common/StatsCard';
import { Card } from '../../components/common/Card';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getStaffDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={2} />;
  if (!data) return <p>No data available</p>;

  const { assignedComplaints, completedCount, pendingCount } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-lg shadow-slate-200/20 dark:shadow-none p-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Staff Dashboard</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Professional view for managing your assigned complaints and tracking team progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <StatsCard title="Assigned Tasks" value={pendingCount} icon={HiOutlineExclamationCircle} color="warning" />
        <StatsCard title="Tasks Completed" value={completedCount} icon={HiOutlineCheckCircle} color="success" />
      </div>

      <Card title="Pending Assigned Tasks" className="rounded-[2rem] border border-surface-200 dark:border-surface-700">
        <div className="space-y-4">
          {assignedComplaints.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No pending tasks. Great job!</p>
          ) : (
            assignedComplaints.map((c) => (
              <div key={c._id} className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 pb-3 last:border-0 last:pb-0">
                <div>
                  <Link to={`/staff/complaints`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-amber-600">
                    {c.title}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Category: {c.category} | Priority: {c.priority}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StaffDashboard;