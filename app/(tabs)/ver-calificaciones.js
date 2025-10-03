import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function VerCalificacionesScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Ver calificaciones
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Disponible próximamente
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
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
});