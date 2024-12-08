import { memo, useCallback, useRef } from "react";
import { Animated, GestureResponderEvent, View } from "react-native";
import { clamp } from "react-native-reanimated";
import { useColors } from "../colors/useColors";
import { ThemedText } from "../themed/ThemedText";
import { ArrowRightIcon } from "./ArrowRightIcon";

interface Props {
  buttonWidth: number;
  children: string;
  disabled: boolean;
  onConfirm: () => void;
  sliderWidth: number;
}

export const SlideToConfirm = memo((props: Props) => {
  const colors = useColors();
  const startPageX = useRef(0);
  const animatedPosition = useRef(new Animated.Value(0)).current;

  const dropZoneWidth = 20;
  const maxDx = props.sliderWidth - props.buttonWidth;

  const end = useCallback(
    (event: GestureResponderEvent) => {
      if (props.disabled) {
        return;
      }

      const dx = event.nativeEvent.pageX - startPageX.current;
      const withinDropZone = maxDx - dx <= dropZoneWidth;

      if (withinDropZone) {
        props.onConfirm();
      }

      Animated.timing(animatedPosition, {
        duration: 100,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    },
    [animatedPosition, maxDx, props],
  );

  const move = useCallback(
    (event: GestureResponderEvent) => {
      if (props.disabled) {
        return;
      }

      const dx = event.nativeEvent.pageX - startPageX.current;
      const clampedDx = clamp(dx, 0, maxDx);
      animatedPosition.setValue(clampedDx);
    },
    [animatedPosition, maxDx, props.disabled],
  );

  const start = useCallback(
    (event: GestureResponderEvent) => {
      if (props.disabled) {
        return;
      }

      startPageX.current = event.nativeEvent.pageX;
    },
    [props.disabled],
  );

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
      <Animated.View
        onTouchCancel={end}
        onTouchEnd={end}
        onTouchEndCapture={end}
        onTouchMove={move}
        onTouchStart={start}
        style={{
          transform: [
            {
              translateX: animatedPosition,
            },
          ],
          width: props.sliderWidth,
        }}
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
    </View>
  );
});
