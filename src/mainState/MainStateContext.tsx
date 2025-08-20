import { createContext } from "react";
import {
  initialFlames,
  initialHearts,
  initialPercentage,
} from "./initialValues";
import { QrCode } from "./QrCode";

export const MainStateContext = createContext({
  applyQrCode: (qrCode: QrCode) => {},
  flames: initialFlames,
  hearts: initialHearts,
  percentage: initialPercentage,
  reset: () => {},
  score: 0,
});
