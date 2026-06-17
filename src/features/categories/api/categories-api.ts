import api from "@/lib/axios";
import type { Category } from "../types/category";
import type { PaginatedResponse } from "@/types/Response";
import type { PaginationParams } from "@/types/PaginationParams";
import type { CreateCategoryDto, UpdateCategoryDto } from "../schemas/category-schema";

const API_PATH = "/categories";

export const getCategories = async (req: PaginationParams): Promise<PaginatedResponse<Category>> => {
  const { data } = await api.post<PaginatedResponse<Category>>(`${API_PATH}/list`, req);
  return data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await api.get<PaginatedResponse<Category>>(`${API_PATH}/${id}`);
  return data.data.length > 0
    ? data.data[0]
    : Promise.reject(new Error("Category not found"));
};

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
  const { data } = await api.post<Category>(`${API_PATH}`, dto);
  return data;
};

export const updateCategory = async (id: string, dto: UpdateCategoryDto): Promise<Category> => {
  const { data } = await api.put<Category>(`${API_PATH}/${id}`, dto);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`${API_PATH}/${id}`);
};
