import axios from 'axios';

const API_URL = 'http://Public-ip-ec2:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomService = {
  getAll: () => api.get('/rooms'),
  getAvailable: () => api.get('/rooms/available'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const guestService = {
  getAll: () => api.get('/guests'),
  getById: (id) => api.get(`/guests/${id}`),
  create: (data) => api.post('/guests', data),
  update: (id, data) => api.put(`/guests/${id}`, data),
  delete: (id) => api.delete(`/guests/${id}`),
};

export const bookingService = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;
