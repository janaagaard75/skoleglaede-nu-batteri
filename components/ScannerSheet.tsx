import { useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { View } from "react-native";
import { Battery } from "./Battery";
import { getNewValues } from "./getNewValues";
import { FlameIcon } from "./iconsRow/FlameIcon";
import { FlameOutlineIcon } from "./iconsRow/FlameOutlineIcon";
import { HeartIcon } from "./iconsRow/HeartIcon";
import { HeartOutlineIcon } from "./iconsRow/HeartOutlineIcon";
import { IconsRow } from "./iconsRow/IconsRow";
import { parseQrCodeString } from "./parseQrCodeString";
import { QrCode } from "./QrCode";
import { SlideToConfirm } from "./SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { ThemedTextPressable } from "./themed/ThemedTextPressable";
import { ThemedView } from "./themed/ThemedView";
import { Viewfinder } from "./Viewfinder";

interface Props {
  flames: number;
  hearts: number;
  onQrCodeApply(qrCode: QrCode): void;
  percentage: number;
}

export const ScannerSheet = (props: Props) => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [qrCodeString, setQrCodeString] = useState<string | undefined>(
    undefined,
  );

  const qrCode = parseQrCodeString(qrCodeString);

  const applyQrCode = () => {
    if (qrCode === undefined) {
      return;
    }

    props.onQrCodeApply(qrCode);
  };

  if (cameraPermissions === null) {
    return (
      <ThemedText
        style={{
          height: "100%",
          marginHorizontal: 30,
          gap: 30,
          marginTop: 30,
        }}
      >
        Venter på tilladelse til kameraet&hellip;
      </ThemedText>
    );
  }

  if (!cameraPermissions.granted) {
    return (
      <ThemedView
        style={{
          height: "100%",
          marginHorizontal: 30,
          gap: 30,
          marginTop: 30,
        }}
      >
        <ThemedText
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Vi har brug for din tilladelse til at bruge kameraet.
        </ThemedText>
        <ThemedTextPressable
          onPress={requestCameraPermissions}
          style={{
            alignSelf: "center",
          }}
          title="Giv adgang til kameraet"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        display: "flex",
        gap: 20,
        height: "100%",
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 30,
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
          flames={props.flames}
          hearts={props.hearts}
          percentage={props.percentage}
          qrCode={qrCode}
        />
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          marginBottom: 40,
          marginHorizontal: 30,
        }}
      >
        <SlideToConfirm
          disabled={qrCode === undefined}
          onConfirm={applyQrCode}
          title="Bekræft &nbsp;&#x21E8;"
        />
      </View>
    </ThemedView>
  );
};

const ScannedCodeFeedback = ({
  flames,
  hearts,
  percentage,
  qrCode,
}: {
  flames: number;
  hearts: number;
  percentage: number;
  qrCode: QrCode | undefined;
}) => {
  if (qrCode === undefined) {
    return (
      <ThemedText
        style={{
          textAlign: "center",
        }}
      >
        Scan en QR-kode
      </ThemedText>
    );
  }

  const newValues = getNewValues({ flames, hearts, percentage }, qrCode);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <Summary
        flames={flames}
        hearts={hearts}
        percentage={percentage}
      />
      <View
        style={{
          width: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>&#x21E8;</ThemedText>
      </View>
      <Summary
        flames={newValues.newFlames}
        hearts={newValues.newHearts}
        percentage={newValues.newPercentage}
      />
    </View>
  );
};

const Summary = ({
  flames,
  hearts,
  percentage,
}: {
  flames: number;
  hearts: number;
  percentage: number;
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
    }}
  >
    <View
      style={{
        alignItems: "center",
      }}
    >
      <View
        style={{
          alignContent: "center",
          marginLeft: 20,
          width: 80,
        }}
      >
        <Battery percentage={percentage} />
      </View>
      <View
        style={{
          height: 5,
        }}
      />
      <IconsRow
        currentValue={flames}
        excludedIcon={<FlameOutlineIcon />}
        gap={1}
        includedIcon={<FlameIcon />}
        maximum={10}
        size={12}
      />
      <View
        style={{
          height: 5,
        }}
      />
      <IconsRow
        currentValue={hearts}
        excludedIcon={<HeartOutlineIcon />}
        gap={1}
        includedIcon={<HeartIcon />}
        maximum={10}
        size={12}
      />
    </View>
  </View>
);
