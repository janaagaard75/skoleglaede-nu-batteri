import React from "react";
import { View } from "react-native";
import { BatteryIcon } from "./BatteryIcon";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  /** A number between 0 and 100. */
  level: number;
}

export const Battery = (props: Props) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <BatteryIcon />
      <ThemedText>{props.level} %</ThemedText>
    </View>
  );
};
