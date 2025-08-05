import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://user-authentication-icm4.onrender.com", // fallback to your render URL
  withCredentials: true, // send cookies with every request
});

export default API;
