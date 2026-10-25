import { QrCode } from "../mainState/QrCode";
import { ThemedText } from "../themed/ThemedText";

type Props = {
  qrCode: QrCode | undefined;
  unknownCode: boolean;
};

export const ScannedCodeFeedback = (props: Props) => {
  const label = (() => {
    if (props.unknownCode) {
      return "Ukendt QR-kode";
    }
    if (props.qrCode === undefined) {
      return "Scan en QR-kode";
    }
    const sign = props.qrCode.amount < 0 ? "−" : "+";
    switch (props.qrCode.type) {
      case "flame":
        return `${sign} 1 flamme`;
      case "heart":
        return `${sign} 1 hjerte`;
      case "percentage":
        return `${sign} ${Math.abs(props.qrCode.amount)}%`;
    }
  })();

  return (
    <ThemedText
      accessibilityLiveRegion="polite"
      style={{ fontSize: 30, textAlign: "center" }}
    >
      {label}
    </ThemedText>
  );
};
