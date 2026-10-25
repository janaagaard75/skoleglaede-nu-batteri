import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Battery } from "./battery/Battery";
import { useColors } from "./colors/useColors";
import { FlameIcon } from "./iconsRow/FlameIcon";
import { FlameOutlineIcon } from "./iconsRow/FlameOutlineIcon";
import { HeartIcon } from "./iconsRow/HeartIcon";
import { HeartOutlineIcon } from "./iconsRow/HeartOutlineIcon";
import { IconsRow } from "./iconsRow/IconsRow";
import { maximumIcons } from "./mainState/maximumIcons";
import { useMainState } from "./mainState/useMainState";
import { SlideToConfirm } from "./slideToConfirm/SlideToConfirm";
import { ThemedText } from "./themed/ThemedText";
import { useCloseModal } from "./useCloseModal";

export const ResetScreen = () => {
  const colors = useColors();
  const closeModal = useCloseModal();
  const mainState = useMainState();
  const confirming = useRef(false);
  const mounted = useRef(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const reset = async () => {
    if (confirming.current) {
      return;
    }

    confirming.current = true;
    setPending(true);
    setError(false);

    try {
      await mainState.reset();

      if (mounted.current) {
        closeModal();
      }
    } catch {
      if (mounted.current) {
        confirming.current = false;
        setPending(false);
        setError(true);
      }
    }
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 30,
          justifyContent: "space-between",
          padding: 24,
        }}
      >
        <View style={{ gap: 30 }}>
          <ThemedText>
            Bekræft at du vil nulstille til 20% og fjerne alle hjerter og
            flammer.
          </ThemedText>
          <View
            style={{
              alignItems: "center",
              alignSelf: "center",
              width: 180,
            }}
          >
            <Battery percentage={20} />
          </View>
          <View style={{ gap: 16 }}>
            <IconsRow
              accessibilityLabel="0 hjerter"
              currentValue={0}
              excludedIcon={<HeartOutlineIcon />}
              gap={2}
              includedIcon={<HeartIcon />}
              maximum={maximumIcons}
              size={24}
            />
            <IconsRow
              accessibilityLabel="0 flammer"
              currentValue={0}
              excludedIcon={<FlameOutlineIcon />}
              gap={2}
              includedIcon={<FlameIcon />}
              maximum={maximumIcons}
              size={24}
            />
          </View>
          {error && (
            <ThemedText accessibilityRole="alert">
              Nulstillingen kunne ikke gemmes. Prøv igen.
            </ThemedText>
          )}
        </View>
        <View style={{ alignItems: "center" }}>
          <SlideToConfirm
            buttonWidth={140}
            disabled={pending}
            onConfirm={reset}
            sliderWidth={250}
          >
            Bekræft
          </SlideToConfirm>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
