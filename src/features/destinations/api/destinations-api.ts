import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/Response";
import type { Destination } from "../types/destination";


const API_PATH = "/destinations";

export const getDestinationById = async (id: string): Promise<Destination> => {
  const { data } = await api.get<Destination>(`${API_PATH}/${id}`);
  return data;
};

export const getDestinations = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Destination>> => {
  const { data } = await api.post<PaginatedResponse<Destination>>(`${API_PATH}/list`, {
    data: {
      page,
      pageSize,
    }
  });
  return data;
};
