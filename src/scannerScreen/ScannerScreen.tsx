import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../colors/useColors";
import { QrCode } from "../mainState/QrCode";
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
  const router = useRouter();

  const qrCode = parseQrCodeString(qrCodeString);

  const [confirmationInProgress, setConfirmationInProgress] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const selectedQrCode = useRef<QrCode | undefined>(undefined);
  const confirmed = useRef(false);
  const mounted = useRef(true);

  const receiveScannedQrCode = useCallback((value: string | undefined) => {
    // Ignore camera callbacks already queued when the confirmation started.
    if (selectedQrCode.current === undefined && !confirmed.current) {
      setQrCodeString(value);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const beginConfirmation = () => {
    if (qrCode === undefined || confirmed.current) {
      return;
    }
    selectedQrCode.current = qrCode;
    // Native gesture callbacks can reach JS after another camera event rendered.
    // Lock the preview to the same captured code that this gesture will apply.
    setQrCodeString(qrCodeString);
    setError(undefined);
    setConfirmationInProgress(true);
  };

  const cancelConfirmation = () => {
    if (confirmed.current) {
      return;
    }
    selectedQrCode.current = undefined;
    setConfirmationInProgress(false);
  };

  const applyQrCode = async () => {
    const selected = selectedQrCode.current;
    if (selected === undefined || confirmed.current) {
      return;
    }
    confirmed.current = true;
    setApplying(true);
    try {
      await Promise.resolve(mainState.applyQrCode(selected));
      if (mounted.current) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/");
        }
      }
    } catch {
      if (mounted.current) {
        confirmed.current = false;
        selectedQrCode.current = undefined;
        setConfirmationInProgress(false);
        setApplying(false);
        setError("Ændringen kunne ikke gemmes. Prøv igen.");
      }
    }
  };

  if (cameraPermissions === null) {
    return (
      <SafeAreaView
        edges={["bottom", "left", "right"]}
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
        edges={["bottom", "left", "right"]}
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
      edges={["bottom", "left", "right"]}
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
            marginTop: 50,
          }}
        >
          <Viewfinder
            onScannedQrCodeChange={receiveScannedQrCode}
            paused={confirmationInProgress}
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
          {error !== undefined && (
            <ThemedText accessibilityRole="alert">{error}</ThemedText>
          )}
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            marginBottom: 30,
            marginHorizontal: "auto",
            width: 270,
          }}
        >
          <SlideToConfirm
            buttonWidth={140}
            disabled={qrCode === undefined || applying}
            onConfirm={applyQrCode}
            onInteractionCancel={cancelConfirmation}
            onInteractionStart={beginConfirmation}
            sliderWidth={250}
          >
            Bekræft
          </SlideToConfirm>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
