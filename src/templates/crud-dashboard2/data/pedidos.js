import api from '../../../services/api';

export async function getMany({ paginationModel, filterModel, sortModel }) {
  try {
    const params = new URLSearchParams();
    
    if (paginationModel) {
      params.append('pagination[page]', paginationModel.page + 1);
      params.append('pagination[pageSize]', paginationModel.pageSize);
    }
    
    if (sortModel && sortModel.length > 0) {
      sortModel.forEach((sort) => {
        const sortDirection = sort.sort === 'asc' ? 'asc' : 'desc';
        params.append('sort', `${sort.field}:${sortDirection}`);
      });
    }
    
    if (filterModel && filterModel.items && filterModel.items.length > 0) {
      filterModel.items.forEach((filter, index) => {
        if (filter.field && filter.value) {
          switch (filter.operator) {
            case 'contains':
              params.append(`filters[${filter.field}][$contains]`, filter.value);
              break;
            case 'equals':
              params.append(`filters[${filter.field}][$eq]`, filter.value);
              break;
            case 'startsWith':
              params.append(`filters[${filter.field}][$startsWith]`, filter.value);
              break;
            case 'endsWith':
              params.append(`filters[${filter.field}][$endsWith]`, filter.value);
              break;
            case '>':
              params.append(`filters[${filter.field}][$gt]`, filter.value);
              break;
            case '<':
              params.append(`filters[${filter.field}][$lt]`, filter.value);
              break;
            default:
              params.append(`filters[${filter.field}][$contains]`, filter.value);
          }
        }
      });
    }
    
    params.append('populate[id_cliente][fields][0]', 'username');
    params.append('populate[id_cliente][fields][1]', 'email');
    params.append('populate[id_cliente][fields][2]', 'name');
    params.append('populate[id_cliente][fields][3]', 'lastname');
    params.append('populate[id_repartidor][fields][0]', 'username');
    params.append('populate[id_repartidor][fields][1]', 'email');
    params.append('populate[id_repartidor][fields][2]', 'name');
    params.append('populate[id_repartidor][fields][3]', 'lastname');
    
    const response = await api.get(`/pedidos?${params.toString()}`);
    
    return {
      items: response.data.data.map(pedido => ({
        id: pedido.id,
        direccion_origen: pedido.direccion_origen,
        direccion_destino: pedido.direccion_destino,
        estado: pedido.estado,
        fecha_creacion: pedido.fecha_creacion,
        fecha_entrega: pedido.fecha_entrega,
        cliente: pedido.id_cliente ? {
          id: pedido.id_cliente.id,
          username: pedido.id_cliente.username || 'N/A',
          email: pedido.id_cliente.email || 'N/A',
          name: `${pedido.id_cliente.name || ''} ${pedido.id_cliente.lastname || ''}`.trim() || pedido.id_cliente.username || 'N/A',
        } : null,
        repartidor: pedido.id_repartidor ? {
          id: pedido.id_repartidor.id,
          username: pedido.id_repartidor.username || 'N/A',
          email: pedido.id_repartidor.email || 'N/A',
          name: `${pedido.id_repartidor.name || ''} ${pedido.id_repartidor.lastname || ''}`.trim() || pedido.id_repartidor.username || 'N/A',
        } : null,
        createdAt: pedido.createdAt,
        updatedAt: pedido.updatedAt,
      })),
      itemCount: response.data.meta?.pagination?.total || response.data.data.length,
    };
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw error;
  }
}

