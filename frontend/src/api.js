import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("civic_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const imageUrl = path => path?.startsWith("http") ? path : `http://localhost:5000${path || ""}`;
export default api;
