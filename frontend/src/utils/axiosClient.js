import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_BUILDER_KEY?.replace(/\/$/, '')}`,
  withCredentials: true,
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// The response interceptor is still useful to handle 401 errors
axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // If the server returns a 401 error, it means the session is invalid
      // The browser will automatically clear the cookie if the server sends the correct headers
      if (error.response?.status === 401) {
        console.log("Authentication failed, server returned 401.");
        // We don't need to manually remove the token from localStorage anymore
        // The backend should be configured to clear the cookie on logout
        
        // Redirect to the login page
        // window.location.href = '/login'; 
      }
      return Promise.reject(error);
    }
  );

export default axiosClient;