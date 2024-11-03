import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Pressable, View } from "react-native";

type Props = BottomSheetBackdropProps & {
  onPress: (() => void) | undefined;
};

export const Backdrop = (props: Props) => (
  <View
    {...props}
    style={{
      backgroundColor: "#000",
      bottom: 0,
      left: 0,
      opacity: 0.5,
      position: "absolute",
      right: 0,
      top: 0,
    }}
  >
    <Pressable
      onPress={props.onPress}
      style={{
        flex: 1,
      }}
    />
  </View>
);
