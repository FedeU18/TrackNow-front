import api from "../api/auth";

//register d user
export const registerUser = async (username, email, password, rol) => {
  try {
    //registrar user asheeeei
    const response = await api.post("/auth/local/register", {
      username,
      email,
      password,
    });

    const userId = response.data.user.id;

    //actualizar rol
    await api.put(`/users/${userId}`, { rol: rol }, {
      headers: {
        Authorization: `Bearer ${response.data.jwt}`,//token recien creado
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error.response?.data || error);
    throw error;
  }
};

//login de user
export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post("/auth/local", {
      identifier,//username o mail
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error);
    throw error;
  }
};