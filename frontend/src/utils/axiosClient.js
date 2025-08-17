import axios from "axios";

const axiosClient = axios.create({
    // THIS IS THE FIX. We are removing the environment variable 
    // and using a relative path.
    baseURL: '/api', 
    
    withCredentials: true,
    timeout: 5000, // 5 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;