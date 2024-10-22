import React from "react";
import { View } from "react-native";
import { BatteryIcon } from "./BatteryIcon";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  /** A number between 0 and 100. */
  level: number;
}

export const Battery = (props: Props) => {
  const roundedLevel = Math.round(props.level);

  const batteryColor = (() => {
    if (roundedLevel <= 10) {
      return "red";
    }

    if (roundedLevel <= 20) {
      return "orange";
    }

    return "green";
  })();

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <BatteryIcon
        color={batteryColor}
        level={roundedLevel}
      />
      <ThemedText>{props.level} %</ThemedText>
    </View>
  );
};
