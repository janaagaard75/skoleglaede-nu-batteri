import { clamp } from "react-native-reanimated";
import { maximumIcons } from "./maximumIcons";
import { QrCode } from "./scannerSheet/QrCode";

export const calculateNewValues = (
  currentValues: {
    flames: number;
    hearts: number;
    percentage: number;
  },
  qrCode: QrCode,
) => {
  switch (qrCode.type) {
    case "flame":
      return {
        newFlames: clamp(currentValues.flames + qrCode.amount, 0, maximumIcons),
        newHearts: currentValues.hearts,
        newPercentage: currentValues.percentage,
      };
    case "heart":
      return {
        newFlames: currentValues.flames,
        newHearts: clamp(currentValues.hearts + qrCode.amount, 0, maximumIcons),
        newPercentage: currentValues.percentage,
      };
    case "percentage":
      let newPercentage = clamp(
        currentValues.percentage + qrCode.amount,
        0,
        100,
      );
      let newHearts = currentValues.hearts;

      if (newPercentage === 100) {
        newPercentage = 30;
        newHearts = clamp(currentValues.hearts + 1, 0, maximumIcons);
      }

      return {
        newHearts: newHearts,
        newFlames: currentValues.flames,
        newPercentage: newPercentage,
      };
  }
};
