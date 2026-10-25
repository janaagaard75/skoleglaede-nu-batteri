import { getItemAsync, setItemAsync } from "expo-secure-store";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MainStateContext } from "./MainStateContext";
import { MainValues } from "./MainValues";
import { QrChange } from "./QrChange";
import { QrCode } from "./QrCode";
import { calculateNewValues } from "./calculateNewValues";
import {
  initialFlames,
  initialHearts,
  initialPercentage,
} from "./initialValues";
import { maximumIcons } from "./maximumIcons";
import { scoreForValues } from "./scoreForValues";

type Props = { children: ReactNode };

const initialValues: MainValues = {
  flames: initialFlames,
  hearts: initialHearts,
  percentage: initialPercentage,
};

const readNumber = (
  stored: string | null,
  fallback: number,
  maximum: number,
) => {
  if (stored === null || !/^\d+$/.test(stored)) {
    return fallback;
  }
  const value = Number(stored);
  return Number.isSafeInteger(value) && value <= maximum ? value : fallback;
};

// Keep the three legacy keys so an update preserves existing progress.
const saveValues = async (values: MainValues) => {
  const writes = await Promise.allSettled([
    setItemAsync("flames", values.flames.toString()),
    setItemAsync("hearts", values.hearts.toString()),
    setItemAsync("percentage", values.percentage.toString()),
  ]);
  const failure = writes.find(result => result.status === "rejected");
  if (failure?.status === "rejected") {
    throw new Error("Kunne ikke gemme fremskridt.", { cause: failure.reason });
  }
};

export const MainStateProvider = (props: Props) => {
  const [values, setValues] = useState(initialValues);
  const [pendingQrChange, setPendingQrChange] = useState<
    QrChange | undefined
  >();
  const valuesRef = useRef(initialValues);
  const pendingRef = useRef<QrChange | undefined>(undefined);
  const queueRef = useRef(Promise.resolve());
  const hydrationRef = useRef<Promise<void> | undefined>(undefined);

  useEffect(() => {
    const lifecycle = { active: true };
    hydrationRef.current = (async () => {
      const [flames, hearts, percentage] = await Promise.all([
        getItemAsync("flames"),
        getItemAsync("hearts"),
        getItemAsync("percentage"),
      ]);
      const storedValues = {
        flames: readNumber(flames, initialFlames, maximumIcons),
        hearts: readNumber(hearts, initialHearts, maximumIcons),
        percentage: readNumber(
          percentage,
          initialPercentage,
          Number.MAX_SAFE_INTEGER,
        ),
      };
      if (lifecycle.active) {
        valuesRef.current = storedValues;
        setValues(storedValues);
      }
    })();
    // Mutation callers receive the hydration failure; never overwrite unread progress.
    void hydrationRef.current.catch(() => undefined);
    return () => {
      lifecycle.active = false;
    };
  }, []);

  const takePendingQrChange = useCallback(() => {
    const change = pendingRef.current;
    pendingRef.current = undefined;
    setPendingQrChange(undefined);
    return change;
  }, []);

  const commit = (qrCode: QrCode | undefined) => {
    const operation = queueRef.current.then(async () => {
      await hydrationRef.current;
      const previousValues = valuesRef.current;
      const calculated =
        qrCode === undefined
          ? undefined
          : calculateNewValues(previousValues, qrCode);
      const newValues =
        calculated === undefined
          ? initialValues
          : {
              flames: calculated.newFlames,
              hearts: calculated.newHearts,
              percentage: calculated.newPercentage,
            };
      try {
        await saveValues(newValues);
      } catch (error) {
        // SecureStore cannot update multiple legacy keys atomically. Restore all keys
        // before rejecting, and keep the visible state at the last committed value.
        await saveValues(previousValues).catch(() => undefined);
        throw error;
      }
      valuesRef.current = newValues;
      if (qrCode === undefined) {
        pendingRef.current = undefined;
      } else {
        pendingRef.current = {
          newValues: newValues,
          previousValues: previousValues,
          qrCode: qrCode,
        };
      }
      setPendingQrChange(pendingRef.current);
      setValues(newValues);
    });
    queueRef.current = operation.catch(() => undefined);
    return operation;
  };

  return (
    <MainStateContext.Provider
      value={{
        applyQrCode: qrCode => commit(qrCode),
        flames: values.flames,
        hearts: values.hearts,
        pendingQrChange: pendingQrChange,
        percentage: values.percentage,
        reset: () => commit(undefined),
        score: scoreForValues(values),
        takePendingQrChange: takePendingQrChange,
      }}
    >
      {props.children}
    </MainStateContext.Provider>
  );
};
