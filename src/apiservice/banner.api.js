import api from './axios.js';

export const bannerApi = {
  // public
  listLive: (params) => api.get('/banners', { params }),
  // admin
  listAdmin: (params) => api.get('/banners/admin', { params }),
  get: (id) => api.get(`/banners/${id}`),
  create: (payload) => api.post('/banners', payload),
  update: (id, payload) => api.put(`/banners/${id}`, payload),
  remove: (id) => api.delete(`/banners/${id}`),
  setStatus: (id, isActive) => api.patch(`/banners/${id}/status`, { isActive }),
  reorder: (order) => api.patch('/banners/reorder', { order }),
};
