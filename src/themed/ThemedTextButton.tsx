import { Pressable, View, type PressableProps } from "react-native";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = Omit<PressableProps, "style">
  & React.RefAttributes<View> & { children: string };

export const ThemedTextButton = ({ children, ...otherProps }: Props) => {
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
      ]}
      {...otherProps}
    >
      <ThemedText>{children}</ThemedText>
    </Pressable>
  );
};
