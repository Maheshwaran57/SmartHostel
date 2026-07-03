import api from './api';

export const roomService = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  allocateRoom: (studentId) => api.post('/rooms/allocate', { studentId }),
  manualAllocate: (studentId, roomId) => api.post('/rooms/allocate/manual', { studentId, roomId }),
  transferRoom: (studentId, newRoomId) => api.post('/rooms/transfer', { studentId, newRoomId }),
  deallocateRoom: (studentId) => api.post('/rooms/deallocate', { studentId })
};