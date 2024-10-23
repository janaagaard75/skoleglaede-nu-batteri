import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Button, Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { ScannerDialog } from "./ScannerDialog";

export const MainPage = () => {
  const [level, setLevel] = useState(50);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight - 100;

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const decreaseLevel = () => {
    const newLevel = level - 5;
    if (newLevel >= 0) {
      setLevel(newLevel);
    } else {
      setLevel(0);
    }
  };

  const increaseLevel = () => {
    const newLevel = level + 5;
    if (newLevel <= 100) {
      setLevel(newLevel);
    } else {
      setLevel(100);
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        height: "100%",
      }}
    >
      <BottomSheetModalProvider>
        <View
          style={{
            gap: 20,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <BatteryAndPercentage level={level} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 40,
              justifyContent: "center",
            }}
          >
            <Button
              title="-5"
              onPress={decreaseLevel}
            />
            <Button
              title="+5"
              onPress={increaseLevel}
            />
          </View>
          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="gray"
          />
          <BottomSheetModal
            enableDismissOnClose={true}
            enableDynamicSizing={false}
            enablePanDownToClose={true}
            ref={bottomSheetModalRef}
            snapPoints={[bottomSheetHeight]}
          >
            <BottomSheetView>
              <ScannerDialog />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
