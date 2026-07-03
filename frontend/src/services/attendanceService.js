import api from './api';

export const attendanceService = {
  markAttendance: () => api.post('/attendance/mark'),
  getTodayAttendance: () => api.get('/attendance/today'),
  getHistory: (studentId) => api.get('/attendance/history', { params: { studentId } }),
  getAllTodayAttendance: () => api.get('/attendance/today-all')
};