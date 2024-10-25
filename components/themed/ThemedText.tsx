import { useThemeColor } from "@/components/themed/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(
    {
      dark: darkColor,
      light: lightColor,
    },
    "text"
  );

  return (
    <Text
      style={[
        { color: textColor },
        type === "default" ? styles.default : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "link" ? styles.link : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "title" ? styles.title : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
});
