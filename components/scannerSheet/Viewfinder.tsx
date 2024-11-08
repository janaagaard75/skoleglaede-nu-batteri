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

  const scannerMargin = 30;
  const viewfinderSize = 80 * 3;

  const qrCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (resetScannedQrCodeTimeoutId !== undefined) {
      clearTimeout(resetScannedQrCodeTimeoutId);
    }

    // Verify that the scanned QR code is entirely within the visible area of the viewfinder.
    const aboveScanningArea = scanningResult.bounds.origin.y < scannerMargin;
    const belowScanningArea =
      scanningResult.bounds.origin.y + scanningResult.bounds.size.height >
      viewfinderSize - scannerMargin;
    const leftOfScanningArea = scanningResult.bounds.origin.x < scannerMargin;
    const rightOfScanningArea =
      scanningResult.bounds.origin.x + scanningResult.bounds.size.width >
      viewfinderSize - scannerMargin;

    if (
      aboveScanningArea ||
      belowScanningArea ||
      leftOfScanningArea ||
      rightOfScanningArea
    ) {
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
      <HeadUpDisplay
        scannerMargin={scannerMargin}
        viewfinderSize={viewfinderSize}
      />
      <QrCodeHighlighter bounds={bounds} />
    </CameraView>
  );
};

const HeadUpDisplay = (props: {
  scannerMargin: number;
  viewfinderSize: number;
}) => {
  const cornerBorderWidth = 4;
  const cornerOpacity = 0.4;
  const cornerRadius = 12;
  const cornerSize = 40;

  return (
    <>
      <View
        style={{
          borderColor: "white",
          borderLeftWidth: cornerBorderWidth,
          borderTopLeftRadius: cornerRadius,
          borderTopWidth: cornerBorderWidth,
          height: cornerSize,
          marginLeft: props.scannerMargin,
          marginTop: props.scannerMargin,
          opacity: cornerOpacity,
          position: "absolute",
          width: cornerSize,
        }}
      />
      <View
        style={{
          borderColor: "white",
          borderRightWidth: cornerBorderWidth,
          borderTopRightRadius: cornerRadius,
          borderTopWidth: cornerBorderWidth,
          height: cornerSize,
          marginLeft: props.viewfinderSize - (props.scannerMargin + cornerSize),
          marginTop: props.scannerMargin,
          opacity: cornerOpacity,
          position: "absolute",
          width: cornerSize,
        }}
      />
      <View
        style={{
          borderBottomLeftRadius: cornerRadius,
          borderBottomWidth: cornerBorderWidth,
          borderColor: "white",
          borderLeftWidth: cornerBorderWidth,
          height: cornerSize,
          marginLeft: props.scannerMargin,
          marginTop: props.viewfinderSize - (props.scannerMargin + cornerSize),
          opacity: cornerOpacity,
          position: "absolute",
          width: cornerSize,
        }}
      />
      <View
        style={{
          borderBottomRightRadius: cornerRadius,
          borderBottomWidth: cornerBorderWidth,
          borderColor: "white",
          borderRightWidth: cornerBorderWidth,
          height: cornerSize,
          marginLeft: props.viewfinderSize - (props.scannerMargin + cornerSize),
          marginTop: props.viewfinderSize - (props.scannerMargin + cornerSize),
          opacity: cornerOpacity,
          position: "absolute",
          width: cornerSize,
        }}
      />
    </>
  );
};

const QrCodeHighlighter = (props: { bounds: BarCodeBounds | undefined }) => {
  if (props.bounds === undefined) {
    return <></>;
  }

  return (
    <View
      style={{
        borderColor: "green",
        borderWidth: 2,
        height: props.bounds.size.height,
        left: props.bounds.origin.x,
        position: "absolute",
        top: props.bounds.origin.y,
        width: props.bounds.size.width,
      }}
    />
  );
};
