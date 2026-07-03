import api from './api';

export const complaintService = {
  getComplaints: (params) => api.get('/complaints', { params }),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  createComplaint: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, status, notes) => api.put(`/complaints/${id}/status`, { status, notes }),
  assignComplaint: (id, staffId) => api.put(`/complaints/${id}/assign`, { staffId }),
  resolveComplaint: (id, formData) => api.put(`/complaints/${id}/resolve`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};