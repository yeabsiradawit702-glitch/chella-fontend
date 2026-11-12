
export const BASE_URL = "https://backend-ch-onwc.onrender.com";

// API ENDPOINTS
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    VERIFY_LOGIN_OTP: "/api/auth/verify-login-otp",
    RESEND_LOGIN_OTP: "/api/auth/resend-login-otp",
  },

  USERS: {
    GET_ALL_USERS: "/api/user",

    GET_USER_BY_ID: (userId: string) => `/api/user/${userId}`,

    CREATE_USER: "/api/users",

    UPDATE_USER: (userId: string) => `/api/users/${userId}`,

    DELETE_USER: (userId: string) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/task/dashboard-data",

    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
    GET_USER_DASHBOARD_DATA1: "/api/dashboard/summary",
    GET_MY_REFERRALS: "/api/task/my-referrals",
    GET_ALL_TASKS: "/api/task",

    GET_TASK_BY_ID: (taskId: string) => `/api/task/${taskId}`,

    CREATE_TASK: "/api/task",

    UPDATE_TASK: (taskId: string) => `/api/task/${taskId}`,

    DELETE_TASK: (taskId: string) => `/api/task/${taskId}`,

    UPDATE_TASK_STATUS: (taskId: string) =>
      `/api/task/${taskId}/status`,

    UPDATE_TODO_CHECKLIST: (taskId: string) =>
      `/api/task/${taskId}/todo`,

    CLAIM_VIDEO_REWARD: (id: string) =>
      `/api/task/${id}/video-reward`,

    CLAIM_INSTAGRAM_REWARD: (id: string) =>
      `/api/task/${id}/instagram-reward`,
  },

  REPORTS: {
    EXPORT_TASKS: "/api/report/export/tasks",
    EXPORT_USERS: "/api/report/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  TRANSACTIONS: {
    GET_ALL: "/api/transactions",
  },
};
