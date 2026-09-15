import { useColorScheme } from "react-native";
import { Colors } from "./Colors";

export const useColors = () => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  return Colors[theme];
};
