import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Card, Paragraph, Title } from "react-native-paper";

export default function DetallePedidoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Cambia la IP por la de tu PC donde corre Strapi
      axios
        .get(`http://192.168.0.10:1337/api/pedidos/${id}?populate=*`)
        .then((res) => {
          setPedido(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator animating={true} style={{ marginTop: 20 }} />;
  }

  if (!pedido) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>Error</Title>
          <Paragraph>No se pudo cargar el pedido</Paragraph>
          <Button mode="outlined" onPress={() => router.back()}>
            Volver
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Pedido #{pedido.id}</Title>
          <Paragraph style={styles.detail}>
            <strong>Estado: </strong>
            {pedido.attributes.estado_pedido?.data?.attributes?.nombre || "Sin estado"}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <strong>Cliente: </strong>
            {pedido.attributes.cliente?.data?.attributes.nombre || "N/A"}
          </Paragraph>
          <Paragraph style={styles.detail}>
            <strong>Fecha: </strong>
            {pedido.attributes.createdAt ? 
              new Date(pedido.attributes.createdAt).toLocaleDateString() : 
              "N/A"
            }
          </Paragraph>
          {pedido.attributes.descripcion && (
            <Paragraph style={styles.detail}>
              <strong>Descripción: </strong>
              {pedido.attributes.descripcion}
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        Volver a Pedidos
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 20,
  },
  detail: {
    marginBottom: 8,
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
  },
});
