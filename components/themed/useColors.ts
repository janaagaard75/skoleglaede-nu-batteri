import { useColorScheme } from "react-native";
import { Colors } from "./Colors";

export const useColors = () => {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
};
