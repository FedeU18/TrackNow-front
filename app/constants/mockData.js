// Datos mockeados para desarrollo y pruebas
export const mockPedidos = [
  // Pedidos Pendientes
  {
    id: 1,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Pendiente"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Juan Pérez"
          }
        }
      },
      repartidor: {
        data: {
          id: 1,
          attributes: {
            nombre: "Carlos Delivery"
          }
        }
      },
      categoria: "Comida",
      createdAt: "2025-10-01T10:30:00Z",
      total: 2500,
      direccion: "Av. Corrientes 1234"
    }
  },
  {
    id: 2,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Pendiente"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Laura Fernández"
          }
        }
      },
      repartidor: {
        data: {
          id: 2,
          attributes: {
            nombre: "María Transporte"
          }
        }
      },
      categoria: "Farmacia",
      createdAt: "2025-10-01T16:45:00Z",
      total: 1950,
      direccion: "Rivadavia 2456"
    }
  },
  // Pedidos En Proceso
  {
    id: 3,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "En proceso"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "María García"
          }
        }
      },
      repartidor: {
        data: {
          id: 1,
          attributes: {
            nombre: "Carlos Delivery"
          }
        }
      },
      categoria: "Supermercado",
      createdAt: "2025-10-02T14:15:00Z",
      total: 3200,
      direccion: "San Martín 567"
    }
  },
  {
    id: 4,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "En proceso"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Roberto Silva"
          }
        }
      },
      repartidor: {
        data: {
          id: 3,
          attributes: {
            nombre: "Pedro Express"
          }
        }
      },
      categoria: "Comida",
      createdAt: "2025-10-02T11:20:00Z",
      total: 2750,
      direccion: "9 de Julio 789"
    }
  },
  // Pedidos Completados
  {
    id: 5,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Completado"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Carlos López"
          }
        }
      },
      repartidor: {
        data: {
          id: 2,
          attributes: {
            nombre: "María Transporte"
          }
        }
      },
      categoria: "Farmacia",
      createdAt: "2025-09-30T09:45:00Z",
      total: 1800,
      direccion: "Mitre 890"
    }
  },
  {
    id: 6,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Completado"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Sofia Martínez"
          }
        }
      },
      repartidor: {
        data: {
          id: 4,
          attributes: {
            nombre: "Ana Rápida"
          }
        }
      },
      categoria: "Electrónicos",
      createdAt: "2025-09-29T13:30:00Z",
      total: 4350,
      direccion: "Independencia 1523"
    }
  },
  // Pedidos Cancelados
  {
    id: 7,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Cancelado"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Ana Rodríguez"
          }
        }
      },
      repartidor: {
        data: {
          id: 3,
          attributes: {
            nombre: "Pedro Express"
          }
        }
      },
      categoria: "Supermercado",
      createdAt: "2025-10-03T16:20:00Z",
      total: 4100,
      direccion: "Belgrano 321"
    }
  },
  {
    id: 8,
    attributes: {
      estado_pedido: {
        data: {
          attributes: {
            nombre: "Cancelado"
          }
        }
      },
      cliente: {
        data: {
          attributes: {
            nombre: "Diego Morales"
          }
        }
      },
      repartidor: {
        data: {
          id: 4,
          attributes: {
            nombre: "Ana Rápida"
          }
        }
      },
      categoria: "Comida",
      createdAt: "2025-10-03T18:15:00Z",
      total: 3650,
      direccion: "Sarmiento 654"
    }
  }
];

