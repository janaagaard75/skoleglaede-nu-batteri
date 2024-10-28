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
          alignSelf: "flex-start",
          borderColor: colors.text,
          borderRadius: 8,
          borderWidth: 2,
          elevation: 4,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        // @ts-ignore
        style,
      ]}
      {...otherProps}
    >
      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
}
