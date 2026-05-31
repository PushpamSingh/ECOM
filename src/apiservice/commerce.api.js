import api from './axios.js';

export const cartApi = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  update: (productId, quantity) => api.patch(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const orderApi = {
  create: (payload) => api.post('/orders', payload),
  myOrders: () => api.get('/orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  // admin
  adminList: (params) => api.get('/orders/admin', { params }),
  adminGet: (id) => api.get(`/orders/admin/${id}`),
  adminUpdate: (id, payload) => api.patch(`/orders/admin/${id}`, payload),
};

export const couponApi = {
  apply: (code) => api.post('/coupons/apply', { code }),
  // admin
  list: (params) => api.get('/coupons', { params }),
  create: (payload) => api.post('/coupons', payload),
  update: (id, payload) => api.patch(`/coupons/${id}`, payload),
  remove: (id) => api.delete(`/coupons/${id}`),
};

export const reviewApi = {
  adminList: (params) => api.get('/reviews', { params }),
  adminUpdate: (id, payload) => api.patch(`/reviews/${id}`, payload),
  adminRemove: (id) => api.delete(`/reviews/${id}`),
};

export const paymentApi = {
  verify: (payload) => api.post('/payments/razorpay/verify', payload),
};
