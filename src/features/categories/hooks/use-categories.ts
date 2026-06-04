import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories-api";
import type { PaginationParams } from "@/types/PaginationParams";

export const categoryKeys = {
  list: (params: PaginationParams) => ["categories", params] as const,
};

export const useCategories = (req: PaginationParams) =>
  useQuery({
    queryKey: categoryKeys.list(req),
    queryFn: () => getCategories(req),
  });
