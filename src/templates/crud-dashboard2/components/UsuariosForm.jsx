import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

function UsuariosForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
    isEdit = false,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event, checked) => {
      onFieldChange(event.target.name, checked);
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/admin-dashboard/usuarios');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <Grid container spacing={3} sx={{ mb: 3, width: '100%' }}>
        {/* Información básica */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            value={formValues.username ?? ''}
            onChange={handleTextFieldChange}
            name="username"
            label="Nombre de Usuario"
            error={!!formErrors.username}
            helperText={formErrors.username ?? ' '}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            value={formValues.name ?? ''}
            onChange={handleTextFieldChange}
            name="name"
            label="Nombre Completo"
            error={!!formErrors.name}
            helperText={formErrors.name ?? ' '}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type="email"
            value={formValues.email ?? ''}
            onChange={handleTextFieldChange}
            name="email"
            label="Email"
            error={!!formErrors.email}
            helperText={formErrors.email ?? ' '}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type="tel"
            value={formValues.phone ?? ''}
            onChange={handleTextFieldChange}
            name="phone"
            label="Teléfono"
            error={!!formErrors.phone}
            helperText={formErrors.phone ?? ' '}
            fullWidth
          />
        </Grid>

        {/* Contraseña solo para nuevos usuarios */}
        {!isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              type="password"
              value={formValues.password ?? ''}
              onChange={handleTextFieldChange}
              name="password"
              label="Contraseña"
              error={!!formErrors.password}
              helperText={formErrors.password ?? ' '}
              fullWidth
              required
            />
          </Grid>
        )}

        {/* Rol */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl error={!!formErrors.rol} fullWidth>
            <InputLabel id="usuario-rol-label">Rol</InputLabel>
            <Select
              value={formValues.rol ?? 'cliente'}
              onChange={handleSelectFieldChange}
              labelId="usuario-rol-label"
              name="rol"
              label="Rol"
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="repartidor">Repartidor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>{formErrors.rol ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Estado de la cuenta - Solo para edición */}
        {isEdit && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl>
                <FormControlLabel
                  name="confirmed"
                  control={
                    <Checkbox
                      checked={formValues.confirmed ?? false}
                      onChange={handleCheckboxFieldChange}
                    />
                  }
                  label="Cuenta confirmada"
                />
                <FormHelperText error={!!formErrors.confirmed}>
                  {formErrors.confirmed ?? ' '}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl>
                <FormControlLabel
                  name="blocked"
                  control={
                    <Checkbox
                      checked={formValues.blocked ?? false}
                      onChange={handleCheckboxFieldChange}
                    />
                  }
                  label="Cuenta bloqueada"
                />
                <FormHelperText error={!!formErrors.blocked}>
                  {formErrors.blocked ?? ' '}
                </FormHelperText>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Volver
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

UsuariosForm.propTypes = {
  backButtonPath: PropTypes.string,
  isEdit: PropTypes.bool,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      password: PropTypes.string,
      rol: PropTypes.string,
      confirmed: PropTypes.string,
      blocked: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      password: PropTypes.string,
      rol: PropTypes.oneOf(['admin', 'cliente', 'repartidor']),
      confirmed: PropTypes.bool,
      blocked: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default UsuariosForm;