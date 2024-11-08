import { View } from "react-native";
import { Battery } from "./battery/Battery";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

interface Props {
  onReset: () => void;
}

export const ResetSheet = (props: Props) => {
  return (
    <ThemedView
      style={{
        display: "flex",
        height: "100%",
        gap: 30,
      }}
    >
      <ThemedText
        style={{
          marginTop: 30,
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
          marginBottom: 60,
          width: 270,
        }}
      >
        <SlideToConfirm
          disabled={false}
          onConfirm={props.onReset}
          title="Bekræft &nbsp;&#x21E8;"
        />
      </View>
    </ThemedView>
  );
};
