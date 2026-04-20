import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/mfe.config";

const apiClient = axios.create({
  baseURL: API_URL, 
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipToast = error.config?.headers?.["x-skip-toast"];


    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

if (!skipToast) {
  toast.error(message);
}


    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }

    toast.error(message); 
    return Promise.reject(new Error(message));
  }
);

export default apiClient;