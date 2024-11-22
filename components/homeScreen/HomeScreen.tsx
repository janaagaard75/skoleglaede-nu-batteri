import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "../colors/useColors";
import { FlameIcon } from "../iconsRow/FlameIcon";
import { FlameOutlineIcon } from "../iconsRow/FlameOutlineIcon";
import { HeartIcon } from "../iconsRow/HeartIcon";
import { HeartOutlineIcon } from "../iconsRow/HeartOutlineIcon";
import { IconsRow } from "../iconsRow/IconsRow";
import { maximumIcons } from "../mainState/maximumIcons";
import { useMainState } from "../mainState/useMainState";
import { QrCode } from "../scannerSheet/QrCode";
import { ScannerSheet } from "../scannerSheet/ScannerSheet";
import { ThemedLinkButton } from "../themed/ThemedLinkButton";
import { ThemedText } from "../themed/ThemedText";
import { ThemedTextButton } from "../themed/ThemedTextButton";
import { ThemedView } from "../themed/ThemedView";
import { Backdrop } from "./Backdrop";
import { BatteryAndPercentage } from "./BatteryAndPercentage";

export const HomeScreen = () => {
  const colors = useColors();
  const mainState = useMainState();
  const scannerSheetRef = useRef<BottomSheetModal>(null);
  const safeAreaInsets = useSafeAreaInsets();

  const screenHeight = Dimensions.get("window").height;
  const verticalInset = safeAreaInsets.top + safeAreaInsets.bottom;
  const bottomSheetHeight = screenHeight - verticalInset - 90;

  const applyQrCode = (qrCode: QrCode) => {
    mainState.applyQrCode(qrCode);
    scannerSheetRef.current?.dismiss();
  };

  return (
    <SafeAreaView>
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
            <View
              style={{
                alignSelf: "flex-end",
                margin: 20,
              }}
            >
              <ThemedLinkButton href="/reset">Nulstil</ThemedLinkButton>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <ThemedText
                  style={{
                    alignSelf: "center",
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  Trivselsscore: {mainState.score}
                </ThemedText>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <BatteryAndPercentage percentage={mainState.percentage} />
                <View
                  style={{
                    height: 40,
                  }}
                />
                <IconsRow
                  currentValue={mainState.hearts}
                  excludedIcon={<HeartOutlineIcon />}
                  gap={3}
                  includedIcon={<HeartIcon />}
                  maximum={maximumIcons}
                  size={30}
                />
                <View
                  style={{
                    height: 20,
                  }}
                />
                <IconsRow
                  currentValue={mainState.flames}
                  excludedIcon={<FlameOutlineIcon />}
                  gap={3}
                  includedIcon={<FlameIcon />}
                  maximum={maximumIcons}
                  size={30}
                />
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                }}
              >
                <ThemedTextButton
                  label="Scan QR-kode"
                  onPress={() => {
                    scannerSheetRef.current?.present();
                  }}
                  style={{
                    marginBottom: 60,
                  }}
                />
              </View>
            </View>
          </ThemedView>
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
                flames={mainState.flames}
                hearts={mainState.hearts}
                onQrCodeApply={applyQrCode}
                percentage={mainState.percentage}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};
