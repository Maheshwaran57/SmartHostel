import api from './api';

export const messService = {
  getTodayMenu: () => api.get('/mess/today'),
  getWeekMenu: () => api.get('/mess/week'),
  getMonthMenu: () => api.get('/mess/month'),
  createMenu: (data) => api.post('/mess', data),
  updateMenu: (id, data) => api.put(`/mess/${id}`, data),
  deleteMenu: (id) => api.delete(`/mess/${id}`)
};