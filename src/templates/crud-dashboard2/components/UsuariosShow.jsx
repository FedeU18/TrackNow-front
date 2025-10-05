import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteUsuario,
  getOne as getUsuario,
} from '../data/usuarios';
import PageContainer from './PageContainer';

const getRolColor = (rol) => {
  switch (rol) {
    case 'admin':
      return { color: 'error', label: 'Admin' };
    case 'repartidor':
      return { color: 'info', label: 'Repartidor' };
    case 'cliente':
      return { color: 'success', label: 'Cliente' };
    default:
      return { color: 'default', label: rol };
  }
};

const getStatusColor = (confirmed, blocked) => {
  if (blocked) return { color: 'error', label: 'Bloqueado' };
  if (!confirmed) return { color: 'warning', label: 'Sin confirmar' };
  return { color: 'success', label: 'Activo' };
};

export default function UsuariosShow() {
  const { usuarioId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

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

  const handleUsuarioEdit = React.useCallback(() => {
    navigate(`/admin-dashboard/usuarios/${usuarioId}/edit`);
  }, [navigate, usuarioId]);

  const handleUsuarioDelete = React.useCallback(async () => {
    if (!usuario) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `¿Deseas eliminar al usuario "${usuario.name || usuario.username}"?`,
      {
        title: `¿Eliminar usuario?`,
        severity: 'error',
        okText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteUsuario(Number(usuarioId));

        navigate('/admin-dashboard/usuarios');

        notifications.show('Usuario eliminado exitosamente.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Error al eliminar usuario. Razón: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [usuario, dialogs, usuarioId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/admin-dashboard/usuarios');
  }, [navigate]);

  const renderShow = React.useMemo(() => {
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
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        {/* Header con nombre */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                {usuario.name || usuario.username}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={getRolColor(usuario.rol).label} 
                  color={getRolColor(usuario.rol).color} 
                  size="medium" 
                />
                <Chip 
                  label={getStatusColor(usuario.confirmed, usuario.blocked).label} 
                  color={getStatusColor(usuario.confirmed, usuario.blocked).color} 
                  size="medium" 
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={3} sx={{ width: '100%' }}>
          {/* Información básica */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                ID de Usuario
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                #{usuario.id}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <BadgeIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Nombre de Usuario
                </Typography>
              </Stack>
              <Typography variant="body1">
                {usuario.username || 'No especificado'}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <PersonIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Nombre Completo
                </Typography>
              </Stack>
              <Typography variant="body1">
                {usuario.name || 'No especificado'}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <EmailIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Email
                </Typography>
              </Stack>
              <Typography variant="body1">
                {usuario.email || 'No especificado'}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <PhoneIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Teléfono
                </Typography>
              </Stack>
              <Typography variant="body1">
                {usuario.phone || 'No especificado'}
              </Typography>
            </Paper>
          </Grid>

          {/* Estado de la cuenta */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Cuenta Confirmada
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {usuario.confirmed ? 'Sí' : 'No'}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Cuenta Bloqueada
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {usuario.blocked ? 'Sí' : 'No'}
              </Typography>
            </Paper>
          </Grid>

          {/* Fechas del sistema */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Fecha de Registro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.createdAt 
                  ? dayjs(usuario.createdAt).format('DD/MM/YYYY HH:mm')
                  : 'No disponible'
                }
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Última Actualización
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.updatedAt 
                  ? dayjs(usuario.updatedAt).format('DD/MM/YYYY HH:mm')
                  : 'No disponible'
                }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Volver
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleUsuarioEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleUsuarioDelete}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [
    isLoading,
    error,
    usuario,
    handleBack,
    handleUsuarioEdit,
    handleUsuarioDelete,
  ]);

  const pageTitle = `Usuario #${usuarioId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Usuarios', path: '/admin-dashboard/usuarios' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}