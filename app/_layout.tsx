import { Stack } from "expo-router";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#2e7d32",
        secondary: "#0277bd",
    },
};

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="detalle-pedido/[id]"
                        options={{
                            title: "Detalle del Pedido",
                            presentation: "card"
                        }}
                    />
                </Stack>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
