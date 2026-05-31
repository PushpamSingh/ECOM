import api from './axios.js';

export const productApi = {
  list: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  reviews: (productId) => api.get(`/products/${productId}/reviews`),
  addReview: (productId, payload) => api.post(`/products/${productId}/reviews`, payload),
  // admin
  adminList: (params) => api.get('/products/admin', { params }),
  adminGet: (id) => api.get(`/products/admin/${id}`),
  create: (payload) => api.post('/products', payload),
  update: (id, payload) => api.patch(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};

export const categoryApi = {
  list: (params) => api.get('/categories', { params }),
  get: (id) => api.get(`/categories/${id}`),
  // admin
  adminList: () => api.get('/categories/admin'),
  create: (payload) => api.post('/categories', payload),
  update: (id, payload) => api.patch(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
};
