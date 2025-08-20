import { Pressable, View, type PressableProps } from "react-native";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = PressableProps & React.RefAttributes<View> & { children: string };

export const ThemedTextButton = ({ children, style, ...otherProps }: Props) => {
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
        // @ts-expect-error - Don't know why TSC doesn't accept using 'style' here.
        style,
      ]}
      {...otherProps}
    >
      <ThemedText>{children}</ThemedText>
    </Pressable>
  );
};
