import React from 'react';
import { View } from 'react-native';
import { Card, Title, Paragraph, Chip, Text } from 'react-native-paper';

const OrderCard = ({ pedido, styles }) => {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Pendiente": return "#FF9800";
            case "En proceso": return "#2196F3";
            case "Completado": return "#4CAF50";
            case "Cancelado": return "#F44336";
            default: return "#757575";
        }
    };

    return (
        <Card style={styles.pedidoCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Title style={styles.pedidoId}>
                        Pedido #{pedido.id}
                    </Title>
                    <Chip 
                        style={[
                            styles.estadoChip, 
                            { backgroundColor: getEstadoColor(pedido.attributes.estado_pedido?.data?.attributes?.nombre || "Sin estado") }
                        ]}
                        textStyle={styles.estadoChipText}
                    >
                        {pedido.attributes.estado_pedido?.data?.attributes?.nombre || "Sin estado"}
                    </Chip>
                </View>
                
                <View style={styles.pedidoInfo}>
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Estado: </Text>
                        {pedido.attributes.estado_pedido?.data?.attributes?.nombre || "Sin estado"}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Cliente: </Text>
                        {pedido.attributes.cliente?.data?.attributes?.nombre || "N/A"}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Categoría: </Text>
                        {pedido.attributes.categoria || "N/A"}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Repartidor: </Text>
                        {pedido.attributes.repartidor?.data?.attributes?.nombre || "Sin asignar"}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Dirección: </Text>
                        {pedido.attributes.direccion || "N/A"}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Total: </Text>
                        ${pedido.attributes.total || 0}
                    </Text>
                    
                    <Text variant="bodyMedium" style={styles.pedidoDetalle}>
                        <Text style={styles.label}>Fecha: </Text>
                        {new Date(pedido.attributes.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default OrderCard;