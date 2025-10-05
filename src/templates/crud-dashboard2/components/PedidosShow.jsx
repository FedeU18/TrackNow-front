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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deletePedido,
  getOne as getPedido,
} from '../data/pedidos';
import PageContainer from './PageContainer';

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Pendiente':
      return { color: 'warning', label: 'Pendiente' };
    case 'En curso':
      return { color: 'info', label: 'En Curso' };
    case 'Entregado':
      return { color: 'success', label: 'Entregado' };
    case 'Cancelado':
      return { color: 'error', label: 'Cancelado' };
    default:
      return { color: 'default', label: estado };
  }
};

export default function PedidosShow() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [pedido, setPedido] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getPedido(Number(pedidoId));
      setPedido(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [pedidoId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePedidoEdit = React.useCallback(() => {
    navigate(`/admin-dashboard/pedidos/${pedidoId}/edit`);
  }, [navigate, pedidoId]);

  const handlePedidoDelete = React.useCallback(async () => {
    if (!pedido) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `¿Deseas eliminar el pedido #${pedido.id}?`,
      {
        title: `¿Eliminar pedido?`,
        severity: 'error',
        okText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deletePedido(Number(pedidoId));

        navigate('/admin-dashboard/pedidos');

        notifications.show('Pedido eliminado exitosamente.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Error al eliminar pedido. Razón: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [pedido, dialogs, pedidoId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/admin-dashboard/pedidos');
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

    return pedido ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {/* ID y Estado */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                ID del Pedido
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                #{pedido.id}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Estado
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={getEstadoColor(pedido.estado).label} 
                  color={getEstadoColor(pedido.estado).color} 
                  size="medium" 
                />
              </Box>
            </Paper>
          </Grid>

          {/* Direcciones */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Dirección de Origen
                </Typography>
              </Stack>
              <Typography variant="body1">
                {pedido.direccion_origen || 'No especificada'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <LocationOnIcon color="secondary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Dirección de Destino
                </Typography>
              </Stack>
              <Typography variant="body1">
                {pedido.direccion_destino || 'No especificada'}
              </Typography>
            </Paper>
          </Grid>

          {/* Cliente */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <PersonIcon color="primary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Cliente
                </Typography>
              </Stack>
              {pedido.cliente ? (
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {pedido.cliente.name || pedido.cliente.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pedido.cliente.email}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Sin asignar
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Repartidor */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <DeliveryDiningIcon color="info" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Repartidor
                </Typography>
              </Stack>
              {pedido.repartidor ? (
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {pedido.repartidor.name || pedido.repartidor.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pedido.repartidor.email}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Sin asignar
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Fechas */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Fecha de Creación
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {pedido.fecha_creacion 
                  ? dayjs(pedido.fecha_creacion).format('DD/MM/YYYY HH:mm')
                  : 'No especificada'
                }
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Fecha de Entrega
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {pedido.fecha_entrega 
                  ? dayjs(pedido.fecha_entrega).format('DD/MM/YYYY HH:mm')
                  : 'Sin definir'
                }
              </Typography>
            </Paper>
          </Grid>

          {/* Información del sistema */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Creado en el sistema
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pedido.createdAt 
                  ? dayjs(pedido.createdAt).format('DD/MM/YYYY HH:mm')
                  : 'No disponible'
                }
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Última actualización
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pedido.updatedAt 
                  ? dayjs(pedido.updatedAt).format('DD/MM/YYYY HH:mm')
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
              onClick={handlePedidoEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handlePedidoDelete}
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
    pedido,
    handleBack,
    handlePedidoEdit,
    handlePedidoDelete,
  ]);

  const pageTitle = `Pedido #${pedidoId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Pedidos', path: '/admin-dashboard/pedidos' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}