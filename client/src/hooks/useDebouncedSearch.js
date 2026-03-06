import { useMemo } from "react";

import { useDebouncedValue } from "./useDebouncedValue";

/**
 * Normalizes and debounces search input without extra derived state churn.
 *
 * @param {{ value: string, minLength?: number, delayMs?: number }} options - Search options.
 * @returns {{ normalizedValue: string, debouncedValue: string, canSearch: boolean }} Debounced search state.
 * @throws {never} This hook does not throw.
 */
export const useDebouncedSearch = ({
  value,
  minLength = 3,
  delayMs = 300,
}) => {
  const normalizedValue = useMemo(() => String(value || "").trim(), [value]);
  const debouncedValue = useDebouncedValue(normalizedValue, delayMs);

  return useMemo(
    () => ({
      normalizedValue,
      debouncedValue,
      canSearch: debouncedValue.length >= minLength,
    }),
    [debouncedValue, minLength, normalizedValue]
  );
};
