import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../colors/useColors";
import { FlameIcon } from "../iconsRow/FlameIcon";
import { FlameOutlineIcon } from "../iconsRow/FlameOutlineIcon";
import { HeartIcon } from "../iconsRow/HeartIcon";
import { HeartOutlineIcon } from "../iconsRow/HeartOutlineIcon";
import { IconsRow } from "../iconsRow/IconsRow";
import { maximumIcons } from "../mainState/maximumIcons";
import { ThemedLinkButton } from "../themed/ThemedLinkButton";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { BatteryAndPercentage } from "./BatteryAndPercentage";
import { groupDigitsWithSpaces } from "./groupDigitsWithSpaces";
import { useQrChangeAnimation } from "./useQrChangeAnimation";

export const HomeScreen = () => {
  const colors = useColors();
  const { displayedScore, displayedValues, isAnimating } =
    useQrChangeAnimation();

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
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {"Trivselsscore"}
            </ThemedText>
            <ThemedText
              accessibilityLabel={`Trivselsscore ${displayedScore}`}
              style={{
                alignSelf: "center",
                fontSize: 64,
                fontWeight: "bold",
                lineHeight: 76,
              }}
            >
              {groupDigitsWithSpaces(displayedScore)}
            </ThemedText>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <BatteryAndPercentage percentage={displayedValues.percentage} />
            <View
              style={{
                height: 40,
              }}
            />
            <IconsRow
              accessibilityLabel={`${displayedValues.hearts} hjerter`}
              animateChanges={isAnimating}
              currentValue={displayedValues.hearts}
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
              accessibilityLabel={`${displayedValues.flames} flammer`}
              animateChanges={isAnimating}
              currentValue={displayedValues.flames}
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
            <ThemedLinkButton
              href="/scan"
              style={{
                marginBottom: 80,
              }}
            >
              Scan QR-kode
            </ThemedLinkButton>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};
