import { BatteryAndPercentage } from "@/components/BatteryAndPercentage";
import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView
          style={{
            display: "flex",
            gap: 30,
          }}
        >
          <BatteryAndPercentage level={0} />
          <BatteryAndPercentage level={1} />
          <BatteryAndPercentage level={5} />
          <BatteryAndPercentage level={10} />
          <BatteryAndPercentage level={20} />
          <BatteryAndPercentage level={50} />
          <BatteryAndPercentage level={100} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
