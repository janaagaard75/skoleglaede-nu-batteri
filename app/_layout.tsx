import { useColors } from "@/components/colors/useColors";
import { useColorScheme } from "@/components/colors/useColorScheme";
import { MainStateProvider } from "@/components/mainState/MainStateProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useColors();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <MainStateProvider>
          <GestureHandlerRootView>
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
          </GestureHandlerRootView>
        </MainStateProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
