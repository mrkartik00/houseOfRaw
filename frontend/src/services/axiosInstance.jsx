import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7000", // Your Node.js backend port
  withCredentials: true, // only if using cookies
});

// Add a request interceptor to automatically include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;