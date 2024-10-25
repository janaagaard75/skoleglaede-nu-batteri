/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorDark = "#fff";
const tintColorLight = "#0a7ea4";

export const Colors = {
  dark: {
    background: "#151718",
    disabledText: "#666",
    icon: "#9ba1a6",
    tabIconDefault: "#9ba1a6",
    tabIconSelected: tintColorDark,
    text: "#ecedee",
    tint: tintColorDark,
  },
  light: {
    background: "#fff",
    disabledText: "#999",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    text: "#11181c",
    tint: tintColorLight,
  },
};
