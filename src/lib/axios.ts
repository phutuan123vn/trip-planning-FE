import axios from "axios";
import { env } from "@/lib/env";
import { getTokenCookie } from "@/lib/cookie";

const api = axios.create({
  baseURL: `${env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getTokenCookie();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
