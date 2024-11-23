import { Text, type TextProps } from "react-native";
import { useColors } from "../colors/useColors";

type Props = TextProps;

export function ThemedText({ style, ...otherProps }: Props) {
  const colors = useColors();

  return (
    <Text
      style={[
        {
          color: colors.text,
          fontSize: 20,
          lineHeight: 30,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
