import React from "react";
import { SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlameIcon } from "../iconsRow/FlameIcon";
import { FlameOutlineIcon } from "../iconsRow/FlameOutlineIcon";
import { HeartIcon } from "../iconsRow/HeartIcon";
import { HeartOutlineIcon } from "../iconsRow/HeartOutlineIcon";
import { IconsRow } from "../iconsRow/IconsRow";
import { maximumIcons } from "../mainState/maximumIcons";
import { useMainState } from "../mainState/useMainState";
import { ThemedLinkButton } from "../themed/ThemedLinkButton";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { BatteryAndPercentage } from "./BatteryAndPercentage";

export const HomeScreen = () => {
  const mainState = useMainState();

  return (
    <SafeAreaView>
      <GestureHandlerRootView
        style={{
          height: "100%",
        }}
      >
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
              <ThemedLinkButton
                href="/scan"
                style={{
                  marginBottom: 60,
                }}
              >
                Scan QR-kode
              </ThemedLinkButton>
            </View>
          </View>
        </ThemedView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};
