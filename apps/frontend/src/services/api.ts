import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token but don't redirect - let the component handle it
      localStorage.removeItem("auth_token");
      
      // Suppress console error for expected 401s (like when not logged in)
      const suppressPaths = ["/api/users/me"];
      const path = error.config?.url;
      if (!path || !suppressPaths.some(p => path.includes(p))) {
        console.error("API 401 Error:", error);
      }
    }
    return Promise.reject(error);
  }
);
