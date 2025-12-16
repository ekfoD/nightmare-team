import axios from "axios";

// base axios instance
const api = axios.create({
  baseURL: "http://localhost:5098/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
