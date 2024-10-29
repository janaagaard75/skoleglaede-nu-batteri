import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { useColors } from "./colors/useColors";
import { ResetSheet } from "./ResetSheet";
import { ScannerPage } from "./ScannerPage";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";

export const MainPage = () => {
  const [percentage, setPercentage] = useState(30);
  const colors = useColors();
  const resetSheetRef = useRef<BottomSheetModal>(null);
  const scannerPageModalRef = useRef<BottomSheetModal>(null);

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight - 200;

  const presentResetSheet = () => {
    resetSheetRef.current?.present();
  };

  const handlePresentModalPress = useCallback(() => {
    scannerPageModalRef.current?.present();
  }, []);

  const decreasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage - percentagePoints;
    if (newPercentage >= 0) {
      setPercentage(newPercentage);
    } else {
      setPercentage(0);
    }

    scannerPageModalRef.current?.dismiss();
  };

  const increasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage + percentagePoints;
    if (newPercentage <= 100) {
      setPercentage(newPercentage);
    } else {
      setPercentage(100);
    }

    scannerPageModalRef.current?.dismiss();
  };

  const reset = () => {
    setPercentage(30);
    resetSheetRef.current?.dismiss();
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
            height: "100%",
            display: "flex",
          }}
        >
          <ThemedTextPressable
            onPress={presentResetSheet}
            style={{
              alignSelf: "flex-end",
              margin: 20,
            }}
            title="Nulstil"
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              gap: 20,
            }}
          >
            <BatteryAndPercentage level={percentage} />
            <ThemedTextPressable
              onPress={handlePresentModalPress}
              title="Scan QR-kode"
              style={{
                alignSelf: "center",
                marginLeft: 10,
              }}
            />
            <BottomSheetModal
              backgroundStyle={{
                backgroundColor: colors.background,
              }}
              enableDismissOnClose={true}
              enableDynamicSizing={false}
              enablePanDownToClose={true}
              handleIndicatorStyle={{
                backgroundColor: colors.text,
              }}
              handleStyle={{
                backgroundColor: colors.background,
              }}
              ref={resetSheetRef}
              snapPoints={[bottomSheetHeight]}
            >
              <BottomSheetView
                style={{
                  backgroundColor: colors.background,
                }}
              >
                <ResetSheet onReset={reset} />
              </BottomSheetView>
            </BottomSheetModal>
            <BottomSheetModal
              backgroundStyle={{
                backgroundColor: colors.background,
              }}
              enableDismissOnClose={true}
              enableDynamicSizing={false}
              enablePanDownToClose={true}
              handleIndicatorStyle={{
                backgroundColor: colors.text,
              }}
              handleStyle={{
                backgroundColor: colors.background,
              }}
              ref={scannerPageModalRef}
              snapPoints={[bottomSheetHeight]}
            >
              <BottomSheetView
                style={{
                  backgroundColor: colors.background,
                }}
              >
                <ScannerPage
                  onDecrease={decreasePercentage}
                  onIncrease={increasePercentage}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </ThemedView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
