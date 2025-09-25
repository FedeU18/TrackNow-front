import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Perfil</Text>
      <Text>Acá podrías mostrar la info del usuario, configuración, etc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
