import { useCameraPermissions } from "expo-camera";
import { decode } from "html-entities";
import React, { useState } from "react";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";
import { Viewfinder } from "./Viewfinder";

interface Props {
  onHeartsChange(amount: -1 | 1): void;
  onPercentageChange(percentagePoints: number): void;
}

export const ScannerSheet = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [scannedQrCode, setScannedQrCode] = useState<string | undefined>(
    undefined,
  );

  const applyScannedQrCode = () => {
    if (scannedQrCode === undefined) {
      return;
    }

    if (scannedQrCode.match(/^[+-]\d{3}pp$/)) {
      const operation = scannedQrCode[0];
      const absolutePercentagePoints = parseInt(scannedQrCode.slice(1, 4), 10);
      const percentagePoints = (() => {
        switch (operation) {
          case "-":
            return -absolutePercentagePoints;
          case "+":
            return absolutePercentagePoints;
          default:
            throw new Error(`The operation ${operation} is not supported.`);
        }
      })();

      props.onPercentageChange(percentagePoints);
    }

    if (scannedQrCode.match(/^[+-]heart$/)) {
      const operation = scannedQrCode[0];
      const value = (() => {
        switch (operation) {
          case "-":
            return -1;
          case "+":
            return 1;
          default:
            throw new Error(`The operation ${operation} is not supported.`);
        }
      })();

      props.onHeartsChange(value);
    }
  };

  const label = getLabel(scannedQrCode);

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
        height: "100%",
        marginHorizontal: 30,
        gap: 30,
        marginTop: 30,
      }}
    >
      <Viewfinder
        onScannedQrCodeChange={setScannedQrCode}
        scannedQrCode={scannedQrCode}
      />
      <ThemedText
        style={{
          textAlign: "center",
        }}
      >
        {label}
      </ThemedText>
      <SlideToConfirm
        disabled={scannedQrCode === undefined}
        onConfirm={applyScannedQrCode}
        title="Bekræft &nbsp;&#x21E8;"
      />
    </ThemedView>
  );
};

const getLabel = (scannedQrCode: string | undefined) => {
  if (scannedQrCode === undefined) {
    return "Scan en QR-kode";
  }

  if (scannedQrCode.match(/^[+-]\d{3}pp$/)) {
    const operation = scannedQrCode[0];
    const percentagePoints = parseInt(scannedQrCode.slice(1, 4), 10);

    switch (operation) {
      case "-":
        return `+ ${percentagePoints} %`;
      case "+":
        return decode(`&minus; ${percentagePoints} %`);
    }
  }
};
