import { BarcodeBounds, BarcodeScanningResult, CameraView } from "expo-camera";
import { memo, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useColors } from "../colors/useColors";

type Challenger = {
  bounds: BarcodeBounds;
  data: string;
  firstSeenAt: number;
  lastSeenAt: number;
};

type Props = {
  readonly onScannedQrCodeChange: (scannedQrCode: string | undefined) => void;
  readonly scannedQrCode: string | undefined;
};

export const Viewfinder = (props: Props) => {
  const [bounds, setBounds] = useState<BarcodeBounds | undefined>(undefined);
  const challengerRef = useRef<Challenger | undefined>(undefined);
  const colors = useColors();
  const scannedQrCodeRef = useRef(props.scannedQrCode);
  const scannedQrCodeLastSeenAtRef = useRef(0);
  const resetScannedQrCodeTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const debounceDuration = 400;
  const scannerMargin = 50;
  const viewfinderSize = 90 * 3;

  useEffect(
    () => () => {
      if (resetScannedQrCodeTimeoutRef.current !== undefined) {
        clearTimeout(resetScannedQrCodeTimeoutRef.current);
      }
    },
    [],
  );

  const qrCodeScanned = (scanningResult: BarcodeScanningResult) => {
    // Verify that the scanned QR code is entirely within the visible area of the viewfinder.
    const aboveScanningArea = scanningResult.bounds.origin.y < scannerMargin;
    const belowScanningArea =
      scanningResult.bounds.origin.y + scanningResult.bounds.size.height
      > viewfinderSize - scannerMargin;
    const leftOfScanningArea = scanningResult.bounds.origin.x < scannerMargin;
    const rightOfScanningArea =
      scanningResult.bounds.origin.x + scanningResult.bounds.size.width
      > viewfinderSize - scannerMargin;

    if (
      aboveScanningArea
      || belowScanningArea
      || leftOfScanningArea
      || rightOfScanningArea
    ) {
      return;
    }

    if (resetScannedQrCodeTimeoutRef.current !== undefined) {
      clearTimeout(resetScannedQrCodeTimeoutRef.current);
    }

    const now = Date.now();

    if (
      scannedQrCodeRef.current === undefined
      || scanningResult.data === scannedQrCodeRef.current
    ) {
      scannedQrCodeLastSeenAtRef.current = now;
      challengerRef.current = undefined;

      if (scanningResult.data !== scannedQrCodeRef.current) {
        scannedQrCodeRef.current = scanningResult.data;
        props.onScannedQrCodeChange(scanningResult.data);
      }

      updateBounds(scanningResult.bounds);
    } else {
      const updatedChallenger = updateChallenger(scanningResult, now);
      const scannedQrCodeKeepsItsLock =
        now - scannedQrCodeLastSeenAtRef.current <= debounceDuration;
      const challengerHasBeenInSightLongEnough =
        now - updatedChallenger.firstSeenAt >= debounceDuration;

      if (!scannedQrCodeKeepsItsLock && challengerHasBeenInSightLongEnough) {
        scannedQrCodeLastSeenAtRef.current = now;
        scannedQrCodeRef.current = updatedChallenger.data;
        props.onScannedQrCodeChange(updatedChallenger.data);
        updateBounds(updatedChallenger.bounds);
        challengerRef.current = undefined;
      }
    }

    resetScannedQrCodeTimeoutRef.current = setTimeout(
      resetScannedQrCode,
      3_000,
    );
  };

  const updateChallenger = (
    scanningResult: BarcodeScanningResult,
    now: number,
  ): Challenger => {
    const previous = challengerRef.current;
    const firstSeenAt =
      previous !== undefined
      && previous.data === scanningResult.data
      && now - previous.lastSeenAt <= debounceDuration
        ? previous.firstSeenAt
        : now;

    challengerRef.current = {
      bounds: scanningResult.bounds,
      data: scanningResult.data,
      firstSeenAt: firstSeenAt,
      lastSeenAt: now,
    };

    return challengerRef.current;
  };

  const updateBounds = (newBounds: BarcodeBounds) => {
    if (
      bounds === undefined
      || bounds.origin.x !== newBounds.origin.x
      || bounds.origin.y !== newBounds.origin.y
      || bounds.size.height !== newBounds.size.height
      || bounds.size.width !== newBounds.size.width
    ) {
      setBounds(newBounds);
    }
  };

  const resetScannedQrCode = () => {
    resetScannedQrCodeTimeoutRef.current = undefined;
    challengerRef.current = undefined;
    scannedQrCodeRef.current = undefined;
    scannedQrCodeLastSeenAtRef.current = 0;
    props.onScannedQrCodeChange(undefined);
    setBounds(undefined);
  };

  return (
    <View
      style={{
        height: viewfinderSize,
        marginLeft: "auto",
        marginRight: "auto",
        width: viewfinderSize,
      }}
    >
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        facing="back"
        onBarcodeScanned={qrCodeScanned}
        style={{
          backgroundColor: colors.disabledText,
          height: "100%",
          width: "100%",
        }}
      />
      <HeadUpDisplay
        scannerMargin={scannerMargin}
        viewfinderSize={viewfinderSize}
      />
      <QrCodeHighlighter bounds={bounds} />
    </View>
  );
};

const HeadUpDisplay = memo(
  (props: { scannerMargin: number; viewfinderSize: number }) => {
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
            marginLeft:
              props.viewfinderSize - (props.scannerMargin + cornerSize),
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
            marginTop:
              props.viewfinderSize - (props.scannerMargin + cornerSize),
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
            marginLeft:
              props.viewfinderSize - (props.scannerMargin + cornerSize),
            marginTop:
              props.viewfinderSize - (props.scannerMargin + cornerSize),
            opacity: cornerOpacity,
            position: "absolute",
            width: cornerSize,
          }}
        />
      </>
    );
  },
);

const QrCodeHighlighter = memo(
  (props: { bounds: BarcodeBounds | undefined }) => {
    const green = useColors().green;

    if (props.bounds === undefined) {
      return <></>;
    }

    return (
      <View
        style={{
          borderColor: green,
          borderWidth: 2,
          height: props.bounds.size.height,
          left: props.bounds.origin.x,
          position: "absolute",
          top: props.bounds.origin.y,
          width: props.bounds.size.width,
        }}
      />
    );
  },
);
