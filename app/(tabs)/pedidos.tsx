import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";

type Pedido = {
  id: number;
  attributes: {
    estado_pedido?: {
      data?: {
        attributes?: {
          nombre?: string;
        };
      };
    };
    cliente?: {
      data?: {
        attributes: {
          nombre?: string;
        };
      };
    };
  };
};

export default function PedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cambia la IP por la de tu PC donde corre Strapi
    const fetchPedidos = async () => {
      try {
        const res = await axios.get<{ data: Pedido[] }>(
          "http://192.168.0.10:1337/api/pedidos?populate=*"
        );
        setPedidos(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleVerDetalle = (id: number) => {
    router.push({ pathname: "/detalle-pedido/[id]", params: { id: String(id) } });
  };

  const handleCrearPedido = () => {
    router.push({ pathname: "/(tabs)/crear-pedido" });
  };

  if (loading)
    return <ActivityIndicator animating={true} style={{ marginTop: 20 }} />;

  return (
    <ScrollView style={styles.container}>
      <Button
        mode="contained"
        onPress={handleCrearPedido}
        style={styles.createButton}
        icon="plus"
      >
        Crear Pedido
      </Button>
      {pedidos.map((p) => (
        <Card key={p.id} style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Pedido #{p.id}</Text>
            <Text variant="bodyMedium">
              Estado:{" "}
              {p.attributes.estado_pedido?.data?.attributes?.nombre ||
                "Sin estado"}
            </Text>
            <Text variant="bodyMedium">
              Cliente: {p.attributes.cliente?.data?.attributes.nombre || "N/A"}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => handleVerDetalle(p.id)}>
              Ver Detalle
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  createButton: {
    marginBottom: 15,
  },
  card: {
    marginBottom: 10,
  },
});
