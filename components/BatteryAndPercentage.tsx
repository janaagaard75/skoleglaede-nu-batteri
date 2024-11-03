import React from "react";
import { View } from "react-native";
import { Battery } from "./Battery";
import { ThemedText } from "./themed/ThemedText";

interface Props {
  percentage: number;
}

export const BatteryAndPercentage = (props: Props) => (
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Battery percentage={props.percentage} />
    <ThemedText
      style={{
        fontWeight: "bold",
        fontSize: 28,
      }}
    >
      {props.percentage}%
    </ThemedText>
  </View>
);
