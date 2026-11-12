
import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed:", error.response.data);
      window.location.href = "/login";
    } else if (error.response?.status === 404) {
      console.error("API endpoint not found:", error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error("Backend server error:", error.response.data);
    } else if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      console.error("Backend request timed out.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
