import { View } from "react-native";
import { getNewValues } from "../getNewValues";
import { QrCode } from "../QrCode";
import { ThemedText } from "../themed/ThemedText";
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

  const newValues = getNewValues({ flames, hearts, percentage }, qrCode);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
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
  );
};
