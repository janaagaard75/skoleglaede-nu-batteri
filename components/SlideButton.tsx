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

type SliderState =
  | "animating"
  | "dropWillCancel"
  | "dropWillTriggerAction"
  | "idle";

interface Props {
  disabled: boolean;
  onSlide: () => void;
  title: string;
}

export const SlideButton = memo((props: Props) => {
  const [sliderState, setSliderState] = useState<SliderState>("idle");
  const [buttonSize, setButtonSize] = useState<LayoutRectangle | undefined>(
    undefined
  );
  const [sliderSize, setSliderSize] = useState<LayoutRectangle | undefined>(
    undefined
  );

  const sliderStateRef = useRef<SliderState>("idle");
  sliderStateRef.current = sliderState;
  const buttonSizeRef = useRef<LayoutRectangle | undefined>(undefined);
  buttonSizeRef.current = buttonSize;
  const sliderSizeRef = useRef<LayoutRectangle | undefined>(undefined);
  sliderSizeRef.current = sliderSize;

  const animatedPosition = useRef(new Animated.Value(0)).current;

  const disabledTextColor = useThemeColor({}, "disabledText");
  const textColor = useThemeColor({}, "text");

  const end = (
    _evt: GestureResponderEvent,
    _gestureStat: PanResponderGestureState
  ) => {
    if (sliderStateRef.current === "dropWillTriggerAction") {
      props.onSlide();
    }

    setSliderState("animating");

    Animated.timing(animatedPosition, {
      duration: 100,
      easing: Easing.ease,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (sliderStateRef.current !== "dropWillCancel") {
        setSliderState("idle");
      }
    });
  };

  const move = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    if (
      buttonSizeRef.current === undefined ||
      sliderSizeRef.current === undefined
    ) {
      throw new Error("Both buttonSize and sliderSize must be defined.");
    }

    const maximumDx = sliderSizeRef.current.width - buttonSizeRef.current.width;
    const restrictedDx = restrict(gestureState.dx, 0, maximumDx);
    const dropZoneWidth = 20;
    const withinDropZone = maximumDx - restrictedDx <= dropZoneWidth;
    setSliderState(withinDropZone ? "dropWillTriggerAction" : "dropWillCancel");

    animatedPosition.setValue(restrictedDx);
  };

  const start = (
    _evt: GestureResponderEvent,
    _gestureStat: PanResponderGestureState
  ) => {
    setSliderState("dropWillCancel");
  };

  const panResponder = PanResponder.create({
    // onPanResponderTerminationRequest: (_evt, _gestureState) => true,
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

const restrict = (input: number, minimum: number, maximum: number): number => {
  if (input < minimum) {
    return minimum;
  }

  if (input > maximum) {
    return maximum;
  }

  return input;
};
