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
        height: "100%",
        marginHorizontal: 30,
        gap: 30,
        marginTop: 30,
      }}
    >
      <ThemedText>
        Bekræft at du vil nulstille batteriniveauet til 30 % og fjerne alle
        hjerter og flammer.
      </ThemedText>
      <SlideToConfirm
        disabled={false}
        onConfirm={props.onReset}
        title="Bekræft &nbsp;&#x21E8;"
      />
    </ThemedView>
  );
};
