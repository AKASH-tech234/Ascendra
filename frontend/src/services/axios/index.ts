import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "../../features/auth/store";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const NON_REFRESHABLE_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

const isNonRefreshableAuthPath = (url?: string) =>
  NON_REFRESHABLE_AUTH_PATHS.some((path) => (url || "").includes(path));

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
const refreshClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No active token to refresh");
  }

  const { data } = await refreshClient.post<{ token: string }>(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const newToken = data.token;
  useAuthStore.getState().setToken(newToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  return newToken;
}
// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (!config.headers) {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const shouldAttemptRefresh =
      status === 401 &&
      !!originalRequest &&
      !originalRequest._retry &&
      !isNonRefreshableAuthPath(originalRequest.url);

    if (shouldAttemptRefresh && originalRequest) {
      originalRequest._retry = true;
      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken().finally(() => {
            refreshTokenPromise = null;
          });
        }

        const newToken = await refreshTokenPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        delete api.defaults.headers.common["Authorization"];
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !isNonRefreshableAuthPath(originalRequest?.url)) {
      delete api.defaults.headers.common["Authorization"];
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
