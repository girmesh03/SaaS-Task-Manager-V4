import { useSelector } from "react-redux";

/**
 * Provides Intl-based date/time formatters using the active preference timezone.
 *
 * @returns {{ formatDate: (value: string | number | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => string, formatDateTime: (value: string | number | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => string, formatRelative: (value: string | number | Date | null | undefined) => string }} Formatting helpers.
 * @throws {never} This hook does not throw.
 */
export const useIntlDateTime = () => {
  const timezone = useSelector((state) => state.preferences.timezone);

  const formatValue = (value, options) => {
    if (!value) {
      return "";
    }

    const date = value instanceof Date ? value : new Date(value);

    return new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      ...options,
    }).format(date);
  };

  return {
    formatDate(value, options = {}) {
      return formatValue(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
      });
    },
    formatDateTime(value, options = {}) {
      return formatValue(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        ...options,
      });
    },
    formatRelative(value) {
      if (!value) {
        return "";
      }

      const target = value instanceof Date ? value : new Date(value);
      const differenceMs = target.getTime() - Date.now();
      const differenceMinutes = Math.round(differenceMs / (60 * 1000));
      const formatter = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
      });

      if (Math.abs(differenceMinutes) < 60) {
        return formatter.format(differenceMinutes, "minute");
      }

      const differenceHours = Math.round(differenceMinutes / 60);

      if (Math.abs(differenceHours) < 24) {
        return formatter.format(differenceHours, "hour");
      }

      const differenceDays = Math.round(differenceHours / 24);
      return formatter.format(differenceDays, "day");
    },
  };
};
