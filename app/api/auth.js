import axios from "axios";

const API_URL = "http://localhost:1337/api";

export const registerRequest = async ({ username, email, password }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password,
    });
    return res.data; //contiene { jwt, user }
  } catch (error) {
    throw error.response?.data?.error?.message || "Error al registrar usuario";
  }
};