import { Pressable, type PressableProps } from "react-native";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = PressableProps & { children: string };

export function ThemedTextButton({ children, style, ...otherProps }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={[
        {
          alignSelf: "center",
          borderColor: colors.text,
          borderRadius: 8,
          borderWidth: 2,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        // @ts-ignore - don't know why TSC doesn't accept using 'style' here.
        style,
      ]}
      {...otherProps}
    >
      <ThemedText>{children}</ThemedText>
    </Pressable>
  );
}
