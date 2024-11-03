import { useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { View } from "react-native";
import { parseQrCodeString } from "./parseQrCodeString";
import { QrCode } from "./QrCode";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";
import { Viewfinder } from "./Viewfinder";

interface Props {
  onFlamesChange(amount: -1 | 1): void;
  onHeartsChange(amount: -1 | 1): void;
  onPercentageChange(percentagePoints: number): void;
}

export const ScannerSheet = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [qrCodeString, setQrCodeString] = useState<string | undefined>(
    undefined,
  );

  const qrCode = parseQrCodeString(qrCodeString);

  const applyScannedQrCode = () => {
    if (qrCode === undefined) {
      return;
    }

    switch (qrCode.type) {
      case "flame":
        props.onFlamesChange(qrCode.amount);
        break;
      case "heart":
        props.onHeartsChange(qrCode.amount);
        break;
      case "percentage":
        props.onPercentageChange(qrCode.amount);
        break;
    }
  };

  if (cameraPermissions === null) {
    return (
      <ThemedText
        style={{
          height: "100%",
          marginHorizontal: 30,
          gap: 30,
          marginTop: 30,
        }}
      >
        Venter på tilladelse til kameraet&hellip;
      </ThemedText>
    );
  }

  if (!cameraPermissions.granted) {
    return (
      <ThemedView
        style={{
          height: "100%",
          marginHorizontal: 30,
          gap: 30,
          marginTop: 30,
        }}
      >
        <ThemedText
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Vi har brug for din tilladelse til at bruge kameraet.
        </ThemedText>
        <ThemedTextPressable
          onPress={requestCameraPermissions}
          style={{
            alignSelf: "center",
          }}
          title="Giv adgang til kameraet"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 30,
          gap: 10,
        }}
      >
        <Viewfinder
          onScannedQrCodeChange={setQrCodeString}
          scannedQrCode={qrCodeString}
        />
        <ScannedCodeFeedback qrCode={qrCode} />
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          marginBottom: 40,
          marginHorizontal: 30,
        }}
      >
        <SlideToConfirm
          disabled={qrCode === undefined}
          onConfirm={applyScannedQrCode}
          title="Bekræft &nbsp;&#x21E8;"
        />
      </View>
    </ThemedView>
  );
};

const ScannedCodeFeedback = ({ qrCode }: { qrCode: QrCode | undefined }) => {
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

  return (
    <ThemedText
      style={{
        textAlign: "center",
      }}
    >
      "TODO"
    </ThemedText>
  );
};
