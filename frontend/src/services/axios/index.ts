import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "../../features/auth/store"; // We'll build this next

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject token if available
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Here we could implement the Refresh Token logic. For now, assuming fake/stub logic:
        // const newTokens = await axios.post('/api/auth/refresh');
        // useAuthStore.getState().setToken(newTokens.data.accessToken);

        // If refresh fails, log out the user
        // useAuthStore.getState().logout();
      } catch (e) {
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }

    // You could handle other global errors (403, 500) here, or let the local mutations handle them.
    return Promise.reject(error);
  }
);
