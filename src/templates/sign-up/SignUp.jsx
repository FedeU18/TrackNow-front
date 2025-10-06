import * as React from "react";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { registerUser } from "../../services/authService"; //aca conectmaos con strapi
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
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

export default function SignUp(props) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const navigate = useNavigate();

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let isValid = true;
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setNameError(true);
      isValid = false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError(true);
      isValid = false;
    }
    if (!form.password || form.password.length < 6) {
      setPasswordError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await registerUser(
        form.name,
        form.email,
        form.password,
        form.rol
      );
      console.log("Usuario registrado:", res);
      setSuccess("Registro exitoso. Ahora podés iniciar sesión.");
      setForm({ name: "", email: "", password: "", rol: "cliente" });
      navigate("/login");
    } catch (err) {
      console.error("Error registrando usuario:", err.response?.data || err.message || err);

      const resp = err.response?.data;
      let readable = "Error al registrarte.";

      if (resp) {
        if (typeof resp === 'string') readable = resp;
        else if (resp.message) readable = resp.message;
        else if (resp.error?.message) readable = resp.error.message;
        else if (resp.error) readable = typeof resp.error === 'string' ? resp.error : JSON.stringify(resp.error);
        else readable = JSON.stringify(resp);
      } else if (err.message) {
        readable = err.message;
      }

      const txt = String(readable).toLowerCase();
      if (/email.*(already|taken|exists|in use|ya está en uso|ya existe)/i.test(txt)) {
        setError('El email ya está en uso.');
      } else if (/username.*(already|taken|exists|ya existe|ya está en uso)/i.test(txt)) {
        setError('El nombre de usuario ya está en uso.');
      } else if (/validationerror|validation error/i.test(txt)) {
        setError('Error de validación. Verifique los campos.');
      } else {
        setError(readable);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
            }}
          >
            Registro
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Nombre Completo</FormLabel>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                value={form.name}
                onChange={handleChange}
                error={nameError}
                helperText={nameError ? "El nombre es obligatorio" : ""}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                name="email"
                type="email"
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                error={emailError}
                helperText={emailError ? "Correo inválido" : ""}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                name="password"
                type="password"
                required
                fullWidth
                id="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
                error={passwordError}
                helperText={
                  passwordError ? "Debe tener al menos 6 caracteres" : ""
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="rol">Rol</FormLabel>
              <Select
                labelId="rol-label"
                id="rol"
                name="rol"
                value={form.rol}
                label="Rol"
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="repartidor">Repartidor</MenuItem>
              </Select>
            </FormControl>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button type="submit" fullWidth variant="contained" color="secondary">
              Registrarse
            </Button>
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

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              ¿Ya tenés una cuenta?{" "}
              <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
                Iniciá sesión
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
