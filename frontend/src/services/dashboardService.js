import api from './api';

export const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getStudentDashboard: () => api.get('/dashboard/student'),
  getStaffDashboard: () => api.get('/dashboard/staff')
};