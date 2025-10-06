import api from "../api/auth";

export const getPedidos = async (token, userId) => {
  try {
    const response = await api.get(
      `/pedidos?filters[id_cliente][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener pedidos:", error.response?.data || error);
    return [];
  }
};
