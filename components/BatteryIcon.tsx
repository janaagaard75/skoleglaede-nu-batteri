import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

interface Props {
  color: "green" | "orange" | "red";
  /** A number between 0 and 100. */
  level: number;
}

/** Ionicons v5 battery. https://react-icons.github.io/react-icons/icons/io5/ */
export const BatteryIcon = (props: Props) => {
  const percentageBarWidth =
    Math.round(((100 * props.level) / 100) * (292.63 + 32)) / 100;

  const hexColor = (() => {
    switch (props.color) {
      case "green":
        return "#16a34a"; // green-600
      case "orange":
        return "#f59e0b"; // amber-500
      case "red":
        return "#dc2626"; // red-600
    }
  })();

  return (
    <View
      style={{
        marginBottom: -40,
        marginRight: -10, // Offset a bit to center the battery visually.
        marginTop: -40,
      }}
    >
      <Svg
        stroke={hexColor}
        fill={hexColor}
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="200px"
        width="200px"
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
    </View>
  );
};
