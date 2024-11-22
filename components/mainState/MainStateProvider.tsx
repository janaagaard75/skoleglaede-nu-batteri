import { createContext, ReactNode } from "react";
import { QrCode } from "../scannerSheet/QrCode";
import { calculateNewValues } from "./calculateNewValues";
import { usePersistedState } from "./usePersistedState";

const initialFlames = 0;
const initialHearts = 0;
const initialPercentage = 20;

export const MainStateContext = createContext({
  applyQrCode: (qrCode: QrCode) => {},
  flames: initialFlames,
  hearts: initialHearts,
  percentage: initialPercentage,
  reset: () => {},
  score: 0,
});

interface Props {
  children: ReactNode;
}

export const MainStateProvider = (props: Props) => {
  const [flames, setFlames] = usePersistedState("flames", initialFlames);
  const [hearts, setHearts] = usePersistedState("hearts", initialHearts);
  const [percentage, setPercentage] = usePersistedState(
    "percentage",
    initialPercentage,
  );

  const score = percentage + 100 * hearts + 50 * flames;

  const applyQrCode = (qrCode: QrCode) => {
    const newValues = calculateNewValues(
      {
        flames: flames,
        hearts: hearts,
        percentage: percentage,
      },
      qrCode,
    );
    setFlames(newValues.newFlames);
    setHearts(newValues.newHearts);
    setPercentage(newValues.newPercentage);
  };

  const reset = () => {
    setFlames(initialFlames);
    setHearts(initialHearts);
    setPercentage(initialPercentage);
  };

  return (
    <MainStateContext.Provider
      value={{
        applyQrCode: applyQrCode,
        flames: flames,
        hearts: hearts,
        percentage: percentage,
        reset: reset,
        score: score,
      }}
    >
      {props.children}
    </MainStateContext.Provider>
  );
};
