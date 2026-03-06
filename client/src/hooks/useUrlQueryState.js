import { useMemo } from "react";
import { useSearchParams } from "react-router";

/**
 * Reads and writes typed URL query params based on a simple field schema.
 *
 * @param {Record<string, { defaultValue: unknown, parse?: (value: string | null) => unknown, serialize?: (value: unknown) => string | null }>} schema - Query schema.
 * @returns {[Record<string, unknown>, (patch: Record<string, unknown>) => void, URLSearchParams]} Query state tuple.
 * @throws {never} This hook does not throw.
 */
export const useUrlQueryState = (schema) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    return Object.fromEntries(
      Object.entries(schema).map(([key, config]) => {
        const parse =
          config.parse ||
          ((value) => (value == null ? config.defaultValue : value));

        return [key, parse(searchParams.get(key))];
      })
    );
  }, [schema, searchParams]);

  const updateState = (patch) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      const config = schema[key];
      const serialize =
        config?.serialize ||
        ((input) =>
          input == null || input === "" || input === config?.defaultValue
            ? null
            : String(input));
      const serializedValue = serialize(value);

      if (serializedValue == null) {
        nextSearchParams.delete(key);
      } else {
        nextSearchParams.set(key, serializedValue);
      }
    });

    setSearchParams(nextSearchParams, { replace: true });
  };

  return [state, updateState, searchParams];
};
