import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import AppTheme from "../../templates/shared-theme/AppTheme";
import ColorModeSelect from "../../templates/shared-theme/ColorModeSelect";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 900 }} variant="outlined">
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              ¡Bienvenido {user?.username || "Usuario"}!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Dashboard del rol Cliente.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Desde aquí podrás realizar y gestionar tus pedidos.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
              <Button variant="contained" color="primary">Hacer Pedido</Button>
              <Button variant="outlined" color="primary">Mis Pedidos</Button>
              <Button variant="outlined" color="primary">Mi Perfil</Button>
            </Stack>

            <Button variant="text" color="error" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </Box>
    </AppTheme>
  );
}