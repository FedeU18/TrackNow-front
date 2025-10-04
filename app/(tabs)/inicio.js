import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function InicioScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                TrackNow
            </Text>
            <Text style={styles.subtitle}>
                Tu solución de seguimiento de paquetes
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 32,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#4b5563',
        marginBottom: 48,
        textAlign: 'center',
    },
});