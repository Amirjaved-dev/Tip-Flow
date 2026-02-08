import { useCallback, useEffect, useState } from "react";
import { isBrowser, safeLocalStorage } from "~~/utils/tipflow/storage";

/**
 * A hook that works like useState but persists the value to localStorage.
 * Safe for SSR.
 */
export function useSafeLocalStorage<T>(key: string, initialValue: T) {
  // Use a state that starts with initialValue for SSR
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Once mounted, load from localStorage
  useEffect(() => {
    if (!isBrowser) return;

    try {
      const item = safeLocalStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading from localStorage for key "${key}":`, error);
    }
  }, [key]);

  // Provide a setter that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (isBrowser) {
          safeLocalStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error saving to localStorage for key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}
