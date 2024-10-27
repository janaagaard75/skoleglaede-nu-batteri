import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import SwipeButton from "rn-swipe-button";
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
      console.log("No scanned QR code to apply.");
      return;
    }

    console.log(`Applying scanned QR code '${scannedQrCode}'.`);

    if (scannedQrCode.match(/^[+-]\d{3}pp$/)) {
      console.log("match");

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
        marginHorizontal: 20,
      }}
    >
      <Viewfinder
        onScannedQrCodeChange={updatedScannedQrCode}
        scannedQrCode={scannedQrCode}
      />
      <ThemedText>{scannedQrCode ?? "Ingenting"}</ThemedText>
      {/* <SlideButton
        disabled={scannedQrCode === undefined}
        onSlide={applyScannedQrCode}
        title="Bekræft "
      /> */}
      {/* <Button
        title="Bekræft"
        onPress={applyScannedQrCode}
      /> */}
      {/* <SwipeButton
        thumbIconWidth={100}
        thumbIconComponent={<CheckoutButton />}
        disabled={scannedQrCode === undefined}
        onSwipeStart={() => console.log("Swipe started!")}
        onSwipeSuccess={applyScannedQrCode}
        title="Bekræft"
      /> */}
      <SwipeButton
        containerStyles={{
          borderRadius: 10,
        }}
        onSwipeStart={() => setLockScannedQrCode(true)}
        onSwipeSuccess={() => applyScannedQrCode}
        titleStyles={{
          color: "lime",

          // backgroundColor: "lime",
        }}
        railStyles={{
          backgroundColor: "lime",
          borderColor: "transparent",
        }}
        thumbIconWidth={100}
        thumbIconBorderColor="#000"
        thumbIconStyles={{
          borderRadius: 6,
        }}
        // @ts-ignore
        thumbIconComponent={CheckoutButton}
        title=""
      />
    </ThemedView>
  );
};

const CheckoutButton = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 100,
      }}
    >
      <Text
        style={{
          fontSize: 16,
        }}
      >
        Bekræft
      </Text>
    </View>
  );
};
