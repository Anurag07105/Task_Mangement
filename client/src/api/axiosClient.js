import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://teamtaskmanger-production-a7a3.up.railway.app/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttm_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;