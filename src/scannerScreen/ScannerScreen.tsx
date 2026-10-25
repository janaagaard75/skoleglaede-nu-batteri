import { useCloseModal } from "../useCloseModal";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../colors/useColors";
import { useMainState } from "../mainState/useMainState";
import { SlideToConfirm } from "../slideToConfirm/SlideToConfirm";
import { ThemedText } from "../themed/ThemedText";
import { ThemedTextButton } from "../themed/ThemedTextButton";
import { ThemedView } from "../themed/ThemedView";
import { parseQrCodeString } from "./parseQrCodeString";
import { ScannedCodeFeedback } from "./ScannedCodeFeedback";
import { Viewfinder } from "./Viewfinder";

export const ScannerScreen = () => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [qrCodeString, setQrCodeString] = useState<string | undefined>(
    undefined,
  );
  const colors = useColors();
  const mainState = useMainState();
  const closeModal = useCloseModal();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const qrCode = parseQrCodeString(qrCodeString);

  const applyQrCode = async () => {
    if (qrCode === undefined) {
      return;
    }

    await mainState.applyQrCode(qrCode);
    if (mounted.current) {
      closeModal();
    }
  };

  if (cameraPermissions === null) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.background,
          flex: 1,
        }}
      >
        <ThemedText
          style={{
            flex: 1,
            gap: 30,
            marginHorizontal: 30,
            marginTop: 30,
          }}
        >
          Venter på tilladelse til kameraet&hellip;
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (!cameraPermissions.granted) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.background,
          flex: 1,
        }}
      >
        <ThemedView
          style={{
            flex: 1,
            gap: 30,
          }}
        >
          <ThemedText
            style={{
              fontSize: 30,
              marginHorizontal: 30,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            Afventer tilladelse til at benytte kameraet
          </ThemedText>
          <ThemedTextButton onPress={requestCameraPermissions}>
            Giv adgang til kameraet
          </ThemedTextButton>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ThemedView
        style={{
          display: "flex",
          flex: 1,
          gap: 20,
        }}
      >
        <View
          style={{
            height: 220,
            justifyContent: "flex-end",
            marginTop: 20 + 50,
          }}
        >
          <Viewfinder
            onScannedQrCodeChange={setQrCodeString}
            scannedQrCode={qrCodeString}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <ScannedCodeFeedback
            qrCode={qrCode}
            unknownCode={qrCodeString !== undefined && qrCode === undefined}
          />
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            marginBottom: 80,
            marginHorizontal: "auto",
            width: 270,
          }}
        >
          <SlideToConfirm
            buttonWidth={140}
            disabled={qrCode === undefined}
            onConfirm={applyQrCode}
            sliderWidth={250}
          >
            Bekræft
          </SlideToConfirm>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
