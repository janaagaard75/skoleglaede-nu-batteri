import Svg, { Path, Rect } from "react-native-svg";
import { useColors } from "./colors/useColors";

interface Props {
  color: "green" | "orange" | "red";
  /** A number between 0 and 100. */
  level: number;
}

/** Ionicons v5 battery. https://react-icons.github.io/react-icons/icons/io5/ */
export const BatteryIcon = (props: Props) => {
  const colors = useColors();

  const percentageBarWidth =
    Math.round(((100 * props.level) / 100) * (292.63 + 32)) / 100;

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
    <Svg
      stroke={hexColor}
      fill={hexColor}
      strokeWidth="0"
      viewBox="0 100 496 312"
      width="100%"
      height="100%"
    >
      <Rect
        width="400"
        height="224"
        x="32"
        y="144"
        fill="none"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
        rx="45.7"
        ry="45.7"
      />
      <Rect
        width={percentageBarWidth}
        height={114.13 + 32}
        x={85.69 - 16}
        y={198.93 - 16}
        strokeLinecap="square"
        strokeMiterlimit="10"
        rx={15}
        ry={15}
      />
      <Path
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M480 218.67v74.66"
      />
    </Svg>
  );
};
