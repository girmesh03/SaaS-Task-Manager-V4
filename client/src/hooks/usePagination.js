import { PAGE_SIZE } from "../utils/constants";
import { useUrlQueryState } from "./useUrlQueryState";

/**
 * Standardizes URL-backed 1-based pagination state.
 *
 * @returns {{ page: number, pageSize: number, setPage: (page: number) => void }} Pagination state.
 * @throws {never} This hook does not throw.
 */
export const usePagination = () => {
  const [queryState, setQueryState] = useUrlQueryState({
    page: {
      defaultValue: 1,
      parse: (value) => {
        const parsed = Number.parseInt(value || "1", 10);
        return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
      },
      serialize: (value) => (Number(value) <= 1 ? null : String(value)),
    },
  });

  return {
    page: queryState.page,
    pageSize: PAGE_SIZE,
    setPage(page) {
      setQueryState({ page });
    },
  };
};
