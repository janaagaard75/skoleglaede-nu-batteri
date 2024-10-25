import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Button, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { ScannerPage } from "./ScannerPage";
import { ThemedView } from "./themed/ThemedView";
import { useThemeColor } from "./themed/useThemeColor";

export const MainPage = () => {
  const [percentage, setPercentage] = useState(50);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight - 100;
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const decreasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage - percentagePoints;
    if (newPercentage >= 0) {
      setPercentage(newPercentage);
    } else {
      setPercentage(0);
    }

    bottomSheetModalRef.current?.dismiss();
  };

  const increasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage + percentagePoints;
    if (newPercentage <= 100) {
      setPercentage(newPercentage);
    } else {
      setPercentage(100);
    }

    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <GestureHandlerRootView
      style={{
        height: "100%",
      }}
    >
      <BottomSheetModalProvider>
        <ThemedView
          style={{
            gap: 20,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <BatteryAndPercentage level={percentage} />
          <Button
            onPress={handlePresentModalPress}
            title="Scan QR-kode"
            color="gray"
          />
          <BottomSheetModal
            backgroundStyle={{
              backgroundColor: backgroundColor,
            }}
            enableDismissOnClose={true}
            enableDynamicSizing={false}
            enablePanDownToClose={true}
            handleIndicatorStyle={{
              backgroundColor: textColor,
            }}
            handleStyle={{
              backgroundColor: backgroundColor,
            }}
            ref={bottomSheetModalRef}
            snapPoints={[bottomSheetHeight]}
          >
            <BottomSheetView
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              <ScannerPage
                onDecrease={increasePercentage}
                onIncrease={decreasePercentage}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </ThemedView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
