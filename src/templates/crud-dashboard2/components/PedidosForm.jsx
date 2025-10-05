import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { getUsersForSelection } from '../data/usuarios';

function PedidosForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [usuarios, setUsuarios] = React.useState([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = React.useState(true);

  // Cargar usuarios para los selects
  React.useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const usuariosList = await getUsersForSelection();
        setUsuarios(usuariosList);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setIsLoadingUsuarios(false);
      }
    };

    loadUsuarios();
  }, []);

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

  const handleDateFieldChange = React.useCallback(
    (fieldName) => (value) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString());
      } else {
        onFieldChange(fieldName, null);
      }
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleAutocompleteChange = React.useCallback(
    (fieldName) => (event, value) => {
      onFieldChange(fieldName, value ? value.id : null);
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/admin-dashboard/pedidos');
  }, [navigate, backButtonPath]);

  // Filtrar usuarios por rol
  const clientes = usuarios.filter(user => user.rol === 'cliente');
  const repartidores = usuarios.filter(user => user.rol === 'repartidor');

  // Obtener valores seleccionados para los autocompletes
  const selectedCliente = clientes.find(cliente => cliente.id === formValues.cliente_id) || null;
  const selectedRepartidor = repartidores.find(repartidor => repartidor.id === formValues.repartidor_id) || null;

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
        {/* Direcciones */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            value={formValues.direccion_origen ?? ''}
            onChange={handleTextFieldChange}
            name="direccion_origen"
            label="Dirección de Origen"
            error={!!formErrors.direccion_origen}
            helperText={formErrors.direccion_origen ?? ' '}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            value={formValues.direccion_destino ?? ''}
            onChange={handleTextFieldChange}
            name="direccion_destino"
            label="Dirección de Destino"
            error={!!formErrors.direccion_destino}
            helperText={formErrors.direccion_destino ?? ' '}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>

        {/* Cliente */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            value={selectedCliente}
            onChange={handleAutocompleteChange('cliente_id')}
            options={clientes}
            getOptionLabel={(option) => option.label || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isLoadingUsuarios}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                error={!!formErrors.cliente_id}
                helperText={formErrors.cliente_id ?? ' '}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Box component="span" sx={{ fontWeight: 'medium' }}>
                    {option.name || option.username}
                  </Box>
                  <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                    ({option.email})
                  </Box>
                </Box>
              </Box>
            )}
          />
        </Grid>

        {/* Repartidor */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            value={selectedRepartidor}
            onChange={handleAutocompleteChange('repartidor_id')}
            options={repartidores}
            getOptionLabel={(option) => option.label || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isLoadingUsuarios}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Repartidor (Opcional)"
                error={!!formErrors.repartidor_id}
                helperText={formErrors.repartidor_id ?? ' '}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Box component="span" sx={{ fontWeight: 'medium' }}>
                    {option.name || option.username}
                  </Box>
                  <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                    ({option.email})
                  </Box>
                </Box>
              </Box>
            )}
          />
        </Grid>

        {/* Estado */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl error={!!formErrors.estado} fullWidth>
            <InputLabel id="pedido-estado-label">Estado</InputLabel>
            <Select
              value={formValues.estado ?? 'Pendiente'}
              onChange={handleSelectFieldChange}
              labelId="pedido-estado-label"
              name="estado"
              label="Estado"
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En curso">En Curso</MenuItem>
              <MenuItem value="Entregado">Entregado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
            <FormHelperText>{formErrors.estado ?? ' '}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Fecha de Creación */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={formValues.fecha_creacion ? dayjs(formValues.fecha_creacion) : dayjs()}
              onChange={handleDateFieldChange('fecha_creacion')}
              name="fecha_creacion"
              label="Fecha de Creación"
              slotProps={{
                textField: {
                  error: !!formErrors.fecha_creacion,
                  helperText: formErrors.fecha_creacion ?? ' ',
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Fecha de Entrega */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={formValues.fecha_entrega ? dayjs(formValues.fecha_entrega) : null}
              onChange={handleDateFieldChange('fecha_entrega')}
              name="fecha_entrega"
              label="Fecha de Entrega (Opcional)"
              slotProps={{
                textField: {
                  error: !!formErrors.fecha_entrega,
                  helperText: formErrors.fecha_entrega ?? ' ',
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
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

PedidosForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      direccion_origen: PropTypes.string,
      direccion_destino: PropTypes.string,
      cliente_id: PropTypes.string,
      repartidor_id: PropTypes.string,
      estado: PropTypes.string,
      fecha_creacion: PropTypes.string,
      fecha_entrega: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      direccion_origen: PropTypes.string,
      direccion_destino: PropTypes.string,
      cliente_id: PropTypes.number,
      repartidor_id: PropTypes.number,
      estado: PropTypes.oneOf(['Pendiente', 'En curso', 'Entregado', 'Cancelado']),
      fecha_creacion: PropTypes.string,
      fecha_entrega: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default PedidosForm;