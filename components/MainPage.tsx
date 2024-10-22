import { useState } from "react";
import { Button, View } from "react-native";
import { BatteryAndPercentage } from "./BatteryAndPercentage";

export const MainPage = () => {
  const [level, setLevel] = useState(50);

  const decreaseLevel = () => {
    const newLevel = level - 5;
    if (newLevel >= 0) {
      setLevel(newLevel);
    } else {
      setLevel(0);
    }
  };

  const increaseLevel = () => {
    const newLevel = level + 5;
    if (newLevel <= 100) {
      setLevel(newLevel);
    } else {
      setLevel(100);
    }
  };

  return (
    <View
      style={{
        gap: 20,
        height: "100%",
        justifyContent: "center",
      }}
    >
      <BatteryAndPercentage level={level} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          justifyContent: "center",
        }}
      >
        <Button
          title="-5"
          onPress={decreaseLevel}
        />
        <Button
          title="+5"
          onPress={increaseLevel}
        />
      </View>
    </View>
  );
};
