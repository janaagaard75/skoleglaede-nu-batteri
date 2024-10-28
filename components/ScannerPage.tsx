import React, { useRef, useState } from "react";
import { SlideToConfirmButton } from "./SlideToConfirmButton";
import { ThemedText } from "./themed/ThemedText";
import { ThemedView } from "./themed/ThemedView";
import { Viewfinder } from "./Viewfinder";

interface Props {
  onDecrease(percentagePoints: number): void;
  onIncrease(percentagePoints: number): void;
}

export const ScannerPage = (props: Props) => {
  const [scannedQrCode, setScannedQrCode] = useState<string | undefined>(
    undefined
  );
  const [lockScannedQrCode, setLockScannedQrCode] = useState<boolean>(false);
  const resetScannedQrCodeTimeoutId = useRef<NodeJS.Timeout | undefined>(
    undefined
  );

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
      <ThemedText>{scannedQrCode ?? "Ingenting"}</ThemedText>
      <SlideToConfirmButton
        disabled={scannedQrCode === undefined}
        onConfirm={applyScannedQrCode}
        title="Bekræft "
      />
    </ThemedView>
  );
};
