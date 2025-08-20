import { View } from "react-native";
import { calculateNewValues } from "../mainState/calculateNewValues";
import { QrCode } from "../mainState/QrCode";
import { ThemedText } from "../themed/ThemedText";
import { Summary } from "./Summary";

interface Props {
  flames: number;
  hearts: number;
  percentage: number;
  qrCode: QrCode | undefined;
}

export const ScannedCodeFeedback = (props: Props) => {
  if (props.qrCode === undefined) {
    return (
      <ThemedText
        style={{
          fontSize: 30,
          textAlign: "center",
        }}
      >
        Scan en QR-kode
      </ThemedText>
    );
  }

  const label = (() => {
    switch (props.qrCode.type) {
      case "flame":
        if (props.qrCode.amount === 1) {
          return "+1 flamme";
        } else {
          return "&minus; 1 flamme";
        }

      case "heart":
        if (props.qrCode.amount === 1) {
          return "+ 1 hjerte";
        } else {
          return "&minus; 1 hjerte";
        }

      case "percentage":
        if (props.qrCode.amount > 0) {
          return `+ ${props.qrCode.amount}%`;
        } else {
          return `&minus; ${Math.abs(props.qrCode.amount)}%`;
        }
    }
  })();

  const newValues = calculateNewValues(
    {
      flames: props.flames,
      hearts: props.hearts,
      percentage: props.percentage,
    },
    props.qrCode,
  );

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
      }}
    >
      <ThemedText
        style={{
          fontSize: 30,
          textAlign: "center",
        }}
      >
        {label}
      </ThemedText>
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <Summary
          flames={props.flames}
          hearts={props.hearts}
          percentage={props.percentage}
        />
        <View
          style={{
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>&#x21E8;</ThemedText>
        </View>
        <Summary
          flames={newValues.newFlames}
          hearts={newValues.newHearts}
          percentage={newValues.newPercentage}
        />
      </View>
    </View>
  );
};
