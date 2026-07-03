import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { StatsCard } from '../../components/common/StatsCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OccupancyChart } from '../../components/charts/OccupancyChart';
import { ComplaintCategoryChart } from '../../components/charts/ComplaintCategoryChart';
import { MonthlyTrendChart } from '../../components/charts/MonthlyTrendChart';
import { RoomUtilizationChart } from '../../components/charts/RoomUtilizationChart';
import {
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getAdminDashboard();
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

  if (loading) return <LoadingSkeleton variant="card" count={3} />;
  if (!data) return <p>No data available</p>;

  const { stats, occupancyData, complaintCategoryData, monthlyComplaintTrend, roomUtilization } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 border border-surface-200 dark:border-surface-700 shadow-lg shadow-amber-200/30 dark:shadow-none p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">A polished fall-style overview of occupancy, complaints, and room allocations.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-surface-900/80 px-4 py-3 border border-surface-200 dark:border-surface-700 shadow-sm">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Today</span>
            <span className="text-base font-semibold text-slate-800 dark:text-white">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Row of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value={stats.totalStudents} icon={HiOutlineUserGroup} color="primary" />
        <StatsCard title="Total Rooms" value={stats.totalRooms} icon={HiOutlineOfficeBuilding} color="primary" />
        <StatsCard title="Pending Complaints" value={stats.pendingComplaints} icon={HiOutlineExclamationCircle} color="warning" />
        <StatsCard title="Resolved Complaints" value={stats.resolvedComplaints} icon={HiOutlineCheckCircle} color="success" />
      </div>

      {/* Room breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        <div className="bg-surface-50 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Available Rooms</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-3">{stats.availableRooms}</p>
        </div>
        <div className="bg-surface-50 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Partially Occupied</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-300 mt-3">{stats.partialRooms}</p>
        </div>
        <div className="bg-surface-50 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Full Rooms</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-300 mt-3">{stats.occupiedRooms}</p>
        </div>
        <div className="bg-surface-50 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Maintenance</p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-3">{stats.maintenanceRooms}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card" title="Occupancy Per Block">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Occupancy per Block</h4>
          <OccupancyChart data={occupancyData} />
        </div>
        <div className="card" title="Complaint Categories">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Complaint Categories</h4>
          <ComplaintCategoryChart data={complaintCategoryData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Monthly Complaint Trend</h4>
          <MonthlyTrendChart data={monthlyComplaintTrend} />
        </div>
        <div className="card">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Room Status Breakdown</h4>
          <RoomUtilizationChart data={roomUtilization} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;