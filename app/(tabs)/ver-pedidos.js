// import axios from "axios"; // Descomentar cuando trabajemos con la API
// import { useRouter } from "expo-router"; // Descomentar cuando trabajemos con la API
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { mockPedidos } from "../constants/mockData"; // Borrar cuando trabajemos con la API
import FilterSection from "../components/FilterSection";
import OrderCard from "../components/OrderCard";
import { useMenus } from "../hooks/useMenus";
import { useFilters } from "../hooks/useFilters";
import { verPedidosStyles } from "../styles/verPedidosStyles";

export default function VerPedidosScreen() {
    const [pedidos] = useState(mockPedidos);
    
    // Hooks personalizados
    const { menus, setMenuVisible } = useMenus();
    const { 
        filtros, 
        fechaSeleccionada, 
        pedidosFiltrados, 
        updateFiltro, 
        seleccionarFecha, 
        limpiarFiltros 
    } = useFilters(pedidos);

    return (
        <ScrollView style={verPedidosStyles.container}>
            <Text variant="headlineMedium" style={verPedidosStyles.title}>
                Ver Pedidos
            </Text>

            <FilterSection
                filtros={filtros}
                fechaSeleccionada={fechaSeleccionada}
                menus={menus}
                setMenuVisible={setMenuVisible}
                updateFiltro={updateFiltro}
                seleccionarFecha={seleccionarFecha}
                limpiarFiltros={limpiarFiltros}
                styles={verPedidosStyles}
            />

            {/* Resultados */}
            {pedidosFiltrados.length === 0 ? (
                <Card style={verPedidosStyles.card}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={verPedidosStyles.noResults}>
                            No se encontraron pedidos con los filtros seleccionados.
                        </Text>
                    </Card.Content>
                </Card>
            ) : (
                pedidosFiltrados.map((pedido) => (
                    <OrderCard 
                        key={pedido.id} 
                        pedido={pedido} 
                        styles={verPedidosStyles} 
                    />
                ))
            )}
        </ScrollView>
    );
}