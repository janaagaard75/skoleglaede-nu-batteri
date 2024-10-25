import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { BarCodeBounds } from "expo-camera/build/legacy/Camera.types";
import { useState } from "react";
import { Button, View } from "react-native";
import { SlideButton } from "./SlideButton";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

interface Props {
  onDecrease(percentagePoints: number): void;
  onIncrease(percentagePoints: number): void;
}

export const ScannerPage = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  const [bounds, setBounds] = useState<BarCodeBounds | undefined>(undefined);
  const [scannedQrCode, setScannedQrCode] = useState<string | undefined>(
    undefined
  );
  const [resetScannedQrCodeTimeoutId, setResetScannedQrCodeTimeoutId] =
    useState<NodeJS.Timeout | undefined>(undefined);

  // This aspect ratio of 4:3 seems to be what the QR scanner uses.
  const viewfinderHeight = 80 * 4;
  const viewfinderWidth = 80 * 3;

  const qrCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (resetScannedQrCodeTimeoutId !== undefined) {
      clearTimeout(resetScannedQrCodeTimeoutId);
    }

    setScannedQrCode(scanningResult.data);
    setBounds(scanningResult.bounds);

    setResetScannedQrCodeTimeoutId(setTimeout(resetScannedQrCode, 3_000));
  };

  const applyScannedQrCode = () => {
    console.log("1", scannedQrCode);

    if (scannedQrCode === undefined) {
      return;
    }

    if (scannedQrCode.match(/^[+-]\d{3}pp$/)) {
      console.log("match");

      const operation = scannedQrCode[0];
      const percentagePoints = parseInt(scannedQrCode.slice(1, 4), 10);

      switch (operation) {
        case "-":
          props.onDecrease(percentagePoints);
          break;
        case "+":
          props.onIncrease(percentagePoints);
          break;
      }
    }
  };

  const resetScannedQrCode = () => {
    setScannedQrCode(undefined);
    setBounds(undefined);
  };

  if (cameraPermissions === null) {
    return <ThemedText>Venter på tilladelse til kameraet&hellip;</ThemedText>;
  }

  if (!cameraPermissions.granted) {
    return (
      <ThemedView>
        <ThemedText
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Vi har brug for din tilladelse til at bruge kameraet.
        </ThemedText>
        <Button
          onPress={requestCameraPermissions}
          title="Giv adgang til kameraet"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        height: "100%",
        marginHorizontal: 20,
      }}
    >
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        facing="back"
        onBarcodeScanned={qrCodeScanned}
        style={{
          height: viewfinderHeight,
          marginLeft: "auto",
          marginRight: "auto",
          width: viewfinderWidth,
        }}
        zoom={0.004}
      >
        {bounds !== undefined && (
          <View
            style={[
              {
                borderColor: "green",
                borderWidth: 2,
                position: "absolute",
              },
              {
                height: bounds.size.height,
                left: bounds.origin.x,
                top: bounds.origin.y,
                width: bounds.size.width,
              },
            ]}
          />
        )}
      </CameraView>
      <ThemedText>{scannedQrCode ?? "Ingenting"}</ThemedText>
      <SlideButton
        disabled={scannedQrCode === undefined}
        onSlide={applyScannedQrCode}
        title="Bekræft"
      />
    </ThemedView>
  );
};
