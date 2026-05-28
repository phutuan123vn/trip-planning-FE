import api from "@/lib/axios";
import type { Response } from "@/types/Response";
import type { Category } from "../types/category";

export const getCategories = async (): Promise<Response<Category>> => {
  const { data } = await api.get<Response<Category>>("/categories");
  return data;
};
