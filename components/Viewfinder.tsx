import { BarcodeScanningResult, CameraView } from "expo-camera";
import { BarCodeBounds } from "expo-camera/build/legacy/Camera.types";
import { useState } from "react";
import { View } from "react-native";

interface Props {
  readonly onScannedQrCodeChange: (scannedQrCode: string | undefined) => void;
  readonly scannedQrCode: string | undefined;
}

export const Viewfinder = (props: Props) => {
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
