// Constantes para las opciones de filtros

export const FILTER_OPTIONS = {
    estados: [
        { value: "todos", label: "Todos los estados" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "En proceso", label: "En proceso" },
        { value: "Completado", label: "Completado" },
        { value: "Cancelado", label: "Cancelado" }
    ],
    
    categorias: [
        { value: "todos", label: "Todas las categorías" },
        { value: "Comida", label: "Comida" },
        { value: "Farmacia", label: "Farmacia" },
        { value: "Supermercado", label: "Supermercado" },
        { value: "Electrónicos", label: "Electrónicos" }
    ],
    
    repartidores: [
        { value: "todos", label: "Todos los repartidores" },
        { value: "Carlos Delivery", label: "Carlos Delivery" },
        { value: "María Transporte", label: "María Transporte" },
        { value: "Pedro Express", label: "Pedro Express" },
        { value: "Ana Rápida", label: "Ana Rápida" }
    ],
    
    fechasRango: [
        { value: "todos", label: "Cualquier fecha" },
        { value: "hoy", label: "Hoy" },
        { value: "ayer", label: "Ayer" },
        { value: "semana", label: "Última semana" },
        { value: "mes", label: "Este mes" }
    ]
};

export const MESES = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
];

// Genera array de días (1-31)
export const getDias = () => Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString()
}));

// Genera array de años (últimos 10 años)
export const getAños = () => Array.from({ length: 10 }, (_, i) => {
    const año = new Date().getFullYear() - i;
    return {
        value: año,
        label: año.toString()
    };
});