// Obtener un pedido específico
export async function getOne(pedidoId) {
  try {
    const response = await api.get(`/pedidos/${pedidoId}?populate=*`);
    const pedido = response.data.data;
    
    return {
      id: pedido.id,
      direccion_origen: pedido.direccion_origen,
      direccion_destino: pedido.direccion_destino,
      estado: pedido.estado,
      fecha_creacion: pedido.fecha_creacion,
      fecha_entrega: pedido.fecha_entrega,
      cliente: pedido.id_cliente ? {
        id: pedido.id_cliente.id,
        username: pedido.id_cliente.username || 'N/A',
        email: pedido.id_cliente.email || 'N/A',
        name: `${pedido.id_cliente.name || ''} ${pedido.id_cliente.lastname || ''}`.trim() || pedido.id_cliente.username || 'N/A',
      } : null,
      repartidor: pedido.id_repartidor ? {
        id: pedido.id_repartidor.id,
        username: pedido.id_repartidor.username || 'N/A',
        email: pedido.id_repartidor.email || 'N/A',
        name: `${pedido.id_repartidor.name || ''} ${pedido.id_repartidor.lastname || ''}`.trim() || pedido.id_repartidor.username || 'N/A',
      } : null,
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt,
    };
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    throw error;
  }
}

// Crear un nuevo pedido
export async function createOne(data) {
  try {
    const response = await api.post('/pedidos', {
      data: {
        direccion_origen: data.direccion_origen,
        direccion_destino: data.direccion_destino,
        estado: data.estado || 'Pendiente',
        fecha_creacion: data.fecha_creacion || new Date().toISOString(),
        fecha_entrega: data.fecha_entrega || null,
        id_cliente: data.cliente_id,
        id_repartidor: data.repartidor_id || null,
      }
    });
    
    const pedido = response.data.data;
    return {
      id: pedido.id,
      direccion_origen: pedido.attributes.direccion_origen,
      direccion_destino: pedido.attributes.direccion_destino,
      estado: pedido.attributes.estado,
      fecha_creacion: pedido.attributes.fecha_creacion,
      fecha_entrega: pedido.attributes.fecha_entrega,
      createdAt: pedido.attributes.createdAt,
      updatedAt: pedido.attributes.updatedAt,
    };
  } catch (error) {
    console.error('Error creando pedido:', error);
    throw error;
  }
}

// Actualizar un pedido
export async function updateOne(pedidoId, data) {
  try {
    const response = await api.put(`/pedidos/${pedidoId}`, {
      data: {
        direccion_origen: data.direccion_origen,
        direccion_destino: data.direccion_destino,
        estado: data.estado,
        fecha_creacion: data.fecha_creacion,
        fecha_entrega: data.fecha_entrega,
        id_cliente: data.cliente_id,
        id_repartidor: data.repartidor_id,
      }
    });
    
    const pedido = response.data.data;
    return {
      id: pedido.id,
      direccion_origen: pedido.attributes.direccion_origen,
      direccion_destino: pedido.attributes.direccion_destino,
      estado: pedido.attributes.estado,
      fecha_creacion: pedido.attributes.fecha_creacion,
      fecha_entrega: pedido.attributes.fecha_entrega,
      createdAt: pedido.attributes.createdAt,
      updatedAt: pedido.attributes.updatedAt,
    };
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    throw error;
  }
}

// Eliminar un pedido
export async function deleteOne(pedidoId) {
  try {
    await api.delete(`/pedidos/${pedidoId}`);
  } catch (error) {
    console.error('Error eliminando pedido:', error);
    throw error;
  }
}

// Validación de pedidos
export function validate(pedido) {
  let issues = [];

  if (!pedido.direccion_origen) {
    issues.push({ message: 'La dirección de origen es requerida', path: ['direccion_origen'] });
  }

  if (!pedido.direccion_destino) {
    issues.push({ message: 'La dirección de destino es requerida', path: ['direccion_destino'] });
  }

  if (!pedido.cliente_id) {
    issues.push({ message: 'El cliente es requerido', path: ['cliente_id'] });
  }

  if (!pedido.estado) {
    issues.push({ message: 'El estado es requerido', path: ['estado'] });
  } else if (!['Pendiente', 'En curso', 'Entregado', 'Cancelado'].includes(pedido.estado)) {
    issues.push({
      message: 'El estado debe ser "Pendiente", "En curso", "Entregado" o "Cancelado"',
      path: ['estado'],
    });
  }

  return { issues };
}