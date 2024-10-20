import { Battery } from "@/components/Battery";
import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView
        style={{
          display: "flex",
          gap: 30,
        }}
      >
        <Battery level={0} />
        <Battery level={10} />
        <Battery level={20} />
        <Battery level={50} />
        <Battery level={100} />
      </ThemedView>
    </ScrollView>
  );
}
