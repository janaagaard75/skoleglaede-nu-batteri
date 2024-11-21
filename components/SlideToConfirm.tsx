import { decode } from "html-entities";
import { memo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutRectangle,
  PanResponder,
  PanResponderGestureState,
  View,
} from "react-native";
import { useColors } from "./colors/useColors";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  disabled: boolean;
  onConfirm: () => void;
  title: string;
}

export const SlideToConfirm = memo((props: Props) => {
  const [buttonSize, setButtonSize] = useState<LayoutRectangle | undefined>(
    undefined,
  );
  const [sliderSize, setSliderSize] = useState<LayoutRectangle | undefined>(
    undefined,
  );
  const colors = useColors();

  const animatedPosition = useRef(new Animated.Value(0)).current;

  const end = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (props.disabled) {
      return;
    }

    if (buttonSize === undefined || sliderSize === undefined) {
      throw new Error("Both buttonSize and sliderSize must be defined.");
    }

    const maximumDx = sliderSize.width - buttonSize.width;
    const restrictedDx = clamp(gestureState.dx, 0, maximumDx);
    const dropZoneWidth = 20;
    const withinDropZone = maximumDx - restrictedDx <= dropZoneWidth;

    if (withinDropZone) {
      props.onConfirm();
    }

    Animated.timing(animatedPosition, {
      duration: 100,
      easing: Easing.ease,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const move = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (props.disabled) {
      return;
    }

    if (buttonSize === undefined || sliderSize === undefined) {
      throw new Error("Both buttonSize and sliderSize must be defined.");
    }

    const maximumDx = sliderSize.width - buttonSize.width;
    const restrictedDx = clamp(gestureState.dx, 0, maximumDx);

    animatedPosition.setValue(restrictedDx);
  };

  const start = () => {
    if (props.disabled) {
      return;
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderEnd: end,
    onPanResponderMove: move,
    onPanResponderStart: start,
    onShouldBlockNativeResponder: (_evt, _gestureState) => true,
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
  });

  return (
    <View
      style={{
        borderColor: props.disabled ? colors.disabledText : colors.text,
        borderRadius: 10,
        borderWidth: 2,
        padding: 3,
      }}
    >
      <View
        onLayout={layoutEvent => {
          setSliderSize(layoutEvent.nativeEvent.layout);
        }}
        style={{
          alignItems: "flex-start",
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateX: animatedPosition,
              },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <ThemedText
            onLayout={layoutEvent => {
              setButtonSize(layoutEvent.nativeEvent.layout);
            }}
            style={{
              borderRadius: 6,
              borderColor: props.disabled ? colors.disabledText : colors.text,
              borderWidth: 2,
              color: props.disabled ? colors.disabledText : colors.text,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            {decode(props.title)}
          </ThemedText>
        </Animated.View>
      </View>
    </View>
  );
});

const clamp = (input: number, minimum: number, maximum: number): number => {
  if (input < minimum) {
    return minimum;
  }

  if (input > maximum) {
    return maximum;
  }

  return input;
};
