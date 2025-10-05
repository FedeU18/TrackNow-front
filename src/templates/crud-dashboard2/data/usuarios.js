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
      filterModel.items.forEach((filter) => {
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
            default:
              params.append(`filters[${filter.field}][$contains]`, filter.value);
          }
        }
      });
    }
    
    const response = await api.get(`/users?${params.toString()}`);
    
    return {
      items: response.data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        rol: user.rol || 'cliente',
        confirmed: user.confirmed,
        blocked: user.blocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      itemCount: response.data.length,
    };
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
}

// Obtener un usuario específico
export async function getOne(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    const user = response.data;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      rol: user.rol || 'cliente',
      confirmed: user.confirmed,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
}

// Crear un nuevo usuario
export async function createOne(data) {
  try {
    const response = await api.post('/auth/local/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      rol: data.rol || 'cliente',
    });
    
    const user = response.data.user;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      rol: user.rol,
      confirmed: user.confirmed,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
}

// Actualizar un usuario
export async function updateOne(userId, data) {
  try {
    const response = await api.put(`/users/${userId}`, {
      username: data.username,
      email: data.email,
      name: data.name,
      phone: data.phone,
      rol: data.rol,
      confirmed: data.confirmed,
      blocked: data.blocked,
    });
    
    const user = response.data;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      rol: user.rol,
      confirmed: user.confirmed,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
}

// Eliminar un usuario
export async function deleteOne(userId) {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
}

// Obtener lista de usuarios para selección (solo nombres y IDs)
export async function getUsersForSelection() {
  try {
    const response = await api.get('/users?fields[0]=id&fields[1]=username&fields[2]=name&fields[3]=email&fields[4]=rol');
    
    return response.data.map(user => ({
      id: user.id,
      label: `${user.name || user.username} (${user.email})`,
      username: user.username,
      name: user.name,
      email: user.email,
      rol: user.rol,
    }));
  } catch (error) {
    console.error('Error obteniendo usuarios para selección:', error);
    throw error;
  }
}

// Validación de usuarios
export function validate(user) {
  let issues = [];

  if (!user.username) {
    issues.push({ message: 'El nombre de usuario es requerido', path: ['username'] });
  }

  if (!user.email) {
    issues.push({ message: 'El email es requerido', path: ['email'] });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    issues.push({ message: 'El email debe tener un formato válido', path: ['email'] });
  }

  if (!user.name) {
    issues.push({ message: 'El nombre es requerido', path: ['name'] });
  }

  if (!user.password && !user.id) {
    issues.push({ message: 'La contraseña es requerida', path: ['password'] });
  } else if (user.password && user.password.length < 6) {
    issues.push({ message: 'La contraseña debe tener al menos 6 caracteres', path: ['password'] });
  }

  if (!user.rol) {
    issues.push({ message: 'El rol es requerido', path: ['rol'] });
  } else if (!['admin', 'cliente', 'repartidor'].includes(user.rol)) {
    issues.push({
      message: 'El rol debe ser "admin", "cliente" o "repartidor"',
      path: ['rol'],
    });
  }

  return { issues };
}