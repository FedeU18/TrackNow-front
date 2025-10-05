import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createOne as createPedido,
  validate as validatePedido,
} from '../data/pedidos';
import PedidosForm from './PedidosForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES = {
  direccion_origen: '',
  direccion_destino: '',
  cliente_id: null,
  repartidor_id: null,
  estado: 'Pendiente',
  fecha_creacion: new Date().toISOString(),
  fecha_entrega: null,
};

export default function PedidosCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createPedido(formValues);
      notifications.show('Pedido creado exitosamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin-dashboard/pedidos');
    } catch (createError) {
      notifications.show(
        `Error al crear pedido. Razón: ${createError.message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="Nuevo Pedido"
      breadcrumbs={[
        { title: 'Pedidos', path: '/admin-dashboard/pedidos' }, 
        { title: 'Nuevo' }
      ]}
    >
      <PedidosForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Crear Pedido"
        backButtonPath="/admin-dashboard/pedidos"
      />
    </PageContainer>
  );
}