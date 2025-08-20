import { decode } from "html-entities";
import { Text, type TextProps } from "react-native";
import { useColors } from "../colors/useColors";

type Props = TextProps & { children: string };

export const ThemedText = ({ children, style, ...otherProps }: Props) => {
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
    >
      {decode(children)}
    </Text>
  );
};
