import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '', // set your API base URL if needed
});

// Add a request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from wherever you store it (e.g., Redux, localStorage)
    const token = localStorage.getItem("token"); // or get from Redux store if needed

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

export default axiosInstance;
