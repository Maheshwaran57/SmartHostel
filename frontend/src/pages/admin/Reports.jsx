import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const Reports = () => {
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSkeleton variant="card" count={2} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and print hostel activity reports.</p>
        </div>
        <Button onClick={handlePrint}>Print Report PDF</Button>
      </div>

      <Card className="print:border-0 print:shadow-none space-y-6">
        <div className="text-center pb-6 border-b">
            <h1 className="text-2xl font-bold">BACKPACKERS ACTIVITY REPORT</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Rooms</p>
            <p className="text-xl font-bold mt-1">{data?.stats?.totalRooms}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Students</p>
            <p className="text-xl font-bold mt-1">{data?.stats?.totalStudents}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Complaints</p>
            <p className="text-xl font-bold mt-1 text-amber-600">{data?.stats?.pendingComplaints}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Resolved Complaints</p>
            <p className="text-xl font-bold mt-1 text-emerald-600">{data?.stats?.resolvedComplaints}</p>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-bold uppercase mb-3">Occupancy Summary By Block</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-surface-50 dark:bg-surface-900/50">
                <th className="px-4 py-2 text-xs font-semibold uppercase">Block</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase">Occupied Slots</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase">Total Capacity</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase">Utilization Rate</th>
              </tr>
            </thead>
            <tbody>
              {data?.occupancyData?.map((occ) => {
                const utilRate = ((occ.occupied / occ.capacity) * 100).toFixed(1);
                return (
                  <tr key={occ.block} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">{occ.block}</td>
                    <td className="px-4 py-3 text-sm">{occ.occupied}</td>
                    <td className="px-4 py-3 text-sm">{occ.capacity}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary-600">{utilRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;