// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://avsoft-render-18.onrender.com/api",
});

export default api;