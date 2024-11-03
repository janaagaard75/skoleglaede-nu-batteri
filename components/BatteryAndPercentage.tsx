import React from "react";
import { View } from "react-native";
import { Battery } from "./Battery";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  /** A number between 0 and 100. */
  level: number;
}

export const BatteryAndPercentage = (props: Props) => (
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Battery percentage={props.level} />
    <ThemedText
      style={{
        fontWeight: "bold",
        fontSize: 28,
      }}
    >
      {props.level}%
    </ThemedText>
  </View>
);
