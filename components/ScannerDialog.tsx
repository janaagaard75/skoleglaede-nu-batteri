import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, View } from "react-native";
import { ThemedText } from "./themed/ThemedText";

export const ScannerDialog = () => {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  if (cameraPermissions === null) {
    return (
      <View>
        <ThemedText>Venter på tilladelse til kameraet&hellip;</ThemedText>
      </View>
    );
  }

  if (!cameraPermissions.granted) {
    return (
      <View>
        <ThemedText
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Vi har brug for din tilladelse til at bruge kameraet.
        </ThemedText>
        <Button
          onPress={requestCameraPermissions}
          title="Giv adgang til kameraet"
        />
      </View>
    );
  }

  return (
    <View>
      <CameraView facing="back">
        <View
          style={{
            backgroundColor: "transparent",
            margin: 64,
          }}
        ></View>
      </CameraView>
    </View>
  );
};
