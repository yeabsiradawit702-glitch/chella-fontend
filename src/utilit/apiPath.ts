
export const BASE_URL = "http://localhost:3000";

// API ENDPOINTS
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  USERS: {
    GET_ALL_USERS: "/api/user",

    GET_USER_BY_ID: (userId) => `/api/user/${userId}`,

    CREATE_USER: "/api/users",

    UPDATE_USER: (userId) => `/api/users/${userId}`,

    DELETE_USER: (userId) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/task/dashboard-data",

    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
    GET_USER_DASHBOARD_DATA1: "/api/dashboard/summary",

    GET_ALL_TASKS: "/api/task",

    GET_TASK_BY_ID: (taskId) => `/api/task/${taskId}`,

    CREATE_TASK: "/api/task",

    UPDATE_TASK: (taskId) => `/api/task/${taskId}`,

    DELETE_TASK: (taskId) => `/api/task/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) =>
      `/api/task/${taskId}/status`,

    UPDATE_TODO_CHECKLIST: (taskId) =>
      `/api/task/${taskId}/todo`,
    CLAIM_VIDEO_REWARD: (id) => `/task/${id}/video-reward`,
  
  },

  REPORTS: {
    EXPORT_TASKS: "/api/report/export/tasks",

    EXPORT_USERS: "/api/report/export/users",
  },
  IMAGE:{
    UPLOAD_IMAGE:"/api/auth/upload-image"
  }
  
};
