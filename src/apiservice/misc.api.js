import api from './axios.js';

export const settingsApi = {
  public: () => api.get('/settings/public'),
  get: () => api.get('/settings'),
  update: (payload) => api.patch('/settings', payload),
};

export const contactApi = {
  send: (payload) => api.post('/contact', payload),
  list: () => api.get('/contact'),
  markRead: (id) => api.patch(`/contact/${id}/read`),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  customers: (params) => api.get('/admin/customers', { params }),
  transactions: () => api.get('/admin/transactions'),
};

export const uploadApi = {
  // Let Axios set the multipart Content-Type (incl. the boundary) from FormData.
  image: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload/image', form);
  },
  images: (files) => {
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('images', f));
    return api.post('/upload/images', form);
  },
};
