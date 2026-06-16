import api from "@/lib/axios";
import type { PaginationParams } from "@/types/PaginationParams";
import type { PaginatedResponse } from "@/types/Response";
import type { DestinationDetails } from "../types/destination";

const API_PATH = "/destinations";

export const getDestinationById = async (
  id: string,
): Promise<DestinationDetails> => {
  const { data: res } = await api.get<PaginatedResponse<DestinationDetails>>(
    `${API_PATH}/${id}`,
  );
  return res.data.length > 0
    ? res.data[0]
    : Promise.reject(new Error("Destination not found"));
};

export const getDestinations = async ({
  page,
  pageSize,
  sortBy,
  sortDirection,
  filters,
}: PaginationParams): Promise<PaginatedResponse<DestinationDetails>> => {
  const { data } = await api.post<PaginatedResponse<DestinationDetails>>(
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
