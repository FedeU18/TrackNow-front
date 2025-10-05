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
  deleteOne as deleteUsuario,
  getMany as getUsuarios,
} from '../data/usuarios';
import PageContainer from './PageContainer';

const INITIAL_PAGE_SIZE = 10;

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

export default function UsuariosList() {
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
      const listData = await getUsuarios({
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
      navigate(`/admin-dashboard/usuarios/${row.id}`);
    },
    [navigate],
  );

  const handleCreateClick = React.useCallback(() => {
    navigate('/admin-dashboard/usuarios/new');
  }, [navigate]);

  const handleRowView = React.useCallback(
    (usuario) => () => {
      navigate(`/admin-dashboard/usuarios/${usuario.id}`);
    },
    [navigate],
  );

  const handleRowEdit = React.useCallback(
    (usuario) => () => {
      navigate(`/admin-dashboard/usuarios/${usuario.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (usuario) => async () => {
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
          await deleteUsuario(Number(usuario.id));

          notifications.show('Usuario eliminado exitosamente.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
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
        field: 'name',
        headerName: 'Nombre',
        width: 160,
        valueGetter: (value, row) => {
          return row.name || row.username || 'Sin nombre';
        },
      },
      {
        field: 'username',
        headerName: 'Usuario',
        width: 140,
      },
      {
        field: 'email',
        headerName: 'Email',
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
        field: 'phone',
        headerName: 'Teléfono',
        width: 140,
        renderCell: (params) => params.value || 'No especificado',
      },
      {
        field: 'rol',
        headerName: 'Rol',
        width: 120,
        type: 'singleSelect',
        valueOptions: ['admin', 'cliente', 'repartidor'],
        renderCell: (params) => {
          const { color, label } = getRolColor(params.value);
          return <Chip label={label} color={color} size="small" />;
        },
      },
      {
        field: 'status',
        headerName: 'Estado',
        width: 130,
        valueGetter: (value, row) => {
          if (row.blocked) return 'Bloqueado';
          if (!row.confirmed) return 'Sin confirmar';
          return 'Activo';
        },
        renderCell: (params) => {
          const status = getStatusColor(params.row.confirmed, params.row.blocked);
          return <Chip label={status.label} color={status.color} size="small" />;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Fecha Registro',
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

  const pageTitle = 'Usuarios';

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
            Nuevo Usuario
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