import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createOne as createUsuario,
  validate as validateUsuario,
} from '../data/usuarios';
import UsuariosForm from './UsuariosForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES = {
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  rol: 'cliente',
  confirmed: false,
  blocked: false,
};

export default function UsuariosCreate() {
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createUsuario(formValues);
      notifications.show('Usuario creado exitosamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/admin-dashboard/usuarios');
    } catch (createError) {
      notifications.show(
        `Error al crear usuario. Razón: ${createError.message}`,
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
      title="Nuevo Usuario"
      breadcrumbs={[
        { title: 'Usuarios', path: '/admin-dashboard/usuarios' }, 
        { title: 'Nuevo' }
      ]}
    >
      <UsuariosForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Crear Usuario"
        backButtonPath="/admin-dashboard/usuarios"
        isEdit={false}
      />
    </PageContainer>
  );
}