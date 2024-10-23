import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { Button, View } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";

export const ScannerDialog = () => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  const barcodeScanned = (scanningResult: BarcodeScanningResult) => {
    setScannedBarcode(scanningResult.data);
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
    <ThemedView>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        facing="back"
        onBarcodeScanned={barcodeScanned}
      >
        <View
          style={{
            backgroundColor: "transparent",
            margin: 64,
          }}
        ></View>
      </CameraView>
      <ThemedText>
        {scannedBarcode === "" ? "Ingenting" : scannedBarcode}
      </ThemedText>
    </ThemedView>
  );
};
