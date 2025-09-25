import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function RepartidoresScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Repartidores</Text>
      <Text>Esta pantalla está en construcción 🚧</Text>
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
