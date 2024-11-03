import React from "react";
import { View } from "react-native";
import { Battery } from "../battery/Battery";
import { ThemedText } from "../themed/ThemedText";

export const BatteryAndPercentage = ({
  percentage,
}: {
  percentage: number;
}) => (
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Battery percentage={percentage} />
    <ThemedText
      style={{
        fontWeight: "bold",
        fontSize: 28,
      }}
    >
      {percentage}%
    </ThemedText>
  </View>
);
