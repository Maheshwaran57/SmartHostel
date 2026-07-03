import api from './api';

export const gatePassService = {
  applyGatePass: (data) => api.post('/gatepasses', data),
  getGatePasses: () => api.get('/gatepasses'),
  updateGatePassStatus: (id, status, rejectionReason) => 
    api.put(`/gatepasses/${id}/status`, { status, rejectionReason })
};