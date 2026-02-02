import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "@/api/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_PRODUCTION_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
  REQUEST INTERCEPTOR
   ========================= */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();

  // ✅ فقط اگر واقعاً accessToken داریم هدر ست می‌کنیم
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

/* =========================
  RESPONSE INTERCEPTOR
   ========================= */
api.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ✅ اگر اصلاً کانفیگ نداریم، ادامه نده
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ✅ اگر کاربر logout کرده (accessToken نداریم) → refresh نزن
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/logout") ||
      originalRequest.url?.includes("/auth/refresh");

    // ✅ فقط یک بار refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const { accessToken: newToken } = await refreshAccessToken();

        // ✅ اگر refresh توکن نداد، قطع کن
        if (!newToken) {
          setStoredAccessToken(null);
          return Promise.reject(error);
        }

        setStoredAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // ✅ refresh fail شد → پایان احراز هویت
        setStoredAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
