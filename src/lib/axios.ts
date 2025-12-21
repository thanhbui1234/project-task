import axios from 'axios';
import { getToken, clearAuth } from '@/utils/auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + '/api/v1',
  timeout: 15000,
});

/* --------------------- REQUEST --------------------- */
// Tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------- RESPONSE ---------------------- */
api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const status = error?.response?.status;
    // Nếu token hết hạn hoặc không hợp lệ => logout
    if (status === 401) {
      clearAuth();
      // Optionally: chuyển về trang login nếu bạn muốn
      // window.location.href = "/login"
    }

    return Promise.reject(error.response.data);
  }
);

export default api;
