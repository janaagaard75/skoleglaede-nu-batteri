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

export const ScannerPage = () => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  const [bounds, setBounds] = useState<BarCodeBounds | undefined>(undefined);
  const [scannedBarcode, setScannedBarcode] = useState<string | undefined>(
    undefined
  );
  const [resetScannedBarcodeTimeoutId, setResetScannedBarcodeTimeoutId] =
    useState<NodeJS.Timeout | undefined>(undefined);

  const barcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (resetScannedBarcodeTimeoutId !== undefined) {
      clearTimeout(resetScannedBarcodeTimeoutId);
    }

    setScannedBarcode(scanningResult.data);
    setBounds(scanningResult.bounds);

    setResetScannedBarcodeTimeoutId(setTimeout(resetScannedBarcode, 3_000));
  };

  const resetScannedBarcode = () => {
    setScannedBarcode(undefined);
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
    <ThemedView style={{ height: "100%" }}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        facing="back"
        onBarcodeScanned={barcodeScanned}
        style={{
          height: 20 * 16,
          marginLeft: "auto",
          marginRight: "auto",
          width: 20 * 10,
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
      <ThemedText>{scannedBarcode ?? "Ingenting"}</ThemedText>
    </ThemedView>
  );
};
