import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useColors } from "../colors/useColors";
import { ThemedText } from "../themed/ThemedText";
import { ArrowRightIcon } from "./ArrowRightIcon";

type Props = {
  buttonWidth: number;
  children: string;
  disabled: boolean;
  onConfirm: () => void;
  sliderWidth: number;
};

export const SlideToConfirm = (props: Props) => {
  const colors = useColors();
  const animatedPosition = useSharedValue(0);

  const dropZoneWidth = 20;
  const maxDx = props.sliderWidth - props.buttonWidth;
  const onConfirm = props.onConfirm;

  const pan = Gesture.Pan()
    .enabled(!props.disabled)
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onChange(event => {
      animatedPosition.value = clamp(event.translationX, 0, maxDx);
    })
    .onEnd(() => {
      if (maxDx - animatedPosition.value <= dropZoneWidth) {
        scheduleOnRN(onConfirm);
      }
    })
    .onFinalize(() => {
      animatedPosition.value = withTiming(0, { duration: 100 });
    });

  const animatedTranslation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedPosition.value }],
    };
  });

  return (
    <View
      style={{
        borderColor: props.disabled ? colors.disabledText : colors.text,
        borderRadius: 10,
        borderWidth: 2,
        padding: 3,
        width: props.sliderWidth + 2 * (3 + 2),
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[animatedTranslation, { width: props.buttonWidth }]}
        >
          <View
            style={{
              alignItems: "center",
              borderColor: props.disabled ? colors.disabledText : colors.text,
              borderRadius: 6,
              borderWidth: 2,
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 14,
              paddingVertical: 6,
              width: props.buttonWidth,
            }}
          >
            <ThemedText
              style={{
                color: props.disabled ? colors.disabledText : colors.text,
              }}
            >
              {props.children}
            </ThemedText>
            <ArrowRightIcon />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
