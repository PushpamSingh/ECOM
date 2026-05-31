import api from './axios.js';

export const adminApi = {
  // Get notification badge counts for sidebar
  getNotificationCounts: () => api.get('/admin/counts').then((r) => r.data),
};
