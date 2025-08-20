import { View } from "react-native";
import { BatteryIcon } from "./BatteryIcon";

export const Battery = ({ percentage }: { percentage: number }) => {
  const roundedPercentage = Math.round(percentage);

  const batteryColor = (() => {
    if (roundedPercentage <= 10) {
      return "red";
    }

    if (roundedPercentage <= 20) {
      return "orange";
    }

    return "green";
  })();

  return (
    <View
      style={{
        aspectRatio: 1.5,
        width: "60%",
      }}
    >
      <BatteryIcon
        color={batteryColor}
        percentage={roundedPercentage}
      />
    </View>
  );
};
