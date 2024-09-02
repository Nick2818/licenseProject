import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  // any other default properties...
});

api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
