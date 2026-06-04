import api from "@/lib/axios";
import type { Category } from "../types/category";
import type { PaginatedResponse } from "@/types/Response";
import type { PaginationParams } from "@/types/PaginationParams";

const API_PATH = "/categories";


export const getCategories = async (req: PaginationParams): Promise<PaginatedResponse<Category>> => {
  const { data } = await api.post<PaginatedResponse<Category>>(`${API_PATH}/list`, req);
  return data;
};
