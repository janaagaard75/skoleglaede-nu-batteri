import { Colors } from "@/components/colors/Colors";
import { useColorScheme } from "react-native";

export function useThemeColor(
  colorName: keyof typeof Colors.dark & keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? "light";
  return Colors[theme][colorName];
}
