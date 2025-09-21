import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";
import { useColors } from "../colors/useColors";

type Props = {
  color: "green" | "orange" | "red";
  percentage: number;
};

/** Ionicons v5 battery. https://react-icons.github.io/react-icons/icons/io5/ */
export const BatteryIcon = (props: Props) => {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    const repeatIndefinitely = -1;
    const revertAnimation = true;
    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
      repeatIndefinitely,
      revertAnimation,
    );
  }, [opacity]);

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const percentageBarWidth =
    Math.round(((100 * props.percentage) / 100) * (292.63 + 32)) / 100;

  const hexColor = (() => {
    switch (props.color) {
      case "green":
        return colors.green;
      case "orange":
        return colors.orange;
      case "red":
        return colors.red;
    }
  })();

  return (
    <Animated.View style={[props.percentage === 0 && animatedOpacity]}>
      <Svg
        fill={hexColor}
        height="100%"
        stroke={hexColor}
        strokeWidth="0"
        style={{
          marginLeft: 10, // Push the battery a little to the right to center it visually.
        }}
        viewBox="0 100 512 312"
        width="100%"
      >
        <Rect
          fill="none"
          height="224"
          rx="45.7"
          ry="45.7"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="32"
          transform="translate(32, 144)"
          width="400"
        />
        <Rect
          height={114.13 + 32}
          rx={15}
          ry={15}
          strokeLinecap="square"
          strokeMiterlimit="10"
          transform={`translate(${85.69 - 16}, ${198.93 - 16})`}
          width={percentageBarWidth}
        />
        <Path
          d="M480 218.67v74.66"
          fill="none"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="32"
        />
      </Svg>
    </Animated.View>
  );
};
