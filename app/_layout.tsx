import { useColors } from "@/src/colors/useColors";
import { useColorScheme } from "@/src/colors/useColorScheme";
import { MainStateProvider } from "@/src/mainState/MainStateProvider";
import { CloseModalButton } from "@/src/themed/CloseModalButton";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useColors();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <MainStateProvider>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                headerTitle: "Forsiden",
              }}
            />
            <Stack.Screen
              name="reset"
              options={{
                headerBackVisible: false,
                headerRight: () => (
                  <CloseModalButton accessibilityLabel="Luk nulstilling" />
                ),
                headerTitle: "Nulstil",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="scan"
              options={{
                headerBackVisible: false,
                headerRight: () => (
                  <CloseModalButton accessibilityLabel="Luk scanner" />
                ),
                headerTitle: "Scan QR-kode",
                presentation: "modal",
              }}
            />
          </Stack>
        </MainStateProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
