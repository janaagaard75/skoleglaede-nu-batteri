import { StyleSheet, Text, type TextProps } from "react-native";
import { useColors } from "../colors/useColors";

type Props = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({ style, type = "default", ...rest }: Props) {
  const colors = useColors();

  return (
    <Text
      style={[
        {
          color: colors.text,
        },
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
    fontSize: 20,
    lineHeight: 30,
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
