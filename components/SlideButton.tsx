import { memo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutRectangle,
  PanResponder,
  PanResponderGestureState,
  Text,
  View,
} from "react-native";
import { useThemeColor } from "./themed/useThemeColor";

interface Props {
  disabled: boolean;
  onSlide: () => void;
  title: string;
}

export const SlideButton = memo((props: Props) => {
  const [buttonSize, setButtonSize] = useState<LayoutRectangle | undefined>(
    undefined
  );
  const [sliderSize, setSliderSize] = useState<LayoutRectangle | undefined>(
    undefined
  );

  const animatedPosition = useRef(new Animated.Value(0)).current;

  const disabledTextColor = useThemeColor({}, "disabledText");
  const textColor = useThemeColor({}, "text");

  const end = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
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
      props.onSlide();
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
    gestureState: PanResponderGestureState
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

  const start = (
    _evt: GestureResponderEvent,
    _gestureStat: PanResponderGestureState
  ) => {
    if (props.disabled) {
      return;
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
    onMoveShouldSetPanResponderCapture: (_evt, _gestureState) => true,
    onPanResponderEnd: end,
    onPanResponderMove: move,
    onPanResponderStart: start,
    onShouldBlockNativeResponder: (_evt, _gestureState) => true,
    onStartShouldSetPanResponder: (_evt, _gestureState) => true,
    onStartShouldSetPanResponderCapture: (_evt, _gestureState) => true,
  });

  return (
    <View
      style={{
        borderColor: props.disabled ? disabledTextColor : textColor,
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
          <Text
            onLayout={layoutEvent => {
              setButtonSize(layoutEvent.nativeEvent.layout);
            }}
            style={{
              borderRadius: 6,
              borderColor: props.disabled ? disabledTextColor : textColor,
              borderWidth: 2,
              color: props.disabled ? disabledTextColor : textColor,
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            {props.title} &nbsp;&#x21E8;
          </Text>
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
