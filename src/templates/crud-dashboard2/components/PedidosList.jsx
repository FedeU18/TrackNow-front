import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deletePedido,
  getMany as getPedidos,
} from '../data/pedidos';

import PageContainer from './PageContainer';

const INITIAL_PAGE_SIZE = 10;

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

export default function PedidosList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState(
    searchParams.get('filter')
      ? JSON.parse(searchParams.get('filter') ?? '')
      : { items: [] },
  );
  const [sortModel, setSortModel] = React.useState(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  );

  const [rowsState, setRowsState] = React.useState({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handlePaginationModelChange = React.useCallback(
    (model) => {
      setPaginationModel(model);

      searchParams.set('page', String(model.page));
      searchParams.set('pageSize', String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleFilterModelChange = React.useCallback(
    (model) => {
      setFilterModel(model);

      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set('filter', JSON.stringify(model));
      } else {
        searchParams.delete('filter');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleSortModelChange = React.useCallback(
    (model) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set('sort', JSON.stringify(model));
      } else {
        searchParams.delete('sort');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getPedidos({
        paginationModel,
        sortModel,
        filterModel,
      });

      setRowsState({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (listDataError) {
      setError(listDataError);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/admin-dashboard/pedidos/${row.id}`);
    },
    [navigate],
  );

  const handleCreateClick = React.useCallback(() => {
    navigate('/admin-dashboard/pedidos/new');
  }, [navigate]);



  const handleRowView = React.useCallback(
    (pedido) => () => {
      navigate(`/admin-dashboard/pedidos/${pedido.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (pedido) => () => {
      navigate(`/admin-dashboard/pedidos/${pedido.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (pedido) => async () => {
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
          await deletePedido(Number(pedido.id));

          notifications.show('Pedido eliminado exitosamente.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
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
    },
    [dialogs, notifications, loadData],
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      {
        field: 'direccion_origen',
        headerName: 'Origen',
        width: 200,
        renderCell: (params) => (
          <Tooltip title={params.value} placement="top">
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {params.value}
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'direccion_destino',
        headerName: 'Destino',
        width: 200,
        renderCell: (params) => (
          <Tooltip title={params.value} placement="top">
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {params.value}
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'cliente',
        headerName: 'Cliente',
        width: 160,
        valueGetter: (value) => {
          if (!value) return 'Sin asignar';
          return value.name || value.username || 'Sin nombre';
        },
        renderCell: (params) => {
          const cliente = params.row.cliente;
          if (!cliente) return 'Sin asignar';
          
          const displayName = cliente.name || cliente.username;
          return (
            <Tooltip title={`${displayName} (${cliente.email})`} placement="top">
              <span>{displayName}</span>
            </Tooltip>
          );
        },
      },
      {
        field: 'repartidor',
        headerName: 'Repartidor',
        width: 160,
        valueGetter: (value) => {
          if (!value) return 'Sin asignar';
          return value.name || value.username || 'Sin nombre';
        },
        renderCell: (params) => {
          const repartidor = params.row.repartidor;
          if (!repartidor) return 'Sin asignar';
          
          const displayName = repartidor.name || repartidor.username;
          return (
            <Tooltip title={`${displayName} (${repartidor.email})`} placement="top">
              <span>{displayName}</span>
            </Tooltip>
          );
        },
      },
      {
        field: 'estado',
        headerName: 'Estado',
        width: 120,
        type: 'singleSelect',
        valueOptions: ['Pendiente', 'En curso', 'Entregado', 'Cancelado'],
        renderCell: (params) => {
          const { color, label } = getEstadoColor(params.value);
          return <Chip label={label} color={color} size="small" />;
        },
      },
      {
        field: 'fecha_creacion',
        headerName: 'Fecha Creación',
        type: 'dateTime',
        width: 160,
        valueGetter: (value) => value && new Date(value),
        renderCell: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        },
      },
      {
        field: 'fecha_entrega',
        headerName: 'Fecha Entrega',
        type: 'dateTime',
        width: 160,
        valueGetter: (value) => value && new Date(value),
        renderCell: (params) => {
          if (!params.value) return 'Sin definir';
          return new Date(params.value).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view-item"
            icon={<VisibilityIcon />}
            label="Ver"
            onClick={handleRowView(row)}
            showInMenu
          />,
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Editar"
            onClick={handleRowEdit(row)}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={handleRowDelete(row)}
            showInMenu
          />,
        ],
      },
    ],
    [handleRowView, handleRowEdit, handleRowDelete],
  );

  const pageTitle = 'Pedidos';

  return (
    <PageContainer
      title={pageTitle}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Recargar datos" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Nuevo Pedido
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount}
            columns={columns}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}