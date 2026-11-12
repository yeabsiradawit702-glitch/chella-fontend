
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed:", error.response.data);
    } else if (error.response?.status === 404) {
      console.error("API endpoint not found:", error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error("Backend server error:", error.response.data);
    } else if (!error.response) {
      console.error("Network/CORS error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
