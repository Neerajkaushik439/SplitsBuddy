import axios from 'axios'

const defaultBaseURL =
  import.meta.env.MODE === 'production'
    ? 'https://splitsbuddy.onrender.com/api/v1'
    : 'http://localhost:3001/api/v1'

const apiinstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
    // Auth uses Bearer token from localStorage, not cookies — omit credentials to simplify CORS.
    withCredentials: false,
})
apiinstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  })
  
export default apiinstance;