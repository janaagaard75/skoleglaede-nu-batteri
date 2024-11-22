import { useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { View } from "react-native";
import { SlideToConfirm } from "../SlideToConfirm";
import { ThemedText } from "../themed/ThemedText";
import { ThemedTextPressable } from "../themed/ThemedTextPressable";
import { ThemedView } from "../themed/ThemedView";
import { parseQrCodeString } from "./parseQrCodeString";
import { QrCode } from "./QrCode";
import { ScannedCodeFeedback } from "./ScannedCodeFeedback";
import { Viewfinder } from "./Viewfinder";

interface Props {
  flames: number;
  hearts: number;
  onQrCodeApply(qrCode: QrCode): void;
  percentage: number;
}

export const ScannerSheet = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [qrCodeString, setQrCodeString] = useState<string | undefined>(
    undefined,
  );

  const qrCode = parseQrCodeString(qrCodeString);

  const applyQrCode = () => {
    if (qrCode === undefined) {
      return;
    }

    props.onQrCodeApply(qrCode);
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
          title="Giv adgang til kameraet"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        display: "flex",
        gap: 20,
        height: "100%",
      }}
    >
      <View
        style={{
          height: 220,
          marginTop: 30,
          justifyContent: "flex-end",
        }}
      >
        <Viewfinder
          onScannedQrCodeChange={setQrCodeString}
          scannedQrCode={qrCodeString}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScannedCodeFeedback
          flames={props.flames}
          hearts={props.hearts}
          percentage={props.percentage}
          qrCode={qrCode}
        />
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          marginHorizontal: "auto",
          marginBottom: 60,
          width: 270,
        }}
      >
        <SlideToConfirm
          disabled={qrCode === undefined}
          onConfirm={applyQrCode}
          title="Bekræft &nbsp;&#x21E8;"
        />
      </View>
    </ThemedView>
  );
};
