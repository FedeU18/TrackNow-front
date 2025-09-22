import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Card, Paragraph, Title } from "react-native-paper";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia la IP por la de tu PC donde corre Strapi
    axios
      .get("http://192.168.0.10:1337/api/clientes?populate=*")
      .then((res) => setClientes(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <ActivityIndicator animating={true} style={{ marginTop: 20 }} />;

  return (
    <ScrollView style={styles.container}>
      {clientes.map((cliente: any) => (
        <Card key={cliente.id} style={styles.card}>
          <Card.Content>
            <Title>{cliente.attributes.nombre}</Title>
            <Paragraph>Email: {cliente.attributes.email || "N/A"}</Paragraph>
            <Paragraph>Teléfono: {cliente.attributes.telefono || "N/A"}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
});
