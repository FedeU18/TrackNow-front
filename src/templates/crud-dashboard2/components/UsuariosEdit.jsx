import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  getOne as getUsuario,
  updateOne as updateUsuario,
  validate as validateUsuario,
} from '../data/usuarios';
import UsuariosForm from './UsuariosForm';
import PageContainer from './PageContainer';

function UsuariosEditForm({ initialValues, onSubmit }) {
  const { usuarioId } = useParams();
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
        const { issues } = validateUsuario(values);
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
    const { issues } = validateUsuario(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Usuario actualizado exitosamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/admin-dashboard/usuarios');
    } catch (editError) {
      notifications.show(`Error al actualizar usuario. Razón: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <UsuariosForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Guardar Cambios"
      backButtonPath={`/admin-dashboard/usuarios/${usuarioId}`}
      isEdit={true}
    />
  );
}

UsuariosEditForm.propTypes = {
  initialValues: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    rol: PropTypes.oneOf(['admin', 'cliente', 'repartidor']),
    confirmed: PropTypes.bool,
    blocked: PropTypes.bool,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function UsuariosEdit() {
  const { usuarioId } = useParams();
  const [usuario, setUsuario] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getUsuario(Number(usuarioId));
      setUsuario(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [usuarioId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues) => {
      const updatedData = await updateUsuario(Number(usuarioId), formValues);
      setUsuario(updatedData);
    },
    [usuarioId],
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

    return usuario ? (
      <UsuariosEditForm initialValues={usuario} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, usuario, handleSubmit]);

  return (
    <PageContainer
      title={`Editar Usuario #${usuarioId}`}
      breadcrumbs={[
        { title: 'Usuarios', path: '/admin-dashboard/usuarios' },
        { title: `Usuario #${usuarioId}`, path: `/admin-dashboard/usuarios/${usuarioId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}