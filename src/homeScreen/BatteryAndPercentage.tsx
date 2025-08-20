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
        fontSize: 28,
        fontWeight: "bold",
      }}
    >
      {`${percentage}%`}
    </ThemedText>
  </View>
);
