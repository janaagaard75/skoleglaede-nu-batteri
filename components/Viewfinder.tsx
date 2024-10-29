import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { BarCodeBounds } from "expo-camera/build/legacy/Camera.types";
import { useState } from "react";
import { Button, View } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

interface Props {
  readonly onScannedQrCodeChange: (scannedQrCode: string | undefined) => void;
  readonly scannedQrCode: string | undefined;
}

export const Viewfinder = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [bounds, setBounds] = useState<BarCodeBounds | undefined>(undefined);

  const [resetScannedQrCodeTimeoutId, setResetScannedQrCodeTimeoutId] =
    useState<NodeJS.Timeout | undefined>(undefined);

  const viewfinderSize = 70 * 3;

  const qrCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (resetScannedQrCodeTimeoutId !== undefined) {
      clearTimeout(resetScannedQrCodeTimeoutId);
    }

    // Verify that the scanned QR code is entirely within the visible area of the viewfinder.
    const aboveViewfinder = scanningResult.bounds.origin.y < 0;
    const belowViewfinder =
      scanningResult.bounds.origin.y + scanningResult.bounds.size.height >
      viewfinderSize;

    if (aboveViewfinder || belowViewfinder) {
      return;
    }

    if (scanningResult.data !== props.scannedQrCode) {
      props.onScannedQrCodeChange(scanningResult.data);
    }
    setBounds(scanningResult.bounds);

    setResetScannedQrCodeTimeoutId(setTimeout(resetScannedQrCode, 3_000));
  };

  const resetScannedQrCode = () => {
    props.onScannedQrCodeChange(undefined);
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
    <CameraView
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      facing="back"
      onBarcodeScanned={qrCodeScanned}
      style={{
        height: viewfinderSize,
        marginLeft: "auto",
        marginRight: "auto",
        width: viewfinderSize,
      }}
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
  );
};
