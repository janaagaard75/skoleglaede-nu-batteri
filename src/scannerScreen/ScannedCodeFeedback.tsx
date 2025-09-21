import { View } from "react-native";
import { calculateNewValues } from "../mainState/calculateNewValues";
import { QrCode } from "../mainState/QrCode";
import { ThemedText } from "../themed/ThemedText";
import { Summary } from "./Summary";

type Props = {
  flames: number;
  hearts: number;
  percentage: number;
  qrCode: QrCode | undefined;
};

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
        }
        return "&minus; 1 flamme";

      case "heart":
        if (props.qrCode.amount === 1) {
          return "+ 1 hjerte";
        }
        return "&minus; 1 hjerte";

      case "percentage":
        if (props.qrCode.amount > 0) {
          return `+ ${props.qrCode.amount}%`;
        }
        return `&minus; ${Math.abs(props.qrCode.amount)}%`;
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
        display: "flex",
        flex: 1,
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
            alignItems: "center",
            justifyContent: "center",
            width: 40,
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
