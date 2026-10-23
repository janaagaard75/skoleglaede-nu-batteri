import { ReactNode, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  accessibilityLabel?: string;
  animateChanges?: boolean;
  currentValue: number;
  excludedIcon: ReactNode;
  gap: number;
  includedIcon: ReactNode;
  maximum: number;
  size: number;
};

type SlotProps = {
  animateChanges: boolean;
  excludedIcon: ReactNode;
  included: boolean;
  includedIcon: ReactNode;
  size: number;
};

const IconSlot = (props: SlotProps) => {
  const reduceMotion = useReducedMotion();
  const previousIncluded = useRef(props.included);
  const opacity = useSharedValue(props.included ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(opacity);
    cancelAnimation(scale);
    const changed = previousIncluded.current !== props.included;
    previousIncluded.current = props.included;
    if (!changed || !props.animateChanges || reduceMotion) {
      opacity.value = props.included ? 1 : 0;
      scale.value = 1;
    } else if (props.included) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withTiming(1.8, { duration: 180 }),
        withTiming(1, { duration: 250 }),
      );
    } else {
      opacity.value = withTiming(0, { duration: 430 });
      scale.value = withTiming(2, { duration: 430 });
    }
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [opacity, props.animateChanges, props.included, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={{ height: props.size, width: props.size }}>
      <View style={styles.icon}>{props.excludedIcon}</View>
      <Animated.View style={[styles.icon, animatedStyle]}>
        {props.includedIcon}
      </Animated.View>
    </View>
  );
};

export const IconsRow = (props: Props) => (
  <View
    accessibilityLabel={props.accessibilityLabel}
    accessible={props.accessibilityLabel !== undefined}
    style={{
      alignSelf: "center",
      display: "flex",
      flexDirection: "row",
      gap: props.gap,
    }}
  >
    {Array.from({ length: props.maximum }).map((_, index) => (
      <IconSlot
        animateChanges={props.animateChanges === true}
        excludedIcon={props.excludedIcon}
        included={index < props.currentValue}
        includedIcon={props.includedIcon}
        key={index}
        size={props.size}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  icon: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
});
