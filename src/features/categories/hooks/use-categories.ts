import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../api/categories-api";
import type { PaginationParams } from "@/types/PaginationParams";
import type { CreateCategoryDto, UpdateCategoryDto } from "../schemas/category-schema";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params: PaginationParams) => ["categories", params] as const,
  detail: (id: string) => ["categories", id] as const,
};

export const useCategories = (req: PaginationParams) =>
  useQuery({
    queryKey: categoryKeys.list(req),
    queryFn: () => getCategories(req),
  });

export const useCategoryDetail = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDto }) =>
      updateCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
