import { createContext } from "react";
import { MainValues } from "./MainValues";
import { QrChange } from "./QrChange";
import { QrCode } from "./QrCode";
import {
  initialFlames,
  initialHearts,
  initialPercentage,
} from "./initialValues";

type MainState = MainValues & {
  applyQrCode: (qrCode: QrCode) => Promise<void>;
  pendingQrChange: QrChange | undefined;
  reset: () => Promise<void>;
  score: number;
  takePendingQrChange: () => QrChange | undefined;
};

const missingProvider = () =>
  Promise.reject(new Error("MainStateProvider mangler."));

export const MainStateContext = createContext<MainState>({
  applyQrCode: missingProvider,
  flames: initialFlames,
  hearts: initialHearts,
  pendingQrChange: undefined,
  percentage: initialPercentage,
  reset: missingProvider,
  score: initialPercentage,
  takePendingQrChange: () => undefined,
});
