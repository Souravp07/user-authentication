import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://user-authentication-icm4.onrender.com", // fallback to your render URL
  withCredentials: false, // temporarily disable credentials to test CORS
  timeout: 10000, // 10 second timeout
});

// Log the actual base URL being used
console.log(
  "🔗 API Base URL:",
  process.env.REACT_APP_API_URL ||
    "https://user-authentication-icm4.onrender.com"
);

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.status,
      error.config?.url
    );
    return Promise.reject(error);
  }
);

export default API;
