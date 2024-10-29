import { decode } from "html-entities";
import React, { useState } from "react";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";
import { Viewfinder } from "./Viewfinder";

interface Props {
  onDecrease(percentagePoints: number): void;
  onIncrease(percentagePoints: number): void;
}

export const ScannerPage = (props: Props) => {
  const [scannedQrCode, setScannedQrCode] = useState<string | undefined>(
    undefined,
  );
  const [lockScannedQrCode, setLockScannedQrCode] = useState<boolean>(false);

  const applyScannedQrCode = () => {
    setLockScannedQrCode(false);

    if (scannedQrCode === undefined) {
      return;
    }

    if (scannedQrCode.match(/^[+-]\d{3}pp$/)) {
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

  const updatedScannedQrCode = (newQrCode: string | undefined) => {
    if (lockScannedQrCode) {
      return;
    }

    setScannedQrCode(newQrCode);
  };

  const label = getLabel(scannedQrCode);

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
        onScannedQrCodeChange={updatedScannedQrCode}
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
