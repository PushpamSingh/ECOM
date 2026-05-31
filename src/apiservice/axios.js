import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, TOKEN_KEY } from '@/constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach JWT from localStorage to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the API envelope and surface error messages.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    // Silent probes whose failure is expected (used to detect auth/seller state).
    const SILENT = ['/auth/me', '/seller/me'];
    const isProbe = SILENT.includes(error.config?.url);

    // Dedupe identical messages (id) so a burst of failed requests shows one toast.
    if (!isProbe) toast.error(message, { id: message });

    // Expired/invalid session: clear the token and bounce to the right login,
    // unless we're already there or it's just a silent probe.
    if (status === 401 && !isProbe) {
      localStorage.removeItem(TOKEN_KEY);
      const path = window.location.pathname;
      const isAdmin = path.startsWith('/admin');
      const loginPath = isAdmin ? '/admin/login' : '/account';
      if (path !== loginPath) window.location.assign(loginPath);
    }
    return Promise.reject({ ...error, message });
  }
);

export default api;
