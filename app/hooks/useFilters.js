import { useState, useEffect } from 'react';

export const useFilters = (data) => {
    const [filtros, setFiltros] = useState({
        estado: "todos",
        categoria: "todos", 
        repartidor: "todos",
        fechaRango: "todos"
    });
    
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [pedidosFiltrados, setPedidosFiltrados] = useState(data);

    // Función centralizada de filtrado
    useEffect(() => {
        let pedidosTemp = [...data];

        // Filtro por Estado
        if (filtros.estado !== "todos") {
            pedidosTemp = pedidosTemp.filter(pedido => 
                pedido.attributes.estado_pedido?.data?.attributes?.nombre === filtros.estado
            );
        }

        // Filtro por Categoría
        if (filtros.categoria !== "todos") {
            pedidosTemp = pedidosTemp.filter(pedido => 
                pedido.attributes.categoria === filtros.categoria
            );
        }

        // Filtro por Repartidor
        if (filtros.repartidor !== "todos") {
            pedidosTemp = pedidosTemp.filter(pedido => 
                pedido.attributes.repartidor?.data?.attributes?.nombre === filtros.repartidor
            );
        }

        // Filtro por Fecha Específica
        if (fechaSeleccionada) {
            pedidosTemp = pedidosTemp.filter(pedido => {
                const fechaPedido = new Date(pedido.attributes.createdAt);
                const fechaComparar = new Date(fechaSeleccionada);
                return fechaPedido.toDateString() === fechaComparar.toDateString();
            });
        }

        // Filtro por Rango de Fecha
        if (filtros.fechaRango !== "todos") {
            const hoy = new Date();
            pedidosTemp = pedidosTemp.filter(pedido => {
                const fechaPedido = new Date(pedido.attributes.createdAt);
                
                switch(filtros.fechaRango) {
                    case "hoy":
                        return fechaPedido.toDateString() === hoy.toDateString();
                    case "ayer":
                        const ayer = new Date(hoy);
                        ayer.setDate(hoy.getDate() - 1);
                        return fechaPedido.toDateString() === ayer.toDateString();
                    case "semana":
                        const inicioSemana = new Date(hoy);
                        inicioSemana.setDate(hoy.getDate() - 7);
                        return fechaPedido >= inicioSemana;
                    case "mes":
                        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                        return fechaPedido >= inicioMes;
                    default:
                        return true;
                }
            });
        }

        setPedidosFiltrados(pedidosTemp);
    }, [filtros, fechaSeleccionada, data]);

    const updateFiltro = (tipo, valor) => {
        setFiltros(prev => ({ ...prev, [tipo]: valor }));
    };

    const seleccionarFecha = (dia, mes, año) => {
        const fecha = new Date(año, mes - 1, dia);
        setFechaSeleccionada(fecha);
    };

    const limpiarFiltros = () => {
        setFiltros({
            estado: "todos",
            categoria: "todos", 
            repartidor: "todos",
            fechaRango: "todos"
        });
        setFechaSeleccionada(null);
    };

    return {
        filtros,
        fechaSeleccionada,
        pedidosFiltrados,
        updateFiltro,
        seleccionarFecha,
        limpiarFiltros
    };
};