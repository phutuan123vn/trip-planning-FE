import { useInfiniteQuery } from "@tanstack/react-query";
import { getDestinations } from "../api/destinations-api";
import type { FilterParams } from "@/types/PaginationParams";

const PAGE_SIZE = 20;

export const useInfiniteDestinations = (filters?: FilterParams) =>
  useInfiniteQuery({
    queryKey: ["destinations", "infinite", filters],
    queryFn: ({ pageParam = 1 }) =>
      getDestinations({ page: pageParam as number, pageSize: PAGE_SIZE, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });
