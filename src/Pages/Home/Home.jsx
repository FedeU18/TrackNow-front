import React, { useEffect } from "react";
import "./Home.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import AppTheme from "../../templates/shared-theme/AppTheme";
import ColorModeSelect from "../../templates/shared-theme/ColorModeSelect";
import { useAuthStore } from "../../store/auth";

const HomeContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(4),
}));

export default function Home(props) {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  // Redirigir al dashboard correspondiente si el usuario está logueado
  useEffect(() => {
    if (token && user && user.rol) {
      const roleRedirects = {
        cliente: "/cliente-dashboard",
        repartidor: "/repartidor-dashboard", 
        admin: "/admin-dashboard",
      };
      
      const redirectPath = roleRedirects[user.rol.toLowerCase()];
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [token, user, navigate]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HomeContainer
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 2,
        }}
      >
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />

        {/* Title */}
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            fontWeight: "bold",
            textAlign: "center",
            background: "#d79141",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Track Now
        </Typography>

        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            maxWidth: "600px",
            fontSize: "clamp(1rem, 4vw, 1.5rem)",
          }}
        >
          Tu solución de seguimiento de paquetes
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            size="large"
            className="home-button"
          >
            Iniciar sesión
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="outlined"
            size="large"
            className="home-button"
          >
            Registrarse
          </Button>
        </Box>
      </HomeContainer>
    </AppTheme>
  );
}
