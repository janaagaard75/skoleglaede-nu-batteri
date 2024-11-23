import { useRouter } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { Battery } from "./battery/Battery";
import { useMainState } from "./mainState/useMainState";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

export const ResetScreen = () => {
  const router = useRouter();
  const mainState = useMainState();

  const reset = () => {
    mainState.reset();
    router.dismiss();
  };

  return (
    <SafeAreaView
      style={{
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
            marginTop: 200,
            marginHorizontal: 30,
          }}
        >
          Bekræft at du vil nulstille til 20% og fjerne alle hjerter og flammer.
        </ThemedText>
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            width: 200,
          }}
        >
          <Battery percentage={20} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginHorizontal: "auto",
            marginBottom: 80,
          }}
        >
          <SlideToConfirm
            buttonWidth={140}
            disabled={false}
            onConfirm={reset}
            sliderWidth={250}
          >
            Bekræft &nbsp;&#x21E8;
          </SlideToConfirm>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
