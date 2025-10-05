import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./components/ForgotPassword";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { loginUser } from "../../services/authService";
import { Alert } from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%", // Asegura que ocupe todo el ancho disponible
  maxWidth: "700px", // Incrementar el ancho máximo
  minWidth: "400px", // Establecer un ancho mínimo para pantallas pequeñas
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    width: "90%", // Ajustar el ancho para pantallas pequeñas
  },
  [theme.breakpoints.up("md")]: {
    width: "80%", // Ajustar el ancho para pantallas medianas
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  maxWidth: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

      //logear
      try {
        console.log("intentando login con", email);
        const result = await loginUser(email, password);
        console.log("result:", result);

        //guardar token y user
        useAuthStore.getState().setToken(result.jwt);
        useAuthStore.getState().setUser(result.user);

        //redirigir segun rol
        switch (result.user?.rol) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "cliente":
            navigate("/cliente-dashboard");
            break;
          case "repartidor":
            navigate("/repartidor-dashboard");
            break;
          default:
            setErrorMessage("Rol no reconocido");
            break;
        }
      } catch (loginErr) {
        console.error("Login error:", loginErr);
        let readable = "Error al iniciar sesión";
        const respData = loginErr.response?.data;

        if (respData) {
          if (typeof respData === "string") {
            readable = respData;
          } else if (respData.message) {
            readable = respData.message;
          } else if (respData.error?.message) {
            readable = respData.error.message;
          } else if (respData.error) {
            readable = typeof respData.error === 'string' ? respData.error : JSON.stringify(respData.error);
          } else {
            readable = JSON.stringify(respData);
          }
        } else if (loginErr.message) {
          readable = loginErr.message;
        }

        if (typeof readable === 'string') {
          const lower = readable.toLowerCase();
          let translated = null;

          if (/invalid identifier(?: or password)?/i.test(readable)) {
            translated = "Email o contraseña incorrectos.";
          } else if (/invalid identifier/i.test(readable)) {
            translated = "Email incorrecto.";
          } else if (/validationerror/i.test(readable) || /validation error/i.test(readable)) {
            translated = "Error de validación.";
          } else if (/email.*not.*found/i.test(readable) || /user not found/i.test(readable)) {
            translated = "Usuario no encontrado.";
          }

          const display = translated || (typeof readable === 'string' ? readable.replace(/\r|\n/g, ' ').trim() : String(readable));

          setErrorMessage(display);
        } else {
          setErrorMessage("Error al iniciar sesión");
        }
      }
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Por favor ingrese un email válido.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("La contraseña tiene que ser al menos de 6 caracteres de largo.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if(!password.value) {
      setPasswordErrorMessage("Por favor ingrese su contraseña.");
      isValid = false;
    }


    if (!email.value) {
      setEmailErrorMessage("Por favor ingrese su email.");
      isValid = false;
    }

    return isValid;
  };

  const [errorMessage, setErrorMessage] = React.useState("");

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Iniciar sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              color="secondary"
            >
              Iniciar sesión
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/")}
            >
                Volver al Inicio
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              ¿No tenés cuenta?{" "}
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Registrate
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
