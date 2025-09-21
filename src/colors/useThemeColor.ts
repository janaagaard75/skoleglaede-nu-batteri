import { Colors } from "@/src/colors/Colors";
import { useColorScheme } from "react-native";

export const useThemeColor = (
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  colorName: keyof typeof Colors.dark & keyof typeof Colors.light,
) => {
  const theme = useColorScheme() ?? "light";
  return Colors[theme][colorName];
};
