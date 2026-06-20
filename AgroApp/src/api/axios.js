import axios from "axios";
import * as SecureStore from "expo-secure-store";

// const BASE_URL = "http://10.60.200.104:8000/api/v1";
const BASE_URL =
  "http://10.126.179.104:8000/api/v1";

const TOKEN_KEY = "fm_token";

const api = axios.create({
  baseURL:  BASE_URL,
  timeout:  15000,
  headers:  { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync("fm_user");
    }
    return Promise.reject(error);
  }
);

export default api;