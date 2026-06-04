import api from "@/lib/axios";
import type { PaginationParams } from "@/types/PaginationParams";
import type { PaginatedResponse } from "@/types/Response";
import type { Destination } from "../types/destination";

const API_PATH = "/destinations";

export const getDestinationById = async (id: string): Promise<Destination> => {
  const { data } = await api.get<Destination>(`${API_PATH}/${id}`);
  return data;
};

export const getDestinations = async ({
  page,
  pageSize,
  sortBy,
  sortDirection,
  filters,
}: PaginationParams): Promise<PaginatedResponse<Destination>> => {
  const { data } = await api.post<PaginatedResponse<Destination>>(
    `${API_PATH}/list`,
    {
      filters: filters ? filters : {},
      page,
      pageSize,
      sortBy: sortBy ? sortBy : undefined,
      sortDirection: sortDirection ? sortDirection : undefined,
    },
  );
  return data;
};
