import { ReactNode } from "react";
import { MainStateContext } from "./MainStateContext";
import { QrCode } from "./QrCode";
import { calculateNewValues } from "./calculateNewValues";
import {
  initialFlames,
  initialHearts,
  initialPercentage,
} from "./initialValues";
import { usePersistedState } from "./usePersistedState";

type Props = {
  children: ReactNode;
};

export const MainStateProvider = (props: Props) => {
  const [flames, setFlames] = usePersistedState("flames", initialFlames);
  const [hearts, setHearts] = usePersistedState("hearts", initialHearts);
  const [percentage, setPercentage] = usePersistedState(
    "percentage",
    initialPercentage,
  );

  const heartValue = 125;
  const flameValue = 50;
  const score = percentage + hearts * heartValue + flames * flameValue;

  const applyQrCode = async (qrCode: QrCode) => {
    const newValues = calculateNewValues(
      {
        flames: flames,
        hearts: hearts,
        percentage: percentage,
      },
      qrCode,
    );
    await setFlames(newValues.newFlames);
    await setHearts(newValues.newHearts);
    await setPercentage(newValues.newPercentage);
  };

  const reset = async () => {
    await setFlames(initialFlames);
    await setHearts(initialHearts);
    await setPercentage(initialPercentage);
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
