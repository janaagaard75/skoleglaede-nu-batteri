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
      const unrestrictedNewPercentage =
        currentValues.percentage + qrCode.amount;

      if (unrestrictedNewPercentage <= 100) {
        return {
          newFlames: currentValues.flames,
          newHearts: currentValues.hearts,
          newPercentage: unrestrictedNewPercentage,
        };
      }

      if (currentValues.hearts === maximumIcons) {
        return {
          newFlames: currentValues.flames,
          newHearts: currentValues.hearts,
          newPercentage: 100,
        };
      }

      const newHearts = currentValues.hearts + 1;
      const restrictedPercentage = unrestrictedNewPercentage - 100;

      return {
        newHearts: newHearts,
        newFlames: currentValues.flames,
        newPercentage: restrictedPercentage,
      };
  }
};
