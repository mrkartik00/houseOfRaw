import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Your Node.js backend port
  withCredentials: true, // only if using cookies
});

export default axiosInstance;