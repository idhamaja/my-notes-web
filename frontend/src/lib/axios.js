import axios from "axios";

// in production, there's no localhost so we have to make this dynamic

// Dynamic baseURL – otomatis sesuai environment
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "/api"                    // production (Vercel) → relative path
    : "http://localhost:5001/api", // development → local backend
});

export default api;
