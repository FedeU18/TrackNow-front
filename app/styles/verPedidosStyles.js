import { StyleSheet } from 'react-native';

export const verPedidosStyles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    filtrosContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    filtroLabel: {
        marginTop: 12,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#333',
    },
    filterButton: {
        marginBottom: 15,
        alignSelf: 'flex-start',
        minWidth: 200,
    },
    fechaSelectedContainer: {
        marginBottom: 15,
    },
    fechaChip: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    fechaSelectorContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    fechaButton: {
        flex: 1,
        maxWidth: 80,
    },
    fechaSeleccionadaText: {
        marginTop: 10,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    clearButton: {
        paddingHorizontal: 20,
    },
    divider: {
        marginTop: 20,
        backgroundColor: '#ddd',
    },
    card: {
        marginBottom: 10,
    },
    pedidoCard: {
        marginBottom: 15,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    pedidoId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    estadoChip: {
        paddingHorizontal: 8,
    },
    estadoChipText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    pedidoInfo: {
        gap: 5,
    },
    pedidoDetalle: {
        fontSize: 14,
        lineHeight: 20,
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    estado: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    fecha: {
        marginTop: 10,
        color: '#666',
    },
    noResults: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
        fontSize: 16,
        padding: 20,
    },
});