import { Pressable, type PressableProps } from "react-native";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = PressableProps & { title: string };

export function ThemedTextPressable({ style, title, ...otherProps }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={[
        {
          alignItems: "center",
        },
        // style,
      ]}
      {...otherProps}
    >
      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
}
