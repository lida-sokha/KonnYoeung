import axios from "axios";

const API = axios.create({
    baseURL: "https://konnyoeung.duckdns.org/api",
    withCredentials: true
});
// This is what you are missing!

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default API;