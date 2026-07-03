import React, { useEffect, useState } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { Card } from '../../components/common/Card';
import { DataTable } from '../../components/common/DataTable';
import { StatsCard } from '../../components/common/StatsCard';
import { HiOutlineUser, HiOutlineCalendar } from 'react-icons/hi';

export const AttendanceRegister = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAllTodayAttendance();
      if (res.data.success) {
        setList(res.data.attendance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const totalPresent = list.filter(a => a.status === 'present').length;

  const columns = [
    { key: 'name', label: 'Student Name', render: (row) => <span>{row.student?.name}</span> },
    { key: 'email', label: 'Email', render: (row) => <span>{row.student?.email}</span> },
    { key: 'department', label: 'Dept', render: (row) => <span>{row.student?.department}</span> },
    { key: 'year', label: 'Year', render: (row) => <span>Year {row.student?.year}</span> },
    { key: 'status', label: 'Attendance', render: () => <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">Present</span> },
    {
      key: 'markedAt',
      label: 'Marked Time',
      render: (row) => <span>{new Date(row.markedAt).toLocaleTimeString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Attendance Registry</h2>
        <p className="text-sm text-gray-500 mt-1">Live feed of student presence checks for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
        <StatsCard title="Students Present Today" value={totalPresent} icon={HiOutlineUser} color="success" />
        <StatsCard title="Mark Date" value={new Date().toLocaleDateString()} icon={HiOutlineCalendar} color="primary" />
      </div>

      <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Today's Present Students Log</h3>
        <DataTable columns={columns} data={list} loading={loading} />
      </Card>
    </div>
  );
};

export default AttendanceRegister;