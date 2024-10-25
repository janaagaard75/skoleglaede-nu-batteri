import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutRectangle,
  PanResponder,
  Text,
  View,
} from "react-native";

enum SliderState {
  Animating,
  DropWillCancel,
  DropWillTriggerAction,
  Idle,
}

interface Props {
  disabled?: boolean;
  onSlide: () => void;
  title: string;
}

export const SlideButton = (props: Props) => {
  const [sliderState, setSliderState] = useState<SliderState>(SliderState.Idle);
  const [buttonSize, setButtonSize] = useState<LayoutRectangle | undefined>(
    undefined
  );
  const [sliderSize, setSliderSize] = useState<LayoutRectangle | undefined>(
    undefined
  );

  const sliderStateRef = useRef<SliderState>(SliderState.Idle);
  sliderStateRef.current = sliderState;
  const buttonSizeRef = useRef<LayoutRectangle | undefined>(undefined);
  buttonSizeRef.current = buttonSize;
  const sliderSizeRef = useRef<LayoutRectangle | undefined>(undefined);
  sliderSizeRef.current = sliderSize;

  const animatedPosition = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderEnd: (_evt, _gestureState) => {
        if (sliderStateRef.current === SliderState.DropWillTriggerAction) {
          props.onSlide();
        }

        setSliderState(SliderState.Animating);

        Animated.timing(animatedPosition, {
          duration: 100,
          easing: Easing.ease,
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          if (sliderStateRef.current !== SliderState.DropWillCancel) {
            setSliderState(SliderState.Idle);
          }
        });
      },

      onPanResponderMove: (_evt, gestureState) => {
        if (
          buttonSizeRef.current === undefined ||
          sliderSizeRef.current === undefined
        ) {
          throw new Error("Both buttonSize and sliderSize must be defined.");
        }

        const maximumDx =
          sliderSizeRef.current.width - buttonSizeRef.current.width;
        const restrictedDx = restrict(gestureState.dx, 0, maximumDx);
        const dropZoneWidth = 20;
        const withinDropZone = maximumDx - restrictedDx <= dropZoneWidth;
        setSliderState(
          withinDropZone
            ? SliderState.DropWillTriggerAction
            : SliderState.DropWillCancel
        );

        animatedPosition.setValue(restrictedDx);
      },

      onPanResponderStart: (_evt, _gestureState) => {
        setSliderState(SliderState.DropWillCancel);
      },

      onStartShouldSetPanResponder: (_evt, _gestureState) =>
        !(props.disabled !== true),

      onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
      onMoveShouldSetPanResponderCapture: (_evt, _gestureState) => true,
      onPanResponderTerminationRequest: (_evt, _gestureState) => true,
      onShouldBlockNativeResponder: (_evt, _gestureState) => true,
      onStartShouldSetPanResponderCapture: (_evt, _gestureState) => true,
    })
  ).current;

  return (
    <View
      style={{
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
          borderColor: "#000",
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
              borderColor: props.disabled === true ? "#999" : "#000",
              borderWidth: 2,
              color: props.disabled === true ? "#999" : "#000",
              fontSize: 16,
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
          >
            {props.title} &#x21E8;
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const restrict = (input: number, minimum: number, maximum: number): number => {
  if (input < minimum) {
    return minimum;
  }

  if (input > maximum) {
    return maximum;
  }

  return input;
};
