import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.chageum.co.kr",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && "success" in body) {
      if (body.success) {
        response.data = body.data;
        return response;
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = error.response.config?.url || "";
      if (!url.includes("/admin/login")) {
        localStorage.removeItem("admin_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
