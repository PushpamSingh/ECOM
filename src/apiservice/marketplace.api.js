import api from './axios.js';

// ---- Seller (customer-facing) ----
export const sellerApi = {
  become: (payload) => api.post('/seller/become', payload),
  me: () => api.get('/seller/me'),
  updateProfile: (payload) => api.patch('/seller/profile', payload),
  setBank: (payload) => api.put('/seller/bank', payload),
  wallet: () => api.get('/seller/wallet'),
  ledger: () => api.get('/seller/ledger'),
  payouts: () => api.get('/seller/payouts'),
  settlements: () => api.get('/seller/settlements'),
  // products
  listProducts: () => api.get('/seller/products'),
  getProduct: (id) => api.get(`/seller/products/${id}`),
  createProduct: (payload) => api.post('/seller/products', payload),
  updateProduct: (id, payload) => api.patch(`/seller/products/${id}`, payload),
  submitProduct: (id) => api.post(`/seller/products/${id}/submit`),
  updateStock: (id, stock) => api.patch(`/seller/products/${id}/stock`, { stock }),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
};

// ---- Admin marketplace ----
export const marketplaceAdminApi = {
  sellers: (params) => api.get('/admin/marketplace/sellers', { params }),
  seller: (id) => api.get(`/admin/marketplace/sellers/${id}`),
  setSellerStatus: (id, status) => api.patch(`/admin/marketplace/sellers/${id}/status`, { status }),
  reviewQueue: (params) => api.get('/admin/marketplace/products', { params }),
  sellerProduct: (id) => api.get(`/admin/marketplace/products/${id}`),
  reviewProduct: (id, payload) => api.post(`/admin/marketplace/products/${id}/review`, payload),
  getSettings: () => api.get('/admin/marketplace/settings'),
  updateSettings: (payload) => api.patch('/admin/marketplace/settings', payload),
  runSettlement: () => api.post('/admin/marketplace/settlements/run'),
  eligiblePayouts: () => api.get('/admin/marketplace/payouts/eligible'),
  payouts: (params) => api.get('/admin/marketplace/payouts', { params }),
  createPayout: (payload) => api.post('/admin/marketplace/payouts', payload),
  payoutPaid: (id, payload) => api.patch(`/admin/marketplace/payouts/${id}/paid`, payload || {}),
  payoutFailed: (id, payload) => api.patch(`/admin/marketplace/payouts/${id}/failed`, payload || {}),
  disputes: (params) => api.get('/admin/marketplace/disputes', { params }),
  resolveDispute: (id, payload) => api.patch(`/admin/marketplace/disputes/${id}/resolve`, payload),
  analytics: () => api.get('/admin/marketplace/analytics'),
};

// ---- Notifications (any user) ----
export const notificationApi = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ---- Disputes (buyer) ----
export const disputeApi = {
  raise: (payload) => api.post('/disputes', payload),
  mine: () => api.get('/disputes/mine'),
};
