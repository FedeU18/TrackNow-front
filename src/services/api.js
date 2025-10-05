import axios from "axios";
import { useAuthStore } from "../store/auth";
import config from "../config";

const api = axios.create({
  baseURL: config.strapi.apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  try {
    const token = useAuthStore.getState().token;
    if (token) {
      return token;
    }

    // Fallback a localStorage si no está en el store
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.token || parsed.token;
    }

    return null;
  } catch (error) {
    console.warn("Error al obtener token de autenticación:", error);
    return null;
  }
};

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (axiosConfig) => {
    const userToken = getAuthToken();

    // Para el endpoint de usuarios, usar siempre el token JWT del usuario
    if (axiosConfig.url && axiosConfig.url.includes("/users")) {
      if (userToken) {
        axiosConfig.headers.Authorization = `Bearer ${userToken}`;
      } else {
        console.warn("⚠️ No user token available for /users endpoint");
      }
    }
    // Para otros endpoints, priorizar token de usuario, fallback a API token
    else {
      if (userToken) {
        axiosConfig.headers.Authorization = `Bearer ${userToken}`;
      } else if (config.strapi.apiToken) {
        axiosConfig.headers.Authorization = `Bearer ${config.strapi.apiToken}`;
      }
    }

    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
