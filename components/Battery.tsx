import React from "react";
import { View } from "react-native";
import { BatteryIcon } from "./BatteryIcon";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  /** A number between 0 and 100. */
  level: number;
}

export const Battery = (props: Props) => {
  const batteryColor = (() => {
    if (props.level <= 10) {
      return "red";
    }

    if (props.level <= 20) {
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
      <BatteryIcon color={batteryColor} />
      <ThemedText>{props.level} %</ThemedText>
    </View>
  );
};
