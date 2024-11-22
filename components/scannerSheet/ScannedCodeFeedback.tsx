import { decode } from "html-entities";
import { View } from "react-native";
import { calculateNewValues } from "../mainState/calculateNewValues";
import { ThemedText } from "../themed/ThemedText";
import { QrCode } from "./QrCode";
import { Summary } from "./Summary";

export const ScannedCodeFeedback = ({
  flames,
  hearts,
  percentage,
  qrCode,
}: {
  flames: number;
  hearts: number;
  percentage: number;
  qrCode: QrCode | undefined;
}) => {
  if (qrCode === undefined) {
    return (
      <ThemedText
        style={{
          textAlign: "center",
        }}
      >
        Scan en QR-kode
      </ThemedText>
    );
  }

  const label = (() => {
    switch (qrCode.type) {
      case "flame":
        if (qrCode.amount === 1) {
          return "+1 flamme";
        } else {
          return decode("&minus; 1 flamme");
        }
      case "heart":
        if (qrCode.amount === 1) {
          return "+ 1 hjerte";
        } else {
          return decode("&minus; 1 hjerte");
        }
      case "percentage":
        if (qrCode.amount > 0) {
          return `+ ${qrCode.amount}%`;
        } else {
          return decode(`&minus; ${Math.abs(qrCode.amount)}%`);
        }
    }
  })();

  const newValues = calculateNewValues({ flames, hearts, percentage }, qrCode);

  return (
    <View
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <ThemedText
        style={{
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
          flames={flames}
          hearts={hearts}
          percentage={percentage}
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
