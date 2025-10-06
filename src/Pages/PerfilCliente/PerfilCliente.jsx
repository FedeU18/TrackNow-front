import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { getUserProfile } from "../../services/authService";
import { getPedidos } from "../../services/pedidoService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PerfilCliente() {
  const { token } = useAuthStore();
  const [perfil, setPerfil] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.warn("No hay token disponible");
        setLoading(false);
        return;
      }

      try {
        const perfilData = await getUserProfile(token);
        const pedidosData = await getPedidos(token, perfilData.id);
        setPerfil(perfilData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (!perfil)
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="h6">
          No se pudo cargar el perfil.
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Ir al inicio
        </Button>
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Perfil de {perfil.username}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        🧾 Tus pedidos
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Dirección Origen</strong>
              </TableCell>
              <TableCell>
                <strong>Dirección Destino</strong>
              </TableCell>
              <TableCell>
                <strong>Estado</strong>
              </TableCell>
              <TableCell>
                <strong>Repartidor</strong>
              </TableCell>
              <TableCell>
                <strong>Fecha Creación</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <TableRow
                  key={pedido.id}
                  sx={{
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: "#2b2b2b",
                      "& td": { color: "white" }, // 👈 esto pinta el texto blanco
                    },
                  }}
                >
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>{pedido.direccion_origen}</TableCell>
                  <TableCell>{pedido.direccion_destino}</TableCell>
                  <TableCell>{pedido.estado}</TableCell>
                  <TableCell>
                    {pedido.id_repartidor
                      ? pedido.id_repartidor.username
                      : "Sin asignar"}
                  </TableCell>
                  <TableCell>
                    {pedido.fecha_creacion
                      ? new Date(pedido.fecha_creacion).toLocaleDateString()
                      : "Sin fecha"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay pedidos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cliente-dashboard")}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Box>
  );
}
