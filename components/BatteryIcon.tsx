import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

interface Props {
  color: string;
}

/** Ionicons v5 battery. https://react-icons.github.io/react-icons/icons/io5/ */
export const BatteryIcon = (props: Props) => (
  <View
    style={{
      marginBottom: -40,
      marginTop: -40,
    }}
  >
    <Svg
      stroke={props.color}
      fill={props.color}
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="200px"
      width="200px"
    >
      <Rect
        width="400"
        height="224"
        x="31"
        y="144"
        fill="none"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
        rx="45.7"
        ry="45.7"
      />
      <Path
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M479 218.67v74.66"
      />
    </Svg>
  </View>
);
