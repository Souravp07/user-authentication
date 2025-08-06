import axios from "axios";

// Determine the API base URL
const apiBaseUrl = process.env.REACT_APP_API_URL || "https://user-authentication-icm4.onrender.com";

// Create axios instance with proper configuration
const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required for cookies to be sent and received across domains
  timeout: 15000, // 15 second timeout for slower connections
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
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
