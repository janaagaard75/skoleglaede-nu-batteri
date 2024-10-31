import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { clamp } from "react-native-reanimated";
import { Backdrop } from "./Backdrop";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { useColors } from "./colors/useColors";
import { Hearts } from "./Hearts";
import { ResetSheet } from "./ResetSheet";
import { ScannerSheet } from "./ScannerSheet";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";

export const MainPage = () => {
  const [percentage, setPercentage] = useState(30);
  const [hearts, setHearts] = useState(3);
  const colors = useColors();
  const resetSheetRef = useRef<BottomSheetModal>(null);
  const scannerSheetRef = useRef<BottomSheetModal>(null);

  const maximumHearts = 10;

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight - 200;

  const changeHearts = (amount: -1 | 1) => {
    const newHearts = clamp(hearts + amount, 0, maximumHearts);
    setHearts(newHearts);
    scannerSheetRef.current?.dismiss();
  };

  const decreasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage - percentagePoints;
    if (newPercentage >= 0) {
      setPercentage(newPercentage);
    } else {
      setPercentage(0);
    }

    scannerSheetRef.current?.dismiss();
  };

  const increasePercentage = (percentagePoints: number) => {
    const newPercentage = percentage + percentagePoints;
    if (newPercentage <= 100) {
      setPercentage(newPercentage);
    } else {
      setPercentage(100);
    }

    scannerSheetRef.current?.dismiss();
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
            onPress={() => {
              resetSheetRef.current?.present();
            }}
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
            <Hearts
              current={hearts}
              maximum={maximumHearts}
            />
            <ThemedTextPressable
              onPress={() => {
                scannerSheetRef.current?.present();
              }}
              title="Scan QR-kode"
              style={{
                alignSelf: "center",
              }}
            />
          </View>
        </ThemedView>
        <BottomSheetModal
          backdropComponent={props => (
            <Backdrop
              {...props}
              onPress={resetSheetRef.current?.dismiss}
            />
          )}
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
          backdropComponent={props => (
            <Backdrop
              {...props}
              onPress={scannerSheetRef.current?.dismiss}
            />
          )}
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
          ref={scannerSheetRef}
          snapPoints={[bottomSheetHeight]}
        >
          <BottomSheetView
            style={{
              backgroundColor: colors.background,
            }}
          >
            <ScannerSheet
              onHeartsChange={changeHearts}
              onPercentageDecrease={decreasePercentage}
              onPercentageIncrease={increasePercentage}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
