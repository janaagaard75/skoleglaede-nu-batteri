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

  // This aspect ratio of 3:4 seems to be what the QR scanner uses.
  const viewfinderHeight = 80 * 4;
  const viewfinderWidth = 80 * 3;

  const qrCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (resetScannedQrCodeTimeoutId !== undefined) {
      clearTimeout(resetScannedQrCodeTimeoutId);
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
  );
};
