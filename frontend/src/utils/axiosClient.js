import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_BUILDER_KEY?.replace(/\/$/, '')}`,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token in all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export default axiosClient;