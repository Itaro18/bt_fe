
import axios from "axios";
import { getToken } from "@/lib/auth/token"; // ✅ safe to import now

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Update if deploying
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
