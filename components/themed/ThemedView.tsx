import { View, type ViewProps } from "react-native";
import { useColors } from "../colors/useColors";

type Props = ViewProps;

export function ThemedView({ style, ...otherProps }: Props) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
