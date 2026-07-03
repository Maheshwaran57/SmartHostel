import api from './api';

export const studentService = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  bulkUpload: (formData) => api.post('/students/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  exportStudents: () => api.get('/students/export/csv', { responseType: 'blob' })
};