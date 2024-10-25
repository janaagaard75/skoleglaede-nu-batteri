import { Colors } from "@/components/themed/Colors";
import { useColorScheme } from "react-native";

export function useThemeColor(
  props: {
    dark?: string;
    light?: string;
  },
  colorName: keyof typeof Colors.dark & keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

// Learn more about light and dark modes: https://docs.expo.dev/guides/color-schemes/. */
