import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useColors } from "../colors/useColors";
import { useMainState } from "../mainState/useMainState";
import { SlideToConfirm } from "../SlideToConfirm";
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
  const router = useRouter();

  const qrCode = parseQrCodeString(qrCodeString);

  const applyQrCode = () => {
    if (qrCode === undefined) {
      return;
    }

    mainState.applyQrCode(qrCode);

    // Wrapping in this conditional removes a warning from the router. Don't know why.
    if (router.canGoBack()) {
      router.back();
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
            Vi har brug for din tilladelse til at bruge kameraet.
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
            marginTop: 20 + 50,
            justifyContent: "flex-end",
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
            flames={mainState.flames}
            hearts={mainState.hearts}
            percentage={mainState.percentage}
            qrCode={qrCode}
          />
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            marginHorizontal: "auto",
            marginBottom: 80,
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
