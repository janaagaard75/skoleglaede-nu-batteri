import { Battery } from "@/components/Battery";
import { ThemedView } from "@/components/themed/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView>
      <Battery level={50} />
    </ThemedView>
  );
}
