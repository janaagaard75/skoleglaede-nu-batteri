import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculateNewValues } from "../calculateNewValues";
import { useColors } from "../colors/useColors";
import { FlameIcon } from "../iconsRow/FlameIcon";
import { FlameOutlineIcon } from "../iconsRow/FlameOutlineIcon";
import { HeartIcon } from "../iconsRow/HeartIcon";
import { HeartOutlineIcon } from "../iconsRow/HeartOutlineIcon";
import { IconsRow } from "../iconsRow/IconsRow";
import { maximumIcons } from "../maximumIcons";
import { QrCode } from "../scannerSheet/QrCode";
import { ScannerSheet } from "../scannerSheet/ScannerSheet";
import { ThemedLinkButton } from "../themed/ThemedLinkButton";
import { ThemedText } from "../themed/ThemedText";
import { ThemedTextButton } from "../themed/ThemedTextButton";
import { ThemedView } from "../themed/ThemedView";
import { Backdrop } from "./Backdrop";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { usePersistedState } from "./usePersistedState";

export const HomeScreen = () => {
  const initialFlames = 0;
  const initialHearts = 0;
  const initialPercentage = 20;

  const [flames, setFlames] = usePersistedState("flames", initialFlames);
  const [hearts, setHearts] = usePersistedState("hearts", initialHearts);
  const [percentage, setPercentage] = usePersistedState(
    "percentage",
    initialPercentage,
  );
  const colors = useColors();
  const resetSheetRef = useRef<BottomSheetModal>(null);
  const scannerSheetRef = useRef<BottomSheetModal>(null);
  const safeAreaInsets = useSafeAreaInsets();

  const screenHeight = Dimensions.get("window").height;
  const verticalInset = safeAreaInsets.top + safeAreaInsets.bottom;
  const bottomSheetHeight = screenHeight - verticalInset - 90;

  const score = percentage + 100 * hearts + 50 * flames;

  const applyQrCode = (qrCode: QrCode) => {
    const newValues = calculateNewValues(
      { flames, hearts, percentage },
      qrCode,
    );
    setFlames(newValues.newFlames);
    setHearts(newValues.newHearts);
    setPercentage(newValues.newPercentage);
    scannerSheetRef.current?.dismiss();
  };

  const reset = () => {
    setFlames(initialFlames);
    setHearts(initialHearts);
    setPercentage(initialPercentage);
    resetSheetRef.current?.dismiss();
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
                  Trivselsscore: {score}
                </ThemedText>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <BatteryAndPercentage percentage={percentage} />
                <View
                  style={{
                    height: 40,
                  }}
                />
                <IconsRow
                  currentValue={hearts}
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
                  currentValue={flames}
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
                flames={flames}
                hearts={hearts}
                onQrCodeApply={applyQrCode}
                percentage={percentage}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};
