import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Battery } from "./battery/Battery";
import { useColors } from "./colors/useColors";
import { useMainState } from "./mainState/useMainState";
import { SlideToConfirm } from "./slideToConfirm/SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

export const ResetScreen = () => {
  const colors = useColors();
  const router = useRouter();
  const mainState = useMainState();

  const reset = () => {
    mainState.reset();

    // Wrapping in this conditional removes a warning from the router. Don't know why.
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ThemedView
        style={{
          display: "flex",
          flex: 1,
          gap: 30,
        }}
      >
        <ThemedText
          style={{
            marginHorizontal: 30,
            marginTop: 200,
          }}
        >
          Bekræft at du vil nulstille til 20% og fjerne alle hjerter og flammer.
        </ThemedText>
        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            width: 200,
          }}
        >
          <Battery percentage={20} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: 80,
            marginHorizontal: "auto",
          }}
        >
          <SlideToConfirm
            buttonWidth={140}
            disabled={false}
            onConfirm={reset}
            sliderWidth={250}
          >
            Bekræft
          </SlideToConfirm>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
