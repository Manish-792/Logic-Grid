import axios from "axios"



const axiosClient = axios.create({

baseURL: `${import.meta.env.VITE_PUBLIC_BUILDER_KEY?.replace(/\/$/, '')}`,

 withCredentials: true,

 timeout: 5000, // 5 second timeout

headers: {

'Content-Type': 'application/json'

}

});


export default axiosClient;