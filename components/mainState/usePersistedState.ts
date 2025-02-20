import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export const usePersistedState = (key: string, initialValue: number) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const loadStoredValue = async () => {
      const storedValue = await SecureStore.getItemAsync(key);
      if (storedValue === null) {
        return;
      }

      setValue(parseInt(storedValue, 10));
    };

    loadStoredValue();
  }, [key]);

  const setAndSaveValue = async (newValue: number) => {
    setValue(newValue);
    await SecureStore.setItemAsync(key, newValue.toString());
  };

  return [value, setAndSaveValue] as const;
};
