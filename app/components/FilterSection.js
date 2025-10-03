import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import FilterMenu from './FilterMenu';
import { FILTER_OPTIONS, MESES, getDias, getAños } from '../constants/filterOptions';

const FilterSection = ({ 
    filtros, 
    fechaSeleccionada,
    menus, 
    setMenuVisible, 
    updateFiltro, 
    seleccionarFecha,
    limpiarFiltros,
    styles 
}) => {
    const getLabelForFechaRango = (value) => {
        const option = FILTER_OPTIONS.fechasRango.find(item => item.value === value);
        return option ? option.label : "Cualquier fecha";
    };

    return (
        <View style={styles.filtrosContainer}>
            {/* Filtro por Estado */}
            <Text variant="labelMedium" style={styles.filtroLabel}>Estado:</Text>
            <FilterMenu
                visible={menus.estado}
                setVisible={(visible) => setMenuVisible('estado', visible)}
                value={filtros.estado}
                options={FILTER_OPTIONS.estados}
                onSelect={(value) => updateFiltro('estado', value)}
                placeholder="Todos los estados"
                style={styles.filterButton}
            />

            {/* Filtro por Categoría */}
            <Text variant="labelMedium" style={styles.filtroLabel}>Categoría:</Text>
            <FilterMenu
                visible={menus.categoria}
                setVisible={(visible) => setMenuVisible('categoria', visible)}
                value={filtros.categoria}
                options={FILTER_OPTIONS.categorias}
                onSelect={(value) => updateFiltro('categoria', value)}
                placeholder="Todas las categorías"
                style={styles.filterButton}
            />

            {/* Filtro por Repartidor */}
            <Text variant="labelMedium" style={styles.filtroLabel}>Repartidor:</Text>
            <FilterMenu
                visible={menus.repartidor}
                setVisible={(visible) => setMenuVisible('repartidor', visible)}
                value={filtros.repartidor}
                options={FILTER_OPTIONS.repartidores}
                onSelect={(value) => updateFiltro('repartidor', value)}
                placeholder="Todos los repartidores"
                style={styles.filterButton}
            />

            {/* Selector de fecha específica */}
            <Text variant="labelMedium" style={styles.filtroLabel}>
                Buscar por fecha específica:
            </Text>
            
            <View style={styles.fechaSelectorContainer}>
                {/* Selector de Día */}
                <FilterMenu
                    visible={menus.dia}
                    setVisible={(visible) => setMenuVisible('dia', visible)}
                    value={fechaSeleccionada ? fechaSeleccionada.getDate().toString() : "todos"}
                    options={getDias()}
                    onSelect={(dia) => {
                        const fechaActual = fechaSeleccionada || new Date();
                        seleccionarFecha(dia, fechaActual.getMonth() + 1, fechaActual.getFullYear());
                    }}
                    placeholder="Día"
                    style={styles.fechaButton}
                    compact={true}
                />

                {/* Selector de Mes */}
                <FilterMenu
                    visible={menus.mes}
                    setVisible={(visible) => setMenuVisible('mes', visible)}
                    value={fechaSeleccionada ? MESES[fechaSeleccionada.getMonth()].nombre : "Mes"}
                    options={MESES.map(mes => ({ value: mes.valor, label: mes.nombre }))}
                    onSelect={(mes) => {
                        const fechaActual = fechaSeleccionada || new Date();
                        seleccionarFecha(fechaActual.getDate(), mes, fechaActual.getFullYear());
                    }}
                    placeholder="Mes"
                    style={styles.fechaButton}
                    compact={true}
                />

                {/* Selector de Año */}
                <FilterMenu
                    visible={menus.año}
                    setVisible={(visible) => setMenuVisible('año', visible)}
                    value={fechaSeleccionada ? fechaSeleccionada.getFullYear().toString() : "todos"}
                    options={getAños()}
                    onSelect={(año) => {
                        const fechaActual = fechaSeleccionada || new Date();
                        seleccionarFecha(fechaActual.getDate(), fechaActual.getMonth() + 1, año);
                    }}
                    placeholder="Año"
                    style={styles.fechaButton}
                    compact={true}
                />
            </View>

            {fechaSeleccionada && (
                <Text variant="bodyMedium" style={styles.fechaSeleccionadaText}>
                    Fecha seleccionada: {fechaSeleccionada.toLocaleDateString()}
                </Text>
            )}

            {/* Filtro por Rango de Fecha */}
            <Text variant="labelMedium" style={styles.filtroLabel}>Rango de fecha:</Text>
            <FilterMenu
                visible={menus.fecha}
                setVisible={(visible) => setMenuVisible('fecha', visible)}
                value={getLabelForFechaRango(filtros.fechaRango)}
                options={FILTER_OPTIONS.fechasRango}
                onSelect={(value) => updateFiltro('fechaRango', value)}
                placeholder="Cualquier fecha"
                style={styles.filterButton}
            />

            {/* Botón para limpiar filtros */}
            <Button 
                mode="outlined" 
                onPress={limpiarFiltros}
                style={styles.clearButton}
                icon="filter-remove"
            >
                Limpiar filtros
            </Button>
        </View>
    );
};

export default FilterSection;