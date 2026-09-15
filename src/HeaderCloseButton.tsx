import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ThemedText } from "./themed/ThemedText";

export const HeaderCloseButton = () => {
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <Pressable
      accessibilityLabel="Luk"
      hitSlop={10}
      onPress={close}
    >
      <ThemedText style={{ fontSize: 22 }}>✕</ThemedText>
    </Pressable>
  );
};
