import { Pressable, type PressableProps } from "react-native";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = PressableProps & { label: string };

export function ThemedTextButton({ label, style, ...otherProps }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={[
        {
          alignSelf: "center",
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
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}
