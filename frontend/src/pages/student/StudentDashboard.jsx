import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { attendanceService } from '../../services/attendanceService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  HiOutlineExclamationCircle,
  HiOutlineLightBulb
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getStudentDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkAttendance = async () => {
      try {
        const res = await attendanceService.getTodayAttendance();
        if (res.data.success) {
          setAttendanceMarked(res.data.marked);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
    checkAttendance();
  }, []);

  const handleMarkAttendance = async () => {
    setMarking(true);
    try {
      const res = await attendanceService.markAttendance();
      if (res.data.success) {
        toast.success('Attendance marked successfully!');
        setAttendanceMarked(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div className="p-6"><LoadingSkeleton variant="card" count={3} /></div>;
  if (!data) return <p className="p-6 text-center text-slate-500">No data available</p>;

  const { profile, roomInfo, recentComplaints, todayMenu } = data;

  return (
    <div className="space-y-8 bg-surface-50 dark:bg-surface-950 p-4 md:p-6">
      
      {/* Welcome Title and Check-in Widget */}
      <div className="rounded-[2rem] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{profile?.name ? `${profile.name.split(' ')[0]}'s Hostel Dashboard` : 'Hostel Dashboard'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{profile?.name} • Your personal hostel overview.</p>
        </div>

        {/* Attendance Widget */}
        <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-4 shadow-sm w-full lg:w-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.24em]">Attendance</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {attendanceMarked ? 'Present Today' : 'Absent / Pending'}
              </p>
            </div>
            {attendanceMarked ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                Verified
              </span>
            ) : (
              <Button
                size="sm"
                loading={marking}
                onClick={handleMarkAttendance}
                className="bg-slate-700 hover:bg-slate-800 text-white"
              >
                Mark Present
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Professional Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2rem] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <HiOutlineLightBulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.24em]">Hostel Allocation Status</span>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <div className="text-4xl font-black text-slate-900 dark:text-white">
              {roomInfo ? `${roomInfo.block}-${roomInfo.roomNumber}` : 'NA'}
            </div>
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 capitalize">
              {roomInfo ? `${roomInfo.roomType} Sharing Room` : 'No room allocated'}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <HiOutlineExclamationCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.24em]">Latest Complaint Summary</span>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Review your most recent complaint details and current status from the support desk.</p>
          <div className="mt-4 rounded-3xl border border-surface-200 dark:border-surface-700 p-4 bg-slate-50 dark:bg-surface-950">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {recentComplaints[0]?.title || 'No recent issues reported'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Status: {recentComplaints[0]?.status || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Ongoing Reservations Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white">Your Ongoing Reservations</h3>

        {roomInfo ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Room Indicator Block */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-center pr-6 md:border-r border-slate-200 dark:border-slate-700 min-w-[120px]">
                <p className="text-4xl font-black text-slate-800 dark:text-white">{roomInfo.roomNumber}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Room Number</p>
              </div>

              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  <span className="text-gray-400 font-medium">Reservation Period</span>
                  <span className="font-semibold text-slate-800 dark:text-white">: 2026 JUL 01 - 2027 JUN 30</span>
                  
                  <span className="text-gray-400 font-medium">Room Type</span>
                  <span className="font-semibold text-slate-800 dark:text-white capitalize">: {roomInfo.roomType} Sharing</span>

                  <span className="text-gray-400 font-medium">Roommates</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    : {roomInfo.occupants.length} occupants allocated
                  </span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="w-full md:w-auto flex justify-end">
              <Button variant="secondary" className="px-6 py-2.5 bg-slate-700 text-white hover:bg-slate-800 rounded-xl font-bold">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-500">
            No active room allocations. Please register or contact the warden.
          </div>
        )}
      </div>

      {/* Dynamic Status Activity Timeline Card for Complaints */}
      <Card
        title="Complaints & Activity Timeline"
        footer={<Link to="/student/complaints" className="text-xs text-slate-700 dark:text-slate-300 hover:underline font-bold">View All Complaints</Link>}
      >
        {recentComplaints.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No complaints filed yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            {/* Left Block: Visual Activity Timeline of the latest complaint */}
            <div className="lg:col-span-7 bg-[#fcfbf9] dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    Latest Activity: {recentComplaints[0].title}
                  </h4>
                  <p className="text-[10px] text-gray-450 dark:text-gray-400 capitalize mt-0.5">
                    Category: {recentComplaints[0].category}
                  </p>
                </div>
                <StatusBadge status={recentComplaints[0].status} />
              </div>

              {/* Timeline Stepper Nodes */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200 dark:before:bg-slate-700">
                {recentComplaints[0].timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-600 border-2 border-white shadow-sm" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">
                        {step.notes || `Status changed to ${step.status}`}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Block: Simple ticket list */}
            <div className="lg:col-span-5 space-y-3.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">All Recent Tickets</h4>
              <div className="space-y-2.5">
                {recentComplaints.slice(0, 4).map((c) => (
                  <Link
                    key={c._id}
                    to={`/student/complaints/${c._id}`}
                    className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-850 hover:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-surface-800 transition duration-150"
                  >
                    <span className="text-xs font-semibold text-gray-800 dark:text-white truncate max-w-[180px] hover:underline">
                      {c.title}
                    </span>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}
      </Card>

      {/* Mess Menu details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Mess Menu */}
        <Card title="Today's Mess Menu" footer={<Link to="/student/mess-menu" className="text-xs text-slate-700 dark:text-slate-300 hover:underline font-bold">View Weekly Schedule</Link>}>
          {todayMenu && !todayMenu.isHoliday ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                <p className="text-xs font-bold text-gray-550 uppercase">Breakfast</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-1">{todayMenu.breakfast.join(', ')}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                <p className="text-xs font-bold text-gray-555 uppercase">Lunch</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-1">{todayMenu.lunch.join(', ')}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                <p className="text-xs font-bold text-gray-555 uppercase">Dinner</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-1">{todayMenu.dinner.join(', ')}</p>
              </div>
            </div>
          ) : todayMenu?.isHoliday ? (
            <p className="text-sm text-amber-600 font-semibold">Today is a Mess Holiday: {todayMenu.specialNote || 'No meals served'}</p>
          ) : (
            <p className="text-sm text-gray-500">Mess menu not updated for today.</p>
          )}
        </Card>
      </div>

    </div>
  );
};

export default StudentDashboard;