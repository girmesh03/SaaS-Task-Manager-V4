import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of a changing value.
 *
 * @template TValue
 * @param {TValue} value - Current value.
 * @param {number} delayMs - Debounce delay in milliseconds.
 * @returns {TValue} Debounced value.
 * @throws {never} This hook does not throw.
 */
export const useDebouncedValue = (value, delayMs) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
};
