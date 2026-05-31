import api from './axios.js';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (payload) => api.patch('/auth/profile', payload),
  changePassword: (payload) => api.patch('/auth/password', payload),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (payload) => api.post('/auth/addresses', payload),
  updateAddress: (id, payload) => api.patch(`/auth/addresses/${id}`, payload),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};
