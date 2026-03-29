import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "https://my-notes-web-blond.vercel.app/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
