import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // from .env file
  withCredentials: true, // send cookies with every request
});

export default API;
