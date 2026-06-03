import api from "@/lib/axios";
import type { Category } from "../types/category";

const API_PATH = "/categories";


export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.post<Category[]>(`${API_PATH}/list`);
  return data;
};
