import axios from "axios";

// in production, there's no localhost so we have to make this dynamic

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
