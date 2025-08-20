import { clamp } from "react-native-reanimated";
import { QrCode } from "./QrCode";
import { maximumIcons } from "./maximumIcons";

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

    case "percentage": {
      const unrestrictedNewPercentage = clamp(
        currentValues.percentage + qrCode.amount,
        0,
        Number.MAX_SAFE_INTEGER,
      );

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
      const overflownPercentage = unrestrictedNewPercentage - 100;

      return {
        newFlames: currentValues.flames,
        newHearts: newHearts,
        newPercentage: overflownPercentage,
      };
    }
  }
};
