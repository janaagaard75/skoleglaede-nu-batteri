import { memo, useEffect, useRef } from "react";
import {
  AccessibilityActionEvent,
  Animated,
  GestureResponderEvent,
  View,
} from "react-native";
import { clamp, useReducedMotion } from "react-native-reanimated";
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

export const SlideToConfirm = memo((props: Props) => {
  const colors = useColors();
  const startPageX = useRef(0);
  const active = useRef(false);
  const animatedPosition = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  const dropZoneWidth = 20;
  const maxDx = props.sliderWidth - props.buttonWidth;

  useEffect(() => () => animatedPosition.stopAnimation(), [animatedPosition]);

  const resetPosition = () => {
    Animated.timing(animatedPosition, {
      duration: reducedMotion ? 0 : 100,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const cancel = () => {
    if (active.current) {
      active.current = false;
      props.onInteractionCancel?.();
    }
    resetPosition();
  };

  const end = (event: GestureResponderEvent) => {
    if (!active.current) {
      return;
    }
    active.current = false;
    const dx = event.nativeEvent.pageX - startPageX.current;
    if (!props.disabled && maxDx - dx <= dropZoneWidth) {
      props.onConfirm();
    } else {
      props.onInteractionCancel?.();
    }
    resetPosition();
  };

  const move = (event: GestureResponderEvent) => {
    if (!active.current || props.disabled) {
      return;
    }
    const dx = event.nativeEvent.pageX - startPageX.current;
    animatedPosition.setValue(clamp(dx, 0, maxDx));
  };

  const start = (event: GestureResponderEvent) => {
    if (props.disabled) {
      return;
    }
    animatedPosition.stopAnimation();
    animatedPosition.setValue(0);
    startPageX.current = event.nativeEvent.pageX;
    active.current = true;
    props.onInteractionStart?.();
  };

  const confirmAccessibly = () => {
    if (props.disabled) {
      return;
    }
    props.onInteractionStart?.();
    props.onConfirm();
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
      <Animated.View
        onResponderGrant={start}
        onResponderMove={move}
        onResponderRelease={end}
        onResponderTerminate={cancel}
        onResponderTerminationRequest={() => true}
        onStartShouldSetResponder={() => !props.disabled}
        style={{
          transform: [
            {
              translateX: animatedPosition,
            },
          ],
          width: props.buttonWidth,
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
