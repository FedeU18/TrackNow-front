import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  getOne as getPedido,
  updateOne as updatePedido,
  validate as validatePedido,
} from '../data/pedidos';
import PedidosForm from './PedidosForm';
import PageContainer from './PageContainer';

function PedidosEditForm({ initialValues, onSubmit }) {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback((newFormValues) => {
    setFormState((previousState) => ({
      ...previousState,
      values: newFormValues,
    }));
  }, []);

  const setFormErrors = React.useCallback((newFormErrors) => {
    setFormState((previousState) => ({
      ...previousState,
      errors: newFormErrors,
    }));
  }, []);

  const handleFormFieldChange = React.useCallback(
    (name, value) => {
      const validateField = async (values) => {
        const { issues } = validatePedido(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validatePedido(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Pedido actualizado exitosamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin-dashboard/pedidos');
    } catch (editError) {
      notifications.show(`Error al actualizar pedido. Razón: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <PedidosForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Guardar Cambios"
      backButtonPath={`/admin-dashboard/pedidos/${pedidoId}`}
    />
  );
}

PedidosEditForm.propTypes = {
  initialValues: PropTypes.shape({
    direccion_origen: PropTypes.string,
    direccion_destino: PropTypes.string,
    cliente_id: PropTypes.number,
    repartidor_id: PropTypes.number,
    estado: PropTypes.oneOf(['Pendiente', 'En curso', 'Entregado', 'Cancelado']),
    fecha_creacion: PropTypes.string,
    fecha_entrega: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function PedidosEdit() {
  const { pedidoId } = useParams();

  const [pedido, setPedido] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getPedido(Number(pedidoId));
      
      // Transformar los datos para el formulario
      const formData = {
        direccion_origen: showData.direccion_origen,
        direccion_destino: showData.direccion_destino,
        cliente_id: showData.cliente?.id || null,
        repartidor_id: showData.repartidor?.id || null,
        estado: showData.estado,
        fecha_creacion: showData.fecha_creacion,
        fecha_entrega: showData.fecha_entrega,
      };

      setPedido(formData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [pedidoId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues) => {
      const updatedData = await updatePedido(Number(pedidoId), formValues);
      
      // Transformar los datos actualizados para el estado
      const formData = {
        direccion_origen: updatedData.direccion_origen,
        direccion_destino: updatedData.direccion_destino,
        cliente_id: updatedData.cliente?.id || null,
        repartidor_id: updatedData.repartidor?.id || null,
        estado: updatedData.estado,
        fecha_creacion: updatedData.fecha_creacion,
        fecha_entrega: updatedData.fecha_entrega,
      };

      setPedido(formData);
    },
    [pedidoId],
  );

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return pedido ? (
      <PedidosEditForm initialValues={pedido} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, pedido, handleSubmit]);

  return (
    <PageContainer
      title={`Editar Pedido #${pedidoId}`}
      breadcrumbs={[
        { title: 'Pedidos', path: '/admin-dashboard/pedidos' },
        { title: `Pedido #${pedidoId}`, path: `/admin-dashboard/pedidos/${pedidoId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}