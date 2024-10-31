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
import { FlameIcon } from "./FlameIcon";
import { FlameOutlineIcon } from "./FlameOutlineIcon";
import { HeartIcon } from "./HeartIcon";
import { HeartOutlineIcon } from "./HeartOutlineIcon";
import { IconRow } from "./IconRow";
import { ResetSheet } from "./ResetSheet";
import { ScannerSheet } from "./ScannerSheet";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";

export const MainPage = () => {
  const [percentage, setPercentage] = useState(30);
  const [hearts, setHearts] = useState(3);
  const [flames, setFlames] = useState(4);
  const colors = useColors();
  const resetSheetRef = useRef<BottomSheetModal>(null);
  const scannerSheetRef = useRef<BottomSheetModal>(null);

  const maximumIcons = 10;

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight - 200;

  const changeHearts = (amount: -1 | 1) => {
    const newHearts = clamp(hearts + amount, 0, maximumIcons);
    setHearts(newHearts);
    scannerSheetRef.current?.dismiss();
  };

  const changePercentage = (percentagePoints: number) => {
    const newPercentage = clamp(percentage + percentagePoints, 0, 100);
    setPercentage(newPercentage);
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
            <IconRow
              currentValue={hearts}
              excludedIcon={<HeartOutlineIcon />}
              includedIcon={<HeartIcon />}
              maximum={maximumIcons}
            />
            <IconRow
              currentValue={flames}
              excludedIcon={<FlameOutlineIcon />}
              includedIcon={<FlameIcon />}
              maximum={maximumIcons}
            />
            <ThemedTextPressable
              onPress={() => {
                scannerSheetRef.current?.present();
              }}
              title="Scan QR-kode"
              style={{
                marginTop: 100,
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
              onPercentageChange={changePercentage}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
