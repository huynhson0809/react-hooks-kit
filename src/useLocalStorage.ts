import { useState, useCallback } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // quota exceeded or storage unavailable
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // storage unavailable
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
