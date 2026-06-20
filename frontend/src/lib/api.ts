import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Pre-configured Axios instance for backend API calls.
 * Includes interceptors for auth token injection and refresh logic using HTTPOnly cookies.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor — handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Since we are using cookies, we just hit the refresh endpoint
        // The browser will automatically send the refreshToken cookie
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

        // If refresh succeeds, the server sets a new accessToken cookie
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
