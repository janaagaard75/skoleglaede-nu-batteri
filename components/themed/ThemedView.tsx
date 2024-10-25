import { useThemeColor } from "@/components/themed/useThemeColor";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  darkColor?: string;
  lightColor?: string;
};

export function ThemedView({
  darkColor,
  lightColor,
  style,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {
      dark: darkColor,
      light: lightColor,
    },
    "background"
  );

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
