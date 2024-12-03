import { useColors } from "@/components/colors/useColors";
import { useColorScheme } from "@/components/colors/useColorScheme";
import { MainStateProvider } from "@/components/mainState/MainStateProvider";
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
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerShadowVisible: false,
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
                headerTitle: "Nulstil",
              }}
            />
            <Stack.Screen
              name="scan"
              options={{
                headerTitle: "Scan QR-kode",
              }}
            />
          </Stack>
        </MainStateProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
