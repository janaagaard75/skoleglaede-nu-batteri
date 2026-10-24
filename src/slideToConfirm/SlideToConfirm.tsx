import { useEffect, useRef } from "react";
import { AccessibilityActionEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  clamp,
  useAnimatedStyle,
  useReducedMotion,
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
  onInteractionCancel?: () => void;
  onInteractionStart?: () => void;
  sliderWidth: number;
};

export const SlideToConfirm = (props: Props) => {
  const colors = useColors();
  const animatedPosition = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const active = useRef(false);
  const mounted = useRef(true);
  const dropZoneWidth = 20;
  const maxDx = props.sliderWidth - props.buttonWidth;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current = false;
      cancelAnimation(animatedPosition);
    };
  }, [animatedPosition]);

  const beginInteraction = () => {
    if (!mounted.current || props.disabled) {
      return;
    }
    active.current = true;
    props.onInteractionStart?.();
  };

  const finishInteraction = (confirmed: boolean) => {
    if (!mounted.current || !active.current) {
      return;
    }
    active.current = false;
    if (confirmed && !props.disabled) {
      props.onConfirm();
    } else {
      props.onInteractionCancel?.();
    }
  };

  const pan = Gesture.Pan()
    .enabled(!props.disabled)
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      cancelAnimation(animatedPosition);
      animatedPosition.set(0);
      scheduleOnRN(beginInteraction);
    })
    .onChange(event => {
      animatedPosition.set(clamp(event.translationX, 0, maxDx));
    })
    .onEnd((event, success) => {
      if (success) {
        scheduleOnRN(
          finishInteraction,
          maxDx - event.translationX <= dropZoneWidth,
        );
      }
    })
    .onFinalize((_event, success) => {
      if (!success) {
        scheduleOnRN(finishInteraction, false);
      }
      animatedPosition.set(
        withTiming(0, {
          duration: reducedMotion ? 0 : 100,
        }),
      );
    });

  const animatedTranslation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedPosition.get() }],
    };
  });

  const confirmAccessibly = () => {
    if (!mounted.current || props.disabled) {
      return;
    }
    beginInteraction();
    finishInteraction(true);
  };

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "activate") {
      confirmAccessibly();
    }
  };

  return (
    <View
      accessibilityActions={[{ name: "activate" }]}
      accessibilityLabel={props.children}
      accessibilityRole="button"
      accessibilityState={{ disabled: props.disabled }}
      accessible={true}
      onAccessibilityAction={handleAccessibilityAction}
      onAccessibilityTap={confirmAccessibly}
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
