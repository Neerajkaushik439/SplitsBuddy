import axios from 'axios'

const apiinstance = axios.create({
    baseURL: "https://splitsbuddy.onrender.com/api/v1",
    // Auth uses Bearer token from localStorage, not cookies — omit credentials to simplify CORS.
    withCredentials: false,
})
apiinstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  })
  
export default apiinstance;