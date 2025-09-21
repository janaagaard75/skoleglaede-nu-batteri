import { createContext } from "react";
import {
  initialFlames,
  initialHearts,
  initialPercentage,
} from "./initialValues";
import { QrCode } from "./QrCode";

export const MainStateContext = createContext({
  applyQrCode: (_qrCode: QrCode) => {
    // Not yet defined.
  },
  flames: initialFlames,
  hearts: initialHearts,
  percentage: initialPercentage,
  reset: () => {
    // Not yet defined.
  },
  score: 0,
});